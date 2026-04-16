const app = document.querySelector('#app');

const gameState = {
  completed: {},
  scores: {},
  lastResult: {},
};

const games = [
  {
    id: 'bug-hunt',
    title: '🐞 Bug Hunt',
    short: 'Befehle reparieren, damit der Roboter das Ziel erreicht.',
    maxScore: 20,
    render: renderBugHunt,
  },
  {
    id: 'passwort-raetsel',
    title: '🔐 Passwort-Rätsel',
    short: 'Finde mit Hinweisen heraus, wer das richtige Passwort hat.',
    maxScore: 20,
    render: renderPasswordRiddle,
  },
  {
    id: 'design-duell',
    title: '🎨 Design-Duell',
    short: 'Wähle die benutzerfreundlichere Design-Option.',
    maxScore: 20,
    render: renderDesignQuiz,
  },
  {
    id: 'test-labor',
    title: '🧪 Test-Labor',
    short: 'Finde 5 Fehler in einer Mock-Webseite.',
    maxScore: 20,
    render: renderTestLab,
  },
  {
    id: 'datenpfad',
    title: '🕵️ Datenpfad-Detektiv',
    short: 'Verfolge Datenflüsse bis zur richtigen Stelle.',
    maxScore: 20,
    render: renderDataPath,
  },
];

const gameMap = Object.fromEntries(games.map((game) => [game.id, game]));
const totalMax = games.reduce((sum, game) => sum + game.maxScore, 0);

function safeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getTotalScore() {
  return Object.values(gameState.scores).reduce((sum, value) => sum + value, 0);
}

function allFinished() {
  return games.every((game) => gameState.completed[game.id]);
}

function completionText() {
  const done = games.filter((game) => gameState.completed[game.id]).length;
  return `${done}/${games.length} Minigames abgeschlossen`;
}

function scoreMessage(score) {
  if (score >= 85) return 'Mega! Du hast viele Skills wie in einem echten Dev-Team gezeigt.';
  if (score >= 65) return 'Stark! Du hast ein gutes Gefühl für Software-Engineering-Aufgaben.';
  if (score >= 45) return 'Gut gemacht! Mit etwas Übung wirst du schnell noch besser.';
  return 'Super Einstieg! Genau so startet man in die IT-Welt.';
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

function renderMenu() {
  const items = games
    .map((game) => {
      const done = gameState.completed[game.id];
      const score = gameState.scores[game.id] ?? 0;
      return `
      <button class="menu-btn" data-game="${game.id}">
        <div>${safeHtml(game.title)}</div>
        <div class="small">${safeHtml(game.short)}</div>
        <div class="small">${done ? `✅ Erledigt • ${score}/${game.maxScore} Punkte` : 'Noch offen'}</div>
      </button>`;
    })
    .join('');

  const total = getTotalScore();
  app.innerHTML = `
    <main class="screen">
      <div class="tag">Mobile Mini-Game für 12–15 Jahre • ca. 20 Minuten</div>
      <h1 class="title">DevQuest: Software-Team-Game</h1>
      <p class="subtitle">Keine Vorkenntnisse nötig. Spiele kurze Missionen und sammle Punkte wie im echten Entwicklerteam.</p>
      <p class="small"><strong>Fortschritt:</strong> ${completionText()} • Gesamt: <span class="score">${total}/${totalMax}</span></p>
      <div class="menu-grid">${items}</div>
      ${
        allFinished()
          ? `<div class="result"><strong>Finale Auswertung:</strong> ${total}/${totalMax} Punkte.<br/>${scoreMessage(total)}</div>`
          : ''
      }
      <div class="hint">
        <strong>QR-Code:</strong> Für GitHub Pages veröffentlichen und dann diesen Link als QR-Code teilen.<br/>
        <div class="row" style="margin-top:8px;">
          <button class="secondary" id="loadQrBtn">QR-Code laden</button>
          <span class="small" id="qrNote">Scannen = direkt im Browser starten, ohne Installation.</span>
        </div>
        <img id="qrImage" alt="QR Code zur aktuellen Seite" width="110" height="110" style="border-radius:8px;display:none;margin-top:8px;" />
      </div>
    </main>
    <footer>Jedes Spiel ist unabhängig. Falls eins ausfällt, kannst du die anderen trotzdem spielen.</footer>
  `;

  app.querySelectorAll('[data-game]').forEach((button) => {
    button.addEventListener('click', () => renderGame(button.getAttribute('data-game')));
  });
  app.querySelector('#loadQrBtn')?.addEventListener('click', () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(window.location.href)}`;
    const qrImage = app.querySelector('#qrImage');
    const qrNote = app.querySelector('#qrNote');
    qrImage.src = qrUrl;
    qrImage.style.display = 'block';
    qrImage.onerror = () => {
      qrImage.style.display = 'none';
      qrNote.textContent = 'QR konnte nicht geladen werden. Bitte URL kopieren und mit einem QR-Generator teilen.';
    };
  });
}

function renderGame(gameId) {
  const game = gameMap[gameId];
  const api = {
    finish: (score, detail) => {
      saveResult(gameId, score, detail);
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
        <p class="small">Die anderen Spiele funktionieren trotzdem.</p>
        <button id="backMenu">Zurück zum Startmenü</button>
      </main>
    `;
    app.querySelector('#backMenu')?.addEventListener('click', goMenu);
  }
}

function renderBugHunt(api) {
  const map = [
    ['R', '.', '#', '.', '.'],
    ['.', '.', '#', '.', '#'],
    ['#', '.', '.', '.', '.'],
    ['.', '#', '#', '.', '.'],
    ['.', '.', '.', '.', 'G'],
  ];
  const commands = ['vor', 'rechts', 'vor', 'vor', 'vor', 'links', 'vor', 'rechts', 'vor', 'vor', 'links', 'vor'];
  let selected = [];
  let tries = 0;

  api.mount(`
    <h2>🐞 Bug Hunt</h2>
    <p class="small">Zwei Befehle sind vertauscht. Tausche sie zurück, damit der Roboter das Ziel (G) erreicht.</p>
    <div class="grid" id="bugGrid"></div>
    <div class="small">Befehle (antippen zum Tauschen):</div>
    <div class="chips" id="cmds"></div>
    <div class="row">
      <button id="runBtn">Programm testen</button>
      <button class="secondary" id="resetBtn">Auswahl löschen</button>
      <button class="secondary" id="menuBtn">Menü</button>
    </div>
    <div id="bugOut" class="hint">Tipp: Der Roboter startet nach rechts schauend.</div>
  `);

  const grid = app.querySelector('#bugGrid');
  const cmdsWrap = app.querySelector('#cmds');
  const out = app.querySelector('#bugOut');

  function renderGrid(path = []) {
    grid.innerHTML = '';
    const pathSet = new Set(path.map(([r, c]) => `${r}-${c}`));
    map.forEach((row, r) => {
      row.forEach((cell, c) => {
        const div = document.createElement('div');
        div.className = 'cell';
        if (cell === '#') div.classList.add('wall');
        if (cell === 'G') div.classList.add('goal');
        if (pathSet.has(`${r}-${c}`)) div.classList.add('robot');
        div.textContent = cell === '#' ? '🧱' : cell === 'G' ? '🏁' : pathSet.has(`${r}-${c}`) ? '🤖' : '';
        grid.appendChild(div);
      });
    });
  }

  function renderCmds() {
    cmdsWrap.innerHTML = '';
    commands.forEach((cmd, idx) => {
      const b = document.createElement('button');
      b.className = `chip ${selected.includes(idx) ? 'active' : ''}`;
      b.textContent = `${idx + 1}. ${cmd}`;
      b.addEventListener('click', () => {
        if (selected.includes(idx)) {
          selected = selected.filter((i) => i !== idx);
        } else if (selected.length < 2) {
          selected.push(idx);
          if (selected.length === 2) {
            const [a, bIdx] = selected;
            [commands[a], commands[bIdx]] = [commands[bIdx], commands[a]];
            selected = [];
            out.textContent = 'Befehle getauscht. Jetzt testen!';
          }
        }
        renderCmds();
      });
      cmdsWrap.appendChild(b);
    });
  }

  function runProgram() {
    tries += 1;
    const dirList = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    let dir = 0;
    let r = 0;
    let c = 0;
    const path = [[r, c]];

    for (const cmd of commands) {
      if (cmd === 'rechts') dir = (dir + 1) % 4;
      if (cmd === 'links') dir = (dir + 3) % 4;
      if (cmd === 'vor') {
        const nr = r + dirList[dir][0];
        const nc = c + dirList[dir][1];
        if (nr < 0 || nr >= 5 || nc < 0 || nc >= 5 || map[nr][nc] === '#') {
          out.textContent = `🤖 Crash gegen Wand nach Schritt ${path.length}. Versuche es nochmal.`;
          renderGrid(path);
          return;
        }
        r = nr;
        c = nc;
        path.push([r, c]);
      }
    }

    renderGrid(path);
    if (map[r][c] === 'G') {
      const score = Math.max(8, 20 - (tries - 1) * 4);
      out.innerHTML = `✅ Ziel erreicht in ${tries} Versuch(en)! Punkte: <strong>${score}/20</strong>`;
      app.querySelector('#runBtn').disabled = true;
      const finishBtn = document.createElement('button');
      finishBtn.textContent = 'Mission abschließen';
      finishBtn.addEventListener('click', () => api.finish(score, `Bug Hunt in ${tries} Versuch(en)`));
      out.appendChild(document.createElement('br'));
      out.appendChild(finishBtn);
    } else {
      out.textContent = 'Noch nicht am Ziel. Tausche andere Befehle und teste erneut.';
    }
  }

  renderGrid([[0, 0]]);
  renderCmds();
  app.querySelector('#runBtn').addEventListener('click', runProgram);
  app.querySelector('#resetBtn').addEventListener('click', () => {
    selected = [];
    renderCmds();
    out.textContent = 'Auswahl zurückgesetzt.';
  });
  app.querySelector('#menuBtn').addEventListener('click', api.menu);
}

function renderPasswordRiddle(api) {
  const answer = 'Mila';
  let attempts = 0;
  const people = ['Tim', 'John', 'Mila', 'Sara', 'Noah'];

  api.mount(`
    <h2>🔐 Passwort-Rätsel</h2>
    <p class="small">Wer hat das richtige Passwort <strong>Kernel42</strong>? Nutze die Hinweise und die Tabelle.</p>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Haus</th><th>Farbe</th><th>Person</th><th>Haustier</th><th>Sprache</th><th>Passwort</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Rot</td><td>Tim</td><td>Hund</td><td>C#</td><td>Booting</td></tr>
          <tr><td>2</td><td>Blau</td><td>?</td><td>Katze</td><td>Python</td><td>?</td></tr>
          <tr><td>3</td><td>Grün</td><td>Mila</td><td>?</td><td>JavaScript</td><td>Kernel42</td></tr>
          <tr><td>4</td><td>Gelb</td><td>Sara</td><td>Hase</td><td>Java</td><td>Sunset7</td></tr>
          <tr><td>5</td><td>Lila</td><td>Noah</td><td>Fisch</td><td>Go</td><td>Rocket</td></tr>
        </tbody>
      </table>
    </div>
    <div class="hint">Hinweis 1: John wohnt direkt neben Tim.</div>
    <div class="hint">Hinweis 2: Das Passwort <strong>Kernel42</strong> gehört zur Person im grünen Haus.</div>
    <div class="hint">Hinweis 3: Mila liebt JavaScript.</div>
    <div class="button-grid" id="riddleOptions"></div>
    <div id="riddleOut" class="hint">Tipp: Kombiniere Farbe + Haus + Person.</div>
    <div class="row"><button class="secondary" id="menuBtn">Menü</button></div>
  `);

  const wrap = app.querySelector('#riddleOptions');
  const out = app.querySelector('#riddleOut');
  people.forEach((name) => {
    const btn = document.createElement('button');
    btn.className = 'secondary';
    btn.textContent = `${name} hat Kernel42`;
    btn.addEventListener('click', () => {
      attempts += 1;
      if (name === answer) {
        const score = Math.max(10, 20 - (attempts - 1) * 5);
        out.innerHTML = `✅ Richtig: ${name}! Punkte: <strong>${score}/20</strong><br/><button id="finishRiddle">Rätsel abschließen</button>`;
        app.querySelector('#finishRiddle')?.addEventListener('click', () => api.finish(score, `Rätsel in ${attempts} Versuch(en)`));
      } else {
        out.textContent = `❌ ${name} ist falsch. Denk an das grüne Haus.`;
      }
    });
    wrap.appendChild(btn);
  });

  app.querySelector('#menuBtn').addEventListener('click', api.menu);
}

function renderDesignQuiz(api) {
  const questions = [
    {
      question: 'Welche Schaltfläche ist lesbarer?',
      options: [
        { label: 'Roter Button + blaue Schrift', good: false, className: 'bad' },
        { label: 'Roter Button + weiße Schrift', good: true, className: 'good' },
      ],
      explain: 'Hoher Kontrast macht Bedienung leichter.',
    },
    {
      question: 'Was hilft neuen Nutzer:innen mehr?',
      options: [
        { label: 'Nur Symbole ohne Text', good: false, className: 'bad' },
        { label: 'Symbol + kurzer erklärender Text', good: true, className: 'good' },
      ],
      explain: 'Klare Labels vermeiden Verwirrung.',
    },
    {
      question: 'Welche Variante ist auf Smartphones besser?',
      options: [
        { label: 'Mini-Klickflächen', good: false, className: 'bad' },
        { label: 'Große Touch-Flächen', good: true, className: 'good' },
      ],
      explain: 'Größere Flächen sind leichter zu treffen.',
    },
    {
      question: 'Was ist besser bei Fehlern?',
      options: [
        { label: 'Nur rote Markierung ohne Text', good: false, className: 'bad' },
        { label: 'Markierung + verständlicher Hinweis', good: true, className: 'good' },
      ],
      explain: 'Fehlermeldungen sollen helfen, nicht nur warnen.',
    },
  ];

  let idx = 0;
  let points = 0;

  function drawQuestion() {
    const q = questions[idx];
    api.mount(`
      <h2>🎨 Design-Duell</h2>
      <p class="small">Frage ${idx + 1}/${questions.length}</p>
      <h3>${q.question}</h3>
      <div id="options"></div>
      <div id="designOut" class="hint">Wähle die bessere UX-Option.</div>
      <div class="row"><button class="secondary" id="menuBtn">Menü</button></div>
    `);

    const options = app.querySelector('#options');
    const out = app.querySelector('#designOut');

    q.options.forEach((option) => {
      const button = document.createElement('button');
      button.className = 'secondary';
      button.innerHTML = `<div class="option ${option.className}">${safeHtml(option.label)}</div>`;
      button.addEventListener('click', () => {
        if (option.good) points += 5;
        out.textContent = `${option.good ? '✅ Gute Wahl!' : '🤔 Nicht optimal.'} ${q.explain}`;
        const next = document.createElement('button');
        next.textContent = idx + 1 === questions.length ? 'Quiz abschließen' : 'Nächste Frage';
        next.addEventListener('click', () => {
          idx += 1;
          if (idx >= questions.length) {
            api.finish(points, `Design-Quiz: ${points}/20`);
          } else {
            drawQuestion();
          }
        });
        out.appendChild(document.createElement('br'));
        out.appendChild(next);
        options.querySelectorAll('button').forEach((b) => (b.disabled = true));
      });
      options.appendChild(button);
    });

    app.querySelector('#menuBtn').addEventListener('click', api.menu);
  }

  drawQuestion();
}

function renderTestLab(api) {
  const issues = [
    { id: 'a', label: 'Login-Button reagiert nicht', bug: true },
    { id: 'b', label: 'Text auf Button kaum lesbar', bug: true },
    { id: 'c', label: 'Suche braucht 8 Sekunden', bug: true },
    { id: 'd', label: 'Navigation springt zurück', bug: true },
    { id: 'e', label: 'Bild überdeckt den Text', bug: true },
    { id: 'f', label: 'Avatar ist rund', bug: false },
    { id: 'g', label: 'Footer hat Schatten', bug: false },
    { id: 'h', label: 'Button hat Icon', bug: false },
  ];

  const marked = new Set();

  api.mount(`
    <h2>🧪 Test-Labor</h2>
    <p class="small">In diesem Mock sind <strong>5 Fehler</strong> versteckt. Markiere alle und drücke dann „Testbericht senden“.</p>
    <div class="mock">
      <div class="mock-grid" id="bugList"></div>
    </div>
    <div class="row">
      <button id="submitLab">Testbericht senden</button>
      <button class="secondary" id="menuBtn">Menü</button>
    </div>
    <div id="labOut" class="hint">Tippe auf auffällige Punkte, um sie zu markieren.</div>
  `);

  const list = app.querySelector('#bugList');
  const out = app.querySelector('#labOut');

  issues.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'bug-item';
    div.textContent = item.label;
    div.addEventListener('click', () => {
      if (marked.has(item.id)) {
        marked.delete(item.id);
      } else {
        marked.add(item.id);
      }
      div.classList.toggle('marked');
      out.textContent = `${marked.size} Stelle(n) markiert.`;
    });
    list.appendChild(div);
  });

  app.querySelector('#submitLab').addEventListener('click', () => {
    const truePos = issues.filter((i) => i.bug && marked.has(i.id)).length;
    const falsePos = issues.filter((i) => !i.bug && marked.has(i.id)).length;
    const missed = 5 - truePos;
    const score = Math.max(0, Math.min(20, truePos * 4 - falsePos * 2));
    out.innerHTML = `Ergebnis: ${truePos}/5 echte Fehler, ${falsePos} Fehlalarme, ${missed} übersehen.<br/>Punkte: <strong>${score}/20</strong><br/><button id="finishLab">Labor abschließen</button>`;
    app.querySelector('#finishLab')?.addEventListener('click', () => api.finish(score, `Test-Labor: ${truePos}/5 Fehler`));
  });

  app.querySelector('#menuBtn').addEventListener('click', api.menu);
}

function renderDataPath(api) {
  const graph = {
    Start: ['Profil', 'Shop'],
    Profil: ['Einstellungen', 'Freundesliste'],
    Shop: ['Warenkorb', 'Rabattcode'],
    Einstellungen: ['Login-Check'],
    Freundesliste: ['Chat'],
    Warenkorb: ['Bestellung'],
    Rabattcode: ['Werbung'],
    Chat: ['Fehlerseite'],
    Bestellung: ['Fehlerseite'],
    Werbung: ['Fehlerseite'],
    'Login-Check': ['Passworttresor'],
    Passworttresor: [],
    Fehlerseite: [],
  };

  let node = 'Start';
  const visited = [node];

  function draw() {
    const isEnd = node === 'Passworttresor' || node === 'Fehlerseite';
    const next = graph[node] || [];
    const steps = visited.length - 1;

    api.mount(`
      <h2>🕵️ Datenpfad-Detektiv</h2>
      <p class="small">Du verfolgst Daten in einer App. Ziel: Finde den sicheren Pfad zum <strong>Passworttresor</strong>.</p>
      <div class="hint"><strong>Aktuell:</strong> ${node}<br/><strong>Pfad:</strong> ${visited.join(' → ')}</div>
      <div class="button-grid" id="nextNodes"></div>
      <div id="pathOut" class="hint">${isEnd ? 'Pfad beendet.' : 'Wähle den nächsten Daten-Schritt.'}</div>
      <div class="row">
        <button class="secondary" id="restartBtn">Neu starten</button>
        <button class="secondary" id="menuBtn">Menü</button>
      </div>
    `);

    const wrap = app.querySelector('#nextNodes');
    const out = app.querySelector('#pathOut');

    if (!isEnd) {
      next.forEach((target) => {
        const b = document.createElement('button');
        b.textContent = `Weiter zu ${target}`;
        b.addEventListener('click', () => {
          node = target;
          visited.push(target);
          draw();
        });
        wrap.appendChild(b);
      });
    } else if (node === 'Passworttresor') {
      const score = steps <= 4 ? 20 : steps <= 6 ? 14 : 10;
      out.innerHTML = `✅ Ziel erreicht in ${steps} Schritten. Punkte: <strong>${score}/20</strong><br/><button id="finishPath">Mission abschließen</button>`;
      app.querySelector('#finishPath')?.addEventListener('click', () => api.finish(score, `Datenpfad in ${steps} Schritten`));
    } else {
      out.innerHTML = `🚫 Sackgasse erreicht. Denke wie beim Debuggen: Schritt zurück und neuen Pfad probieren.<br/><button id="retryPath">Nochmal</button>`;
      app.querySelector('#retryPath')?.addEventListener('click', () => {
        node = 'Start';
        visited.splice(0, visited.length, 'Start');
        draw();
      });
    }

    app.querySelector('#restartBtn').addEventListener('click', () => {
      node = 'Start';
      visited.splice(0, visited.length, 'Start');
      draw();
    });
    app.querySelector('#menuBtn').addEventListener('click', api.menu);
  }

  draw();
}

renderMenu();
