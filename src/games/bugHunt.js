/*
 * Bug Hunt turns route fixing into a lightweight debug session.
 * The player swaps two misplaced commands, runs the program, and learns from the live log.
 */

import { playSuccessTone, safeHtml, sleep } from '../utils.js';

export function renderBugHunt(api) {
  const levels = [
    {
      title: 'Level 1: Teststrecke',
      points: 2,
      scene: 'Der Service-Roboter soll drei Pakete zum Ausgang bringen.',
      expected: 'Der Bot soll erst geradeaus in den freien Gang fahren und dann sauber zum Ziel abbiegen.',
      bugHint: 'Im Mini-Programm wurden zwei Codezeilen vertauscht.',
      explain: 'Beim Debuggen zählt oft nicht neuer Code, sondern die richtige Reihenfolge.',
      map: [
        ['S', '.', '.', '#'],
        ['#', '#', '.', '#'],
        ['.', '.', '.', '.'],
        ['.', '#', '#', 'G'],
      ],
      commands: ['vor', 'vor', 'rechts', 'vor', 'vor', 'rechts', 'vor', 'links', 'vor'],
    },
    {
      title: 'Level 2: Lagerhalle',
      points: 3,
      scene: 'Ein Fahrroboter soll durch Regale bis zur Versandzone kommen.',
      expected: 'Die Route klappt nur, wenn die Drehung genau vor dem schmalen Gang passiert.',
      bugHint: 'Die falsche Reihenfolge schickt den Bot in eine Sackgasse.',
      explain: 'Ein kleiner Fehler im Ablauf kann ein ganzes System aus der Bahn werfen.',
      map: [
        ['S', '.', '#', '.', '.'],
        ['#', '.', '#', '.', '#'],
        ['#', '.', '.', '.', '#'],
        ['#', '#', '#', '.', '.'],
        ['.', '.', '.', '.', 'G'],
      ],
      commands: ['vor', 'rechts', 'vor', 'vor', 'rechts', 'vor', 'vor', 'links', 'vor', 'links', 'vor', 'rechts', 'vor'],
    },
    {
      title: 'Level 3: Nachtmission',
      points: 4,
      scene: 'Nachts liefert der Bot Ersatzteile auf ein Dach ohne Licht.',
      expected: 'Der Bot muss mehrere Kurven in korrekter Reihenfolge ausführen.',
      bugHint: 'Wenn eine Drehung zu früh kommt, stimmt der gesamte Rest nicht mehr.',
      explain: 'Genau solche Kettenfehler suchen Entwickler:innen beim Debuggen.',
      map: [
        ['S', '.', '.', '.', '#', '.'],
        ['#', '#', '#', '.', '#', '.'],
        ['.', '.', '.', '.', '#', '.'],
        ['.', '#', '.', '.', '.', '.'],
        ['.', '#', '.', '#', '#', '.'],
        ['.', '.', '.', '.', '.', 'G'],
      ],
      commands: ['vor', 'vor', 'links', 'vor', 'vor', 'rechts', 'vor', 'vor', 'rechts', 'vor', 'vor', 'vor', 'links', 'vor'],
    },
    {
      title: 'Level 4: Wartungstunnel',
      points: 5,
      scene: 'Ein Reparatur-Bot fährt durch einen engen Wartungstunnel.',
      expected: 'Nur mit dem richtigen Timing zwischen Vorwärts, Drehen und Wiederholen kommt er durch.',
      bugHint: 'Eine Wiederholung passt noch nicht zur Route.',
      explain: 'Beim Debuggen hilft es, Soll-Ablauf und Ist-Ablauf direkt zu vergleichen.',
      map: [
        ['S', '.', '.', '.', '#', '.'],
        ['#', '#', '#', '.', '#', '.'],
        ['.', '.', '.', '.', '#', '.'],
        ['.', '#', '#', '.', '.', '.'],
        ['.', '.', '#', '#', '#', '.'],
        ['#', '.', '.', '.', '.', 'G'],
      ],
      commands: [
        'vor',
        { type: 'repeat', count: 1, editableCount: true, min: 1, max: 3 },
        'rechts',
        'vor',
        { type: 'repeat', count: 1, editableCount: true, min: 1, max: 3 },
        'links',
        'vor',
        { type: 'repeat', count: 2, editableCount: true, min: 1, max: 3 },
        'rechts',
        'vor',
        { type: 'repeat', count: 1, editableCount: true, min: 1, max: 3 },
      ],
    },
    {
      title: 'Level 5: Serverdach',
      points: 6,
      scene: 'Der Bot bringt ein Notfall-Update auf das Serverdach.',
      expected: 'Die Route ist lang, aber eindeutig, wenn Wiederholungen am richtigen Schritt hängen.',
      bugHint: 'Hier hängt eine Wiederholung noch hinter dem falschen Befehl.',
      explain: 'Je komplexer der Ablauf, desto wichtiger sind Beobachtung, Logs und systematisches Testen.',
      map: [
        ['S', '.', '.', '#', '.', '.', '.'],
        ['#', '#', '.', '#', '.', '#', '.'],
        ['.', '.', '.', '.', '.', '#', '.'],
        ['.', '#', '#', '#', '.', '.', '.'],
        ['.', '.', '.', '#', '#', '.', '#'],
        ['#', '#', '.', '.', '.', '.', '#'],
        ['.', '.', '.', '#', '#', '.', 'G'],
      ],
      commands: [
        'vor',
        { type: 'repeat', count: 1, editableCount: true, min: 1, max: 3 },
        'rechts',
        'vor',
        { type: 'repeat', count: 1, editableCount: true, min: 1, max: 3 },
        'links',
        'vor',
        { type: 'repeat', count: 1, editableCount: true, min: 1, max: 3 },
        'rechts',
        'vor',
        'links',
        'vor',
        'rechts',
        { type: 'repeat', count: 2, editableCount: true, min: 1, max: 3 },
        'vor',
        'links',
        'vor',
      ],
    },
  ];

  let levelIndex = 0;
  let totalPoints = 0;

  function startLevel() {
    const level = levels[levelIndex];
    const start = findStart(level.map);
    let commands = level.commands.map(cloneCommand);
    let selected = [];
    let tries = 0;
    let running = false;
    let activeStep = -1;
    let openRepeatEditor = null;
    let robot = { r: start.r, c: start.c, dir: 0 };
    let trail = [`${start.r}-${start.c}`];
    let logEntries = ['Debugger bereit. Warte auf den ersten Testlauf.'];
    const arrows = ['➡️', '⬇️', '⬅️', '⬆️'];

    api.mount(`
      <h2>🐞 Bug Hunt</h2>
      <p class="small">Du bist Bug-Fixer:in. In jedem Level steckt ein Fehler im Mini-Programm. Finde ihn und beobachte die Debug-Ausgabe Schritt für Schritt.</p>
      <div class="level-bar">
        <span class="tag">Level ${levelIndex + 1}/5</span>
        <span class="small">Blickrichtung: ➡️ rechts • ⬇️ runter • ⬅️ links • ⬆️ hoch</span>
      </div>
      <div class="hint"><strong>${safeHtml(level.title)}</strong><br/>${safeHtml(level.scene)}</div>
      <div class="mission-grid">
        <div class="hint compact-hint"><strong>Soll:</strong><br/>${safeHtml(level.expected)}</div>
        <div class="hint compact-hint"><strong>Bug-Hinweis:</strong><br/>${safeHtml(level.bugHint)}</div>
      </div>
      <div class="grid robot-grid" id="bugGrid"></div>
      <div class="small">Mini-Programm:</div>
      <div class="chips" id="cmds"></div>
      <div class="debug-panel">
        <div class="debug-title">Ausführungslog</div>
        <div id="bugLog" class="debug-log"></div>
      </div>
      <div class="row">
        <button id="runBtn">Simulation starten</button>
        <button class="secondary" id="resetBtn">Level zurücksetzen</button>
        <button class="secondary" id="menuBtn">Menü</button>
      </div>
      <div id="bugOut" class="hint">Beobachte zuerst den Ist-Ablauf und verbessere dann den Code.</div>
    `);

    const grid = api.app.querySelector('#bugGrid');
    const cmdsWrap = api.app.querySelector('#cmds');
    const log = api.app.querySelector('#bugLog');
    const out = api.app.querySelector('#bugOut');

    function renderLog() {
      log.innerHTML = logEntries.map((entry) => `<div class="log-entry">${safeHtml(entry)}</div>`).join('');
      log.scrollTop = log.scrollHeight;
    }

    function renderGrid() {
      grid.style.gridTemplateColumns = `repeat(${level.map[0].length}, 1fr)`;
      grid.innerHTML = '';
      level.map.forEach((row, r) => {
        row.forEach((cell, c) => {
          const div = document.createElement('div');
          div.className = 'cell';
          if (cell === '#') div.classList.add('wall');
          if (cell === 'G') div.classList.add('goal');
          if (trail.includes(`${r}-${c}`)) div.classList.add('trail');

          if (r === robot.r && c === robot.c) {
            div.classList.add('robot');
            div.textContent = arrows[robot.dir];
          } else if (cell === '#') {
            div.textContent = '🧱';
          } else if (cell === 'G') {
            div.textContent = '🏁';
          } else if (cell === 'S') {
            div.textContent = '🚦';
          } else if (trail.includes(`${r}-${c}`)) {
            div.textContent = '·';
          }

          grid.appendChild(div);
        });
      });
    }

    function renderCommands() {
      cmdsWrap.innerHTML = '';
      commands.forEach((cmd, idx) => {
        const row = document.createElement('div');
        row.className = 'bug-command-row';
        const button = document.createElement('button');
        button.className = 'chip code-chip bug-code-chip';
        if (selected.includes(idx)) button.classList.add('active');
        if (idx === activeStep) button.classList.add('running');
        button.disabled = running;
        button.addEventListener('click', (event) => {
          if (event.target.closest('.repeat-edit-pill')) {
            toggleRepeatEditor(idx);
            return;
          }

          if (selected.includes(idx)) {
            selected = selected.filter((value) => value !== idx);
          } else if (selected.length < 2) {
            selected.push(idx);
          }

          openRepeatEditor = null;

          if (selected.length === 2) {
            const [a, b] = selected;
            [commands[a], commands[b]] = [commands[b], commands[a]];
            selected = [];
            logEntries.push(`Zeile ${a + 1} wurde mit Zeile ${b + 1} getauscht.`);
            out.textContent = 'Befehle getauscht. Teste jetzt den Lauf.';
            renderLog();
          }

          renderCommands();
        });

        renderCommandContent(button, cmd, idx);

        row.appendChild(button);

        if (canEditRepeatCount(cmd) && openRepeatEditor === idx) {
          row.appendChild(createRepeatEditor(idx, cmd));
        }

        cmdsWrap.appendChild(row);
      });
    }

    function renderCommandContent(button, command, index) {
      button.innerHTML = '';

      const label = document.createElement('span');
      label.textContent = `Zeile ${index + 1}: ${formatCommand(command)}`;
      button.appendChild(label);

      if (canEditRepeatCount(command)) {
        const pill = document.createElement('span');
        pill.className = 'repeat-edit-pill';
        pill.setAttribute('role', 'button');
        pill.setAttribute('tabindex', running ? '-1' : '0');
        pill.setAttribute('aria-label', `Wiederholungen für Zeile ${index + 1} ändern`);
        pill.textContent = `${command.count}x ändern`;
        pill.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleRepeatEditor(index);
          }
        });
        button.appendChild(pill);
      }
    }

    function createRepeatEditor(index, command) {
      const editor = document.createElement('div');
      editor.className = 'repeat-editor';

      const label = document.createElement('span');
      label.className = 'repeat-editor-label';
      label.textContent = 'Wiederholen';

      const controls = document.createElement('div');
      controls.className = 'repeat-editor-controls';

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.className = 'repeat-stepper-btn';
      minusBtn.textContent = '-';
      minusBtn.disabled = running || command.count <= (command.min ?? 1);
      minusBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        adjustRepeatCount(index, -1);
      });

      const value = document.createElement('span');
      value.className = 'repeat-value';
      value.textContent = `${command.count}x`;

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.className = 'repeat-stepper-btn';
      plusBtn.textContent = '+';
      plusBtn.disabled = running || command.count >= (command.max ?? 5);
      plusBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        adjustRepeatCount(index, 1);
      });

      editor.addEventListener('click', (event) => event.stopPropagation());
      editor.appendChild(label);
      controls.appendChild(minusBtn);
      controls.appendChild(value);
      controls.appendChild(plusBtn);
      editor.appendChild(controls);
      return editor;
    }

    function toggleRepeatEditor(index) {
      if (running || !canEditRepeatCount(commands[index])) return;

      openRepeatEditor = openRepeatEditor === index ? null : index;
      selected = [];
      renderCommands();
    }

    function adjustRepeatCount(index, delta) {
      if (running) return;

      const command = commands[index];
      if (!canEditRepeatCount(command)) return;

      const min = command.min ?? 1;
      const max = command.max ?? 5;
      const nextCount = Math.max(min, Math.min(max, command.count + delta));

      if (nextCount === command.count) return;

      command.count = nextCount;
      selected = [];
      logEntries.push(`Zeile ${index + 1} wiederholt jetzt ${command.count}x.`);
      out.textContent = 'Wert angepasst. Teste jetzt den Lauf.';
      renderCommands();
      renderLog();
    }

    async function executeBaseCommand(command, lineNumber, sourceLabel) {
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      if (sourceLabel) {
        logEntries.push(`${sourceLabel}: ${formatCommand(command)}`);
        renderLog();
      }

      if (command.type === 'rechts') {
        robot.dir = (robot.dir + 1) % 4;
        logEntries.push(`Bot dreht nach rechts und schaut jetzt ${arrows[robot.dir]}.`);
        renderGrid();
        renderLog();
        await sleep(320);
        return true;
      }

      if (command.type === 'links') {
        robot.dir = (robot.dir + 3) % 4;
        logEntries.push(`Bot dreht nach links und schaut jetzt ${arrows[robot.dir]}.`);
        renderGrid();
        renderLog();
        await sleep(320);
        return true;
      }

      await sleep(240);
      const nr = robot.r + dirs[robot.dir][0];
      const nc = robot.c + dirs[robot.dir][1];

      if (
        nr < 0 ||
        nr >= level.map.length ||
        nc < 0 ||
        nc >= level.map[0].length ||
        level.map[nr][nc] === '#'
      ) {
        activeStep = -1;
        running = false;
        renderCommands();
        logEntries.push(`Crash: Zeile ${lineNumber + 1} schickt den Bot gegen eine Wand.`);
        renderLog();
        out.innerHTML = `💥 Crash in Versuch ${tries}. Beobachte den letzten Schritt und probiere eine andere Korrektur.`;
        return false;
      }

      robot.r = nr;
      robot.c = nc;
      trail.push(`${nr}-${nc}`);
      logEntries.push(`Bot fährt auf Feld (${nr + 1}, ${nc + 1}).`);
      renderGrid();
      renderLog();
      await sleep(240);
      return true;
    }

    async function runProgram() {
      if (running) return;
      running = true;
      tries += 1;
      selected = [];
      openRepeatEditor = null;
      activeStep = -1;
      robot = { r: start.r, c: start.c, dir: 0 };
      trail = [`${start.r}-${start.c}`];
      logEntries = [`Testlauf ${tries} gestartet.`];
      renderCommands();
      renderGrid();
      renderLog();

      let lastRepeatableCommand = null;

      for (let i = 0; i < commands.length; i += 1) {
        const cmd = commands[i];
        activeStep = i;
        renderCommands();
        out.innerHTML = `Schritt ${i + 1}/${commands.length}: <strong>${safeHtml(formatCommand(cmd))}</strong>`;
        logEntries.push(`Zeile ${i + 1}: ${formatCommand(cmd)}`);
        renderLog();

        if (cmd.type === 'repeat') {
          if (!lastRepeatableCommand) {
            logEntries.push('Die Wiederholung hat hier noch keine Wirkung.');
            renderLog();
            continue;
          }

          logEntries.push(`Wiederholt ${formatCommand(lastRepeatableCommand)} ${cmd.count}x.`);
          renderLog();

          for (let repeatIndex = 0; repeatIndex < cmd.count; repeatIndex += 1) {
            const ok = await executeBaseCommand(
              lastRepeatableCommand,
              i,
              `Wiederholung ${repeatIndex + 1}/${cmd.count}`,
            );

            if (!ok) {
              return;
            }
          }

          continue;
        }

        lastRepeatableCommand = { ...cmd };

        const ok = await executeBaseCommand(cmd, i);
        if (!ok) {
          return;
        }
      }

      activeStep = -1;
      running = false;
      renderCommands();

      if (level.map[robot.r][robot.c] === 'G') {
        const score = Math.max(1, level.points - (tries - 1));
        totalPoints += score;
        playSuccessTone();
        logEntries.push('Ziel erreicht. Debug-Fall gelöst.');
        renderLog();
        out.innerHTML = `✅ ${safeHtml(level.title)} geschafft! +${score} Punkte.<br/>${safeHtml(level.explain)}`;
        const nextBtn = document.createElement('button');
        nextBtn.textContent = levelIndex === levels.length - 1 ? 'Mission abschließen' : 'Nächstes Level';
        nextBtn.addEventListener('click', () => {
          levelIndex += 1;
          if (levelIndex >= levels.length) {
            api.finish(totalPoints, `Bug Hunt: ${totalPoints}/20 Basispunkte in 5 Leveln`);
          } else {
            startLevel();
          }
        });
        out.appendChild(document.createElement('br'));
        out.appendChild(nextBtn);
        api.app.querySelector('#runBtn').disabled = true;
      } else {
        logEntries.push('Programm lief durch, aber das Ziel wurde nicht erreicht.');
        renderLog();
        out.textContent = 'Der Bot ist noch nicht am Ziel. Tausche zwei andere Befehle.';
      }
    }

    renderGrid();
    renderCommands();
    renderLog();
    api.app.querySelector('#runBtn').addEventListener('click', runProgram);
    api.app.querySelector('#resetBtn').addEventListener('click', startLevel);
    api.app.querySelector('#menuBtn').addEventListener('click', api.menu);
  }

  startLevel();
}

function cloneCommand(command) {
  if (typeof command === 'string') {
    return { type: command };
  }

  return { ...command };
}

function canEditRepeatCount(command) {
  return command.type === 'repeat' && command.editableCount;
}

function findStart(map) {
  for (let r = 0; r < map.length; r += 1) {
    for (let c = 0; c < map[r].length; c += 1) {
      if (map[r][c] === 'S') {
        return { r, c };
      }
    }
  }

  return { r: 0, c: 0 };
}

function formatCommand(cmd) {
  if (cmd.type === 'vor') return 'moveForward()';
  if (cmd.type === 'links') return 'turnLeft()';
  if (cmd.type === 'rechts') return 'turnRight()';
  return `repeat(${cmd.count})`;
}
