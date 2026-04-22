/*
 * App shell for DevQuest.
 *
 * Responsibilities:
 * - keep shared score and completion state
 * - render the menu and final scoreboard
 * - provide each game with a small API (`mount`, `menu`, `finish`)
 * - apply the shared time bonus when a game reports its base score
 */

import { safeHtml } from './src/utils.js';
import { renderBugHunt } from './src/games/bugHunt.js';
import { renderPasswordRiddle } from './src/games/passwordRiddle.js';
import { renderDesignQuiz } from './src/games/designDuel.js';
import { renderTestLab } from './src/games/testLab.js';

const app = document.querySelector('#app');

const gameState = {
  completed: {},
  scores: {},
  lastResult: {},
};

// The menu reads this registry to build cards, score limits, pacing targets, and launch hooks.
const games = [
  {
    id: 'bug-hunt',
    title: 'Bug Hunt',
    short: 'Suche Code-Fehler und bringe den Roboter in 5 Leveln ins Ziel.',
    maxScore: 25,
    minMinutes: 3,
    maxMinutes: 5,
    discussion: 'Wie konntet ihr die Bugs am schnellsten finden? Ausprobieren oder genaues Lesen? Wusstet ihr das Bugs finden ein großer Teil der Software-Entwicklung ist?',
    render: renderBugHunt,
  },
  {
    id: 'passwort-raetsel',
    title: 'Passwort-Logik-Rätsel',
    short: 'Nutze Hinweise und Logik, um 5 kurze Fälle zu lösen.',
    maxScore: 25,
    minMinutes: 3,
    maxMinutes: 5,
    discussion: 'Wie seid ihr an die Fälle rangegangen? Habt ihr zuerst alle Hinweise gelesen oder direkt losgelegt? Wusstet ihr, dass logisches Denken in vielen IT-Berufen eine zentrale Rolle spielt?',
    render: renderPasswordRiddle,
  },
  {
    id: 'design-duell',
    title: 'Design-Duell',
    short: 'Vergleiche echte Handy-Layouts und triff in 5 Duellen smarte UX-Entscheidungen.',
    maxScore: 25,
    minMinutes: 3,
    maxMinutes: 5,
    discussion: 'Gab es einen Moment, bei dem euch klar wurde, warum etwas besser funktioniert? Ist euch bewusst geworden, wie Design unsere Entscheidungen lenkt?',
    render: renderDesignQuiz,
  },
  {
    id: 'test-labor',
    title: 'Test-Labor',
    short: 'Teste 5 kleine Landingpages und markiere sichtbare Bugs.',
    maxScore: 25,
    minMinutes: 3,
    maxMinutes: 5,
    discussion: 'Welcher Bug würde echte Nutzer:innen wohl am schnellsten abschrecken? Wusstet ihr, dass Usability-Tests ein wichtiger Bestandteil der Software-Entwicklung sind?',
    render: renderTestLab,
  },
];

const gameMap = Object.fromEntries(games.map((game) => [game.id, game]));
const totalMax = games.reduce((sum, game) => sum + game.maxScore, 0);
const totalMinMinutes = games.reduce((sum, game) => sum + game.minMinutes, 0);
const totalMaxMinutes = games.reduce((sum, game) => sum + game.maxMinutes, 0);

function getTotalScore() {
  return Object.values(gameState.scores).reduce((sum, value) => sum + value, 0);
}

function allFinished() {
  return games.every((game) => gameState.completed[game.id]);
}

function completionText() {
  const done = games.filter((game) => gameState.completed[game.id]).length;
  return `${done}/${games.length} Missionen abgeschlossen`;
}

function scoreMessage(score) {
  const ratio = totalMax === 0 ? 0 : score / totalMax;
  if (ratio >= 0.8) return 'Mega! Du hast Bugs, Logik, Design und Tests richtig stark gemeistert.';
  if (ratio >= 0.55) return 'Stark! Du hast ein gutes Gefühl für typische Aufgaben im Software-Team.';
  if (ratio >= 0.3) return 'Guter Lauf! Mit etwas Übung wirst du noch sicherer.';
  return 'Super Einstieg! Genau so entdeckt man Schritt für Schritt die IT-Welt.';
}

function goMenu() {
  renderMenu();
}

function saveResult(gameId, score, detail) {
  const game = gameMap[gameId];
  const bounded = Math.max(0, Math.min(score, game.maxScore));
  gameState.completed[gameId] = true;
  gameState.scores[gameId] = bounded;
  gameState.lastResult[gameId] = detail;
}

function getTimeBonus(elapsedMs, minMinutes, maxMinutes) {
  const fullMinutes = Math.floor(elapsedMs / 60000);

  if (fullMinutes < minMinutes) return 5;
  if (fullMinutes > maxMinutes) return 0;

  return Math.max(1, 4 - (fullMinutes - minMinutes));
}

function formatElapsedTime(elapsedMs) {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function renderScoreboard() {
  return `
    <div class="score-list">
      ${games
        .map((game) => {
          const score = gameState.scores[game.id] ?? 0;
          return `<div class="score-row"><span>${safeHtml(game.title)}</span><strong>${score}/${game.maxScore}</strong></div>`;
        })
        .join('')}
    </div>
  `;
}

function playRandomMission() {
  const openGames = games.filter((game) => !gameState.completed[game.id]);
  const pool = openGames.length > 0 ? openGames : games;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  renderGame(pick.id);
}

function renderMenu() {
  const items = games
    .map((game) => {
      const done = gameState.completed[game.id];
      const score = gameState.scores[game.id] ?? 0;
      const detail = gameState.lastResult[game.id];
      return `
      <button class="menu-btn" data-game="${game.id}">
        <div>${safeHtml(game.title)}</div>
        <div class="small">${safeHtml(game.short)}</div>
        <div class="small">${done ? `✅ Erledigt • ${score}/${game.maxScore} Punkte` : `5 Level • ca. ${game.minMinutes}-${game.maxMinutes} Min.`}</div>
        ${detail ? `<div class="tiny-result">${safeHtml(detail)}</div>` : ''}
        ${done ? `<div class="discussion-note">Frage für die Runde: ${safeHtml(game.discussion)}</div>` : ''}
      </button>`;
    })
    .join('');

  const total = getTotalScore();
  app.innerHTML = `
    <main class="screen">
      <div class="tag">Mobile Mini-Game für 12–15 Jahre • ca. ${totalMinMinutes}-${totalMaxMinutes} Minuten</div>
      <h1 class="title">DevQuest: Software-Team-Game</h1>
      <p class="subtitle">Jede Mission hat 5 kurze Levels. Keine Vorkenntnisse nötig, nur Neugier, Beobachtung und clevere Entscheidungen.</p>
      <p class="small"><strong>Fortschritt:</strong> ${completionText()} • Gesamt: <span class="score">${total}/${totalMax}</span></p>
      <div class="menu-actions">
        <button id="randomMissionBtn">Zufalls-Mission starten</button>
      </div>
      <div class="menu-grid">${items}</div>
      ${
        allFinished()
          ? `<div class="result team-board"><strong>Finale Team-Auswertung:</strong> ${total}/${totalMax} Punkte.<br/>${scoreMessage(total)}${renderScoreboard()}</div>`
          : ''
      }

      <div class="hint" style="margin-top:20px;">
            <div class="QR-section" >
        <button class="secondary" id="loadQrBtn">QR-Code laden</button>
      </div>
        <img id="qrImage" alt="QR Code zur aktuellen Seite" width="110" height="110" style="border-radius:8px;display:none;margin-top:8px;" />
      </div>
    </main>
    <footer>Alle Missionen sind unabhängig voneinander spielbar.</footer>
  `;

  app.querySelectorAll('[data-game]').forEach((button) => {
    button.addEventListener('click', () => renderGame(button.getAttribute('data-game')));
  });

  app.querySelector('#randomMissionBtn')?.addEventListener('click', playRandomMission);

  app.querySelector('#loadQrBtn')?.addEventListener('click', () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(window.location.href)}`;
    const qrImage = app.querySelector('#qrImage');
    const qrNote = app.querySelector('#qrNote');
    qrImage.src = qrUrl;
    qrImage.style.display = 'block';
    qrImage.onerror = () => {
      qrImage.style.display = 'none';
      qrNote.textContent = 'QR konnte nicht geladen werden. Teile die URL alternativ direkt.';
    };
  });
}

function renderGame(gameId) {
  const game = gameMap[gameId];
  const startedAt = Date.now();

  // Games only report their base points. The shell applies the shared time bonus here.
  const api = {
    app,
    finish: (score, detail) => {
      const elapsedMs = Date.now() - startedAt;
      const timeBonus = getTimeBonus(elapsedMs, game.minMinutes, game.maxMinutes);
      const totalScore = score + timeBonus;
      const bonusDetail = `${detail} • Zeit ${formatElapsedTime(elapsedMs)} • Zeitbonus +${timeBonus}/5`;
      saveResult(gameId, totalScore, bonusDetail);
      goMenu();
    },
    menu: goMenu,
    mount: (html) => {
      app.innerHTML = `<main class="screen">${html}</main>`;
    },
  };

  try {
    game.render(api);
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <main class="screen">
        <h2>Ups! Dieses Minigame hat gerade ein Problem.</h2>
        <div class="error-box">Fehler: ${safeHtml(error?.message || 'Unbekannt')}</div>
        <p class="small">Die anderen Spiele bleiben spielbar.</p>
        <button id="backMenu">Zurück zum Startmenü</button>
      </main>
    `;
    app.querySelector('#backMenu')?.addEventListener('click', goMenu);
  }
}

renderMenu();
