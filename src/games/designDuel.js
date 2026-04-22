/*
 * Design-Duell teaches UX judgment through visual mockups.
 * Each level stays intentionally short: read the situation, compare previews, then choose the stronger design.
 */

import { playSuccessTone } from '../utils.js';

export function renderDesignQuiz(api) {
  const levels = [
    {
      title: 'Level 1: Start-Aktion',
      points: 2,
      scenario: 'Eine Person öffnet eine Lern-App zum ersten Mal. Sie soll sofort erkennen, wo sie starten muss.',
      question: 'Welche Startansicht macht den ersten Klick am wahrscheinlichsten?',
      explain: 'Eine gute Startaktion wirkt wichtig, klar und direkt anklickbar. Nutzer:innen sollten nicht raten müssen, wie es weitergeht.',
      options: [
        {
          good: false,
          html: `
            <div class="duel-preview">
              <div class="preview-top">Lern-App</div>
              <div class="demo-btn low-contrast">GO</div>
              <p class="tiny-note">Kurz, aber unklar.</p>
            </div>
          `,
        },
        {
          good: true,
          html: `
            <div class="duel-preview">
              <div class="preview-top">Lern-App</div>
              <div class="demo-btn high-contrast">Spiel starten</div>
              <p class="tiny-note">Klare Handlung und guter Kontrast.</p>
            </div>
          `,
        },
        {
          good: false,
          html: `
            <div class="duel-preview">
              <div class="preview-top">Lern-App</div>
              <div class="soft-card">
                <div class="soft-link">Los geht's</div>
              </div>
              <p class="tiny-note">Sieht nett aus, wirkt aber nicht wichtig.</p>
            </div>
          `,
        },
      ],
    },
    {
      title: 'Level 2: Menü finden',
      points: 3,
      scenario: 'In einer Schul-App suchen viele Nutzer:innen Hilfe, Einstellungen und ihren Fortschritt. Die Navigation soll ohne Erklärung verständlich sein.',
      question: 'Welches Menü würden die meisten Menschen am schnellsten verstehen?',
      explain: 'Vertraute Muster helfen. Ein gutes Menü sieht nicht nur gut aus, sondern fühlt sich sofort bekannt an.',
      options: [
        {
          good: false,
          html: `
            <div class="duel-preview">
              <div class="menu-strip menu-dark">
                <span>◀</span><span>●</span><span>→</span><span>Campus-App</span>
              </div>
            </div>
          `,
        },
        {
          good: true,
          html: `
            <div class="duel-preview">
              <div class="app-bar">
                <span class="burger">☰</span>
                <span class="bar-title">Campus-App</span>
                <span class="bar-dot">●</span>
              </div>

            </div>
          `,
        },
        {
          good: false,
          html: `
            <div class="duel-preview">
              <div class="round-launcher">↗</div>
            </div>
          `,
        },
      ],
    },
    {
      title: 'Level 3: Farbenblindheit',
      points: 4,
      scenario: 'In einer Aufgaben-App soll man sofort erkennen, welche Aufgaben offen, erledigt oder kritisch sind. Auch Menschen mit Farbsehschwäche müssen das sicher unterscheiden können.',
      question: 'Welche Darstellung ist dafür am besten geeignet?',
      explain: 'Nur Farbe zu ändern reicht oft nicht. Gute Interfaces kombinieren Farbe mit Symbolen oder Text.',
      options: [
        {
          good: false,
          html: `
            <div class="duel-preview">
              <div class="status-list">
                <div class="status-row red-only">Status</div>
                <div class="status-row green-only">Status</div>
                <div class="status-row yellow-only">Status</div>
              </div>
            </div>
          `,
        },
        {
          good: true,
          html: `
            <div class="duel-preview">
              <div class="status-list">
                <div class="status-pill pill-danger">⚠ Kritisch</div>
                <div class="status-pill pill-ok">✓ Erledigt</div>
                <div class="status-pill pill-open">● Offen</div>
              </div>
            </div>
          `,
        },
        {
          good: false,
          html: `
            <div class="duel-preview">
              <div class="status-grid-grid">
                <div class="dot-chip dot-red"></div>
                <div class="dot-chip dot-green"></div>
                <div class="dot-chip dot-yellow"></div>
              </div>
            </div>
          `,
        },
      ],
    },
    {
      title: 'Level 4: Falscher Chat',
      points: 5,
      scenario: 'Jemand verschickt in einer Messenger-App oft schnell Fotos und Sprachnachrichten. Wenn der falsche Chat ausgewählt ist, merken viele das zu spät, weil sie sich nur auf Senden konzentrieren.',
      question: 'Welche Chat-Ansicht schützt am besten davor, an die falsche Gruppe zu senden?',
      explain: 'Wenn Menschen eine Aufgabe oft machen, schauen sie vor allem auf die Hauptaktion. Gute UX hält deshalb den wichtigen Kontext direkt neben dieser Aktion sichtbar.',
      options: [
        {
          good: false,
          html: `
            <div class="duel-preview">
              <div class="chat-shell">
                <div class="chat-header compact-chat-header">
                  <div class="chat-avatar">K</div>
                  <div class="chat-meta">
                    <strong>Klassenchat</strong>
                    <span>42 neue Nachrichten</span>
                  </div>
                </div>
                <div class="chat-thread">
                  <div class="chat-bubble bubble-photo">Foto.jpg</div>
                </div>
                <div class="chat-compose-row">
                  <div class="compose-box">Nachricht...</div>
                  <div class="send-fab">➤</div>
                </div>
              </div>
            </div>
          `,
        },
        {
          good: true,
          html: `
            <div class="duel-preview">
              <div class="chat-shell">
                <div class="chat-header focus-chat-header">
                  <div class="chat-avatar warning-avatar">!</div>
                  <div class="chat-meta strong-chat-meta">
                    <strong>Projektgruppe 9b</strong>
                    <span>Du sendest an 28 Personen</span>
                  </div>
                </div>
                <div class="recipient-banner">An: Projektgruppe 9b</div>
                <div class="chat-thread">
                  <div class="chat-bubble bubble-photo">Foto.jpg</div>
                </div>
                <div class="chat-compose-row">
                  <div class="compose-box compose-focus">Nachricht an Projektgruppe 9b</div>
                  <div class="send-fab">➤</div>
                </div>
              </div>
            </div>
          `,
        },
        {
          good: false,
          html: `
            <div class="duel-preview">
              <div class="chat-shell">
                <div class="audience-row">
                  <div class="mini-avatar">A</div>
                  <div class="mini-avatar">B</div>
                  <div class="mini-avatar">C</div>
                  <div class="mini-avatar">...</div>
                </div>
                <div class="chat-thread">
                  <div class="chat-bubble bubble-photo">Foto.jpg</div>
                </div>
                <div class="chat-compose-row">
                  <div class="compose-box">An wen senden?</div>
                  <div class="send-fab">➤</div>
                </div>
              </div>
            </div>
          `,
        },
      ],
    },
    {
      title: 'Level 5: Kritische Aktion',
      points: 6,
      scenario: 'In einer Foto-App soll ein Album gelöscht werden. Die Oberfläche muss verhindern, dass Menschen aus Versehen die falsche Aktion drücken.',
      question: 'Welche Bestätigung schützt am besten vor einem Fehlklick?',
      explain: 'Je gefährlicher eine Aktion ist, desto klarer muss die sichere Option getrennt und die riskante Aktion bewusst gemacht werden. Buttons müssen klar getrennt sein um versehentliches klicken zu vermeiden und da viele Rechtshänder sind, sind klicks mit dem rechten daumen am wahrscheinlichsten.',
      options: [
        {
          good: false,
          html: `
            <div class="duel-preview">
              <div class="confirm-card">
                <div class="confirm-title">Album löschen?</div>
                <div class="confirm-actions inline-danger">
                  <span class="ghost-action">Abbrechen</span>
                  <span class="danger-action">Löschen</span>
                </div>
              </div>
            </div>
          `,
        },
        {
          good: true,
          html: `
            <div class="duel-preview">
              <div class="confirm-card">
                <div class="confirm-title">Album löschen?</div>
                <div class="tiny-note">Diese Aktion kann nicht rückgängig gemacht werden.</div>
                <div class="confirm-actions stacked-safe">
                  <span class="ghost-action primary-safe">Abbrechen</span>
                  <span class="danger-action muted-danger" style="margin-top: 20px">Album löschen</span>
                </div>
              </div>
            </div>
          `,
        },
        {
          good: false,
          html: `
            <div class="duel-preview">
              <div class="confirm-card hero-focus">
                <div class="danger-action huge-danger">Jetzt löschen</div>
                <div class="micro-copy">Abbrechen</div>
              </div>
            </div>
          `,
        },
      ],
    },
  ];

  let levelIndex = 0;
  let totalPoints = 0;

  function drawLevel() {
    const level = levels[levelIndex];

    api.mount(`
      <h2>🎨 Design-Duell</h2>
      <p class="small">Du bist UX-Scout. In jedem Level gibt es eine kurze Nutzer-Situation. Wähle das Layout, das in diesem echten Moment am besten funktioniert.</p>
      <div class="level-bar">
        <span class="tag">Level ${levelIndex + 1}/5</span>
        <span class="small">Keine echten UI-Elemente: alles sind sichere Mockups nur zum Vergleichen.</span>
      </div>
      <div class="scenario-box">
        <div class="scenario-label">Nutzer-Situation</div>
        <p>${level.scenario}</p>
      </div>
      <h3>${level.question}</h3>
      <div id="options" class="duel-grid"></div>
      <div id="designOut" class="hint">Tippe auf die Version, die für diese Situation am besten funktioniert.</div>
      <div class="row"><button class="secondary" id="menuBtn">Menü</button></div>
    `);

    const options = api.app.querySelector('#options');
    const out = api.app.querySelector('#designOut');

    level.options.forEach((option) => {
      const button = document.createElement('button');
      button.className = 'secondary preview-choice';
      button.type = 'button';
      button.innerHTML = option.html;
      button.addEventListener('click', () => {
        const gained = option.good ? level.points : Math.max(1, Math.floor(level.points / 3));
        totalPoints += gained;
        if (option.good) playSuccessTone();
        options.querySelectorAll('button').forEach((b, index) => {
          b.disabled = true;
          b.classList.add(level.options[index].good ? 'choice-correct' : 'choice-wrong');
        });
        out.innerHTML = `${option.good ? '✅ Gute UX-Wahl!' : '🙂 Lernmoment!'} ${level.explain}<br/>+${gained} Punkte.`;
        const next = document.createElement('button');
        next.textContent = levelIndex === levels.length - 1 ? 'Quiz abschließen' : 'Nächstes Level';
        next.addEventListener('click', () => {
          levelIndex += 1;
          if (levelIndex >= levels.length) {
            api.finish(totalPoints, `Design-Duell: ${totalPoints}/20 Basispunkte in 5 Duellen`);
          } else {
            drawLevel();
          }
        });
        out.appendChild(document.createElement('br'));
        out.appendChild(next);
      });
      options.appendChild(button);
    });

    api.app.querySelector('#menuBtn').addEventListener('click', api.menu);
  }

  drawLevel();
}
