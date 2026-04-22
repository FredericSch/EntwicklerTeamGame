/*
 * Passwort-Raetsel is a compact deduction game.
 * Players fill only the missing cells they need, while hints stay progressive and mobile-friendly.
 */

import { playSuccessTone, safeHtml } from '../utils.js';

export function renderPasswordRiddle(api) {
  const levels = [
    {
      title: 'Level 1: Schul-WLAN',
      points: 2,
      objective: 'Finde die richtige Person die das Passwort MoonKey hat. Du gewinnst, wenn in derselben Reihe der passende Name und das Passwort korrekt eingetragen sind.',
      targetSummary: 'Lina kennt MoonKey.',
      targetCells: [
        { rowIndex: 1, colIndex: 4, label: 'Passwort' },
      ],
      solutionRows: [
        ['Rot', 'Ben', 'Toast', 'Tablet', 'Nova7'],
        ['Gelb', 'Lina', 'Nüsse', 'Laptop', 'MoonKey'],
        ['Blau', 'Mila', 'Tee', 'Handy', 'SunLock'],
      ],
      visibleRows: [
        ['Rot', null, 'Toast', null, null],
        [null, 'Lina', null, 'Laptop', null],
        [null, null, 'Tee', 'Handy', null],
      ],
      coreHints: [
        'Das blaue Team hat nicht das richtige Passwort.',
        'Rot liegt nicht direkt neben Blau.',
        'Ben sitzt neben Lina und hat das Passwort Nova7.',
        'Das Tablet-Team hat nicht das richtige Passwort.',
        'Das Team mit Nüssen hat das Passwort MoonKey.',
      ],
      helperHints: [
        'Lina sitzt nicht in der obersten Reihe.',
        'Die mittlere Reihe ist das einzige Team mit Laptop.',
      ],
      explain: 'Die Mitte bleibt als einzige Reihe mit Laptop, Nüsse und dem gesuchten Passwort übrig.',
    },
    {
      title: 'Level 2: Serverraum',
      points: 3,
      objective: 'Finde heraus, welche Person den Laptop benutzt und in welchem Team sie ist. Um zu gewinnen, müssen in der Laptop-Reihe Farbe und Person stimmen.',
      targetSummary: 'Das grüne Team mit Malik hat den Laptop.',
      targetCells: [
        { rowIndex: 2, colIndex: 0, label: 'Teamfarbe' },
        { rowIndex: 2, colIndex: 1, label: 'Person' },
      ],
      solutionRows: [
        ['Orange', 'Aylin', 'Riegel', 'Tastatur', 'Flash5'],
        ['Blau', 'Kira', 'Cola', 'Tablet', 'Glitch9'],
        ['Grün', 'Malik', 'Wasser', 'Laptop', 'Quantum8'],
        ['Lila', 'Juri', 'Saft', 'Konsole', 'NightKey'],
      ],
      visibleRows: [
        ['Orange', 'Aylin', 'Riegel', 'Tastatur', null],
        ['Blau', 'Kira', null, 'Tablet', 'Glitch9'],
        [null, null, 'Wasser', 'Laptop', null],
        [null, 'Juri', 'Saft', null, 'NightKey'],
      ],
      coreHints: [
        'Die Laptop-Reihe ist weder orange noch lila.',
        'Malik sitzt in derselben Reihe wie Quantum8.',
        'Juri benutzt nicht den Laptop.',
        'Beim grünen Team steht Wasser auf dem Tisch.',
        'Die Reihe mit NightKey nutzt die Konsole.',
      ],
      helperHints: [
        'Juri sitzt im lila Team.',
        'Kira trinkt Cola im blauen Team.',
      ],
      explain: 'Wasser, Laptop und Malik gehören zusammen. Dadurch wird die ganze Ziel-Reihe eindeutig.',
    },
    {
      title: 'Level 3: Escape-Raum',
      points: 4,
      objective: 'Finde heraus, wer das richtige Passwort  hat und auf welchem Gerät es liegt. Gewonnen ist das Level, wenn Person, Gerät und Passwort in der Ziel-Reihe stimmen.',
      targetSummary: 'Lea nutzt ShadowFox auf dem Tablet.',
      targetCells: [
        { rowIndex: 1, colIndex: 1, label: 'Person' },
        { rowIndex: 1, colIndex: 3, label: 'Gerät' },
        { rowIndex: 1, colIndex: 4, label: 'Passwort' },
      ],
      solutionRows: [
        ['Silber', 'Omar', 'Popcorn', 'Konsole', 'Code33'],
        ['Blau', 'Lea', 'Obst', 'Tablet', 'ShadowFox'],
        ['Neon', 'Nia', 'Kaugummi', 'Laptop', 'Spark7'],
        ['Schwarz', 'Sami', 'Chips', 'Handy', 'LockBox'],
      ],
      visibleRows: [
        ['Silber', 'Omar', null, null, 'Code33'],
        ['Blau', null, 'Obst', null, null],
        ['Neon', null, 'Kaugummi', 'Laptop', 'Spark7'],
        ['Schwarz', null, 'Chips', 'Handy', null],
      ],
      coreHints: [
        'ShadowFox wird weder von Sami noch von Nia benutzt.',
        'Das gesuchte Passwort liegt beim blauen Team.',
        'Das blaue Team nutzt weder ein Handy noch eine Konsole.',
        'Lea sitzt nicht im schwarzen Team.',
        'Nia nutzt bereits Spark7 auf dem Laptop.',
      ],
      helperHints: [
        'Omar isst Popcorn.',
        'Sami sitzt im schwarzen Team mit LockBox.',
      ],
      explain: 'Erst schliesst du Personen aus, dann bleibt nur noch die blaue Tablet-Reihe mit Lea und ShadowFox.',
    },
    {
      title: 'Level 4: Creator-Camp',
      points: 5,
      objective: 'Diesmal wird die Aufgabe nicht direkt verraten: Finde die kritische Reihe, in der Laptop und Signal99 zusammenliegen. Zum Gewinnen müssen Farbe, Person und Passwort in dieser Reihe stimmen.',
      targetSummary: 'Jule sitzt im Mint-Team und kennt Signal99.',
      targetCells: [
        { rowIndex: 1, colIndex: 0, label: 'Teamfarbe' },
        { rowIndex: 1, colIndex: 1, label: 'Person' },
        { rowIndex: 1, colIndex: 4, label: 'Passwort' },
      ],
      solutionRows: [
        ['Koralle', 'Doro', 'Wrap', 'Tablet', 'Loop44'],
        ['Mint', 'Jule', 'Banane', 'Laptop', 'Signal99'],
        ['Nachtblau', 'Kenan', 'Chips', 'Konsole', 'Brick8'],
        ['Gold', 'Mara', 'Müsli', 'Handy', 'StarKey'],
      ],
      visibleRows: [
        ['Koralle', 'Doro', 'Wrap', null, 'Loop44'],
        [null, null, 'Banane', null, null],
        [null, 'Kenan', null, 'Konsole', null],
        ['Gold', null, 'Müsli', 'Handy', null],
      ],
      coreHints: [
        'Signal99 wird weder von Mara noch von Kenan benutzt.',
        'Jule sitzt im mintfarbenen Team.',
        'Kenan hat nicht das gesuchte Passwort.',
        'Die goldene Reihe gehört bereits zu StarKey.',
      ],
      helperHints: [
        'Kenan sitzt in der dunkelblauen Reihe an der Konsole.',
        'Mara ist in der goldenen Reihe mit Müsli.',
      ],
      explain: 'Die Hinweise sagen nie direkt "Jule hat Signal99", aber alle anderen Reihen fallen sauber weg.',
    },
    {
      title: 'Level 5: Robotik-Finale',
      points: 6,
      objective: 'Schweres Level: Finde die Sicherheits-Reihe, die VectorQ nutzt. Das Ziel ist erreicht, sobald Teamfarbe, Person, Snack und Passwort in der richtigen Reihe stimmen.',
      targetSummary: 'Farid sitzt im petrolfarbenen Team mit Kakao und VectorQ.',
      targetCells: [
        { rowIndex: 1, colIndex: 0, label: 'Teamfarbe' },
        { rowIndex: 1, colIndex: 1, label: 'Person' },
        { rowIndex: 1, colIndex: 2, label: 'Snack' },
        { rowIndex: 1, colIndex: 4, label: 'Passwort' },
      ],
      solutionRows: [
        ['Weiss', 'Ece', 'Saft', 'Handy', 'Beam1'],
        ['Petrol', 'Farid', 'Kakao', 'Konsole', 'VectorQ'],
        ['Pfirsich', 'Lio', 'Kekse', 'Laptop', 'Frame7'],
        ['Graphit', 'Tara', 'Apfel', 'Tablet', 'Pulse5'],
      ],
      visibleRows: [
        [null, 'Ece', 'Saft', null, null],
        [null, null, null, 'Konsole', null],
        ['Pfirsich', null, null, null, 'Frame7'],
        [null, 'Tara', null, 'Tablet', null],
      ],
      coreHints: [
        'VectorQ wird weder von Ece noch von Tara benutzt.',
        'Das gesuchte Passwort wird an der Konsole benutzt.',
        'Farid sitzt im petrolfarbenen Team.',
        'Im Team neben den Keksesessern steht Kakao auf dem Tisch',
        'Die pfirsichfarbene Reihe gehört bereits zu Frame7 und Keksen.',
        'Die graphitfarbene Reihe nutzt Pulse5 auf dem Tablet.',
        'Tara trinkt keinen Kakao.',
        'Das Petrolfarbene Team is neben dem Weißen Team mit Saft und Handy.',
        
      ],
      helperHints: [
        'Lio sitzt in der pfirsichfarbenen Reihe am Laptop.',
        'Tara sitzt nicht in der petrolfarbenen Reihe.',
      ],
      explain: 'Im letzten Level musst du mehrere kleine Hinweise kombinieren, bis nur noch die petrolfarbene Sicherheits-Reihe übrig bleibt.',
    },
  ];

  let levelIndex = 0;
  let totalPoints = 0;

  function drawLevel() {
    const level = levels[levelIndex];
    let attempts = 0;
    let revealedHelperHints = 0;
    const answers = {};
    const blanks = [];
    const targetKeys = new Set(level.targetCells.map((cell) => `${cell.rowIndex}-${cell.colIndex}`));

    level.visibleRows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          const key = `${rowIndex}-${colIndex}`;
          answers[key] = '';
          blanks.push({ rowIndex, colIndex, key });
        }
      });
    });

    const optionMap = buildOptions(level.solutionRows);

    api.mount(`
      <h2>🔐 Passwort-Rätsel</h2>
      <p class="small">Nutze die Tabelle wie ein Notizblatt: Fülle nur die wichtigen Felder zum Gewinnen oder den ganzen Fall, wenn dir das beim Denken hilft.</p>
      <div class="level-bar">
        <span class="tag">Level ${levelIndex + 1}/5</span>
        <span class="small">Pflichthinweise sind schon sichtbar. Zusatzhinweise sind optional.</span>
      </div>
      <div class="hint"><strong>${safeHtml(level.title)}</strong><br/>${safeHtml(level.objective)}</div>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Farbe</th><th>Person</th><th>Snack</th><th>Gerät</th><th>Passwort</th></tr></thead>
          <tbody>
            ${renderRows(level.visibleRows, optionMap, targetKeys)}
          </tbody>
        </table>
      </div>
      <div class="hint-list" id="coreHintList"></div>
      <div class="hint-list" id="helperHintList"></div>
      <div class="row">
        <button id="checkRiddleBtn">Tabelle prüfen</button>
        <button class="secondary" id="clearRiddleBtn">Offene Felder leeren</button>
        <button class="secondary" id="moreHintBtn">Zusatzhinweis zeigen</button>
        <button class="secondary" id="menuBtn">Menü</button>
      </div>
      <div id="riddleOut" class="hint">Tipp: Zum Gewinnen müssen nur die wichtigen Zielfelder stimmen. Die restlichen offenen Felder kannst du als Denkstütze nutzen.</div>
    `);

    const coreHintList = api.app.querySelector('#coreHintList');
    const helperHintList = api.app.querySelector('#helperHintList');
    const out = api.app.querySelector('#riddleOut');
    const moreHintBtn = api.app.querySelector('#moreHintBtn');
    const checkBtn = api.app.querySelector('#checkRiddleBtn');
    const clearBtn = api.app.querySelector('#clearRiddleBtn');
    const selects = [...api.app.querySelectorAll('.riddle-select')];

    selects.forEach((select) => {
      select.addEventListener('change', () => {
        answers[`${select.dataset.row}-${select.dataset.col}`] = select.value;
        select.classList.remove('riddle-correct', 'riddle-wrong');
      });
    });

    function renderHints() {
      coreHintList.innerHTML = level.coreHints
        .map((hint, index) => `<div class="hint"><strong>Hinweis ${index + 1}:</strong> ${safeHtml(hint)}</div>`)
        .join('');

      helperHintList.innerHTML = level.helperHints
        .slice(0, revealedHelperHints)
        .map((hint, index) => `<div class="hint"><strong>Zusatz ${index + 1}:</strong> ${safeHtml(hint)}</div>`)
        .join('');

      moreHintBtn.disabled = revealedHelperHints >= level.helperHints.length;
      moreHintBtn.hidden = level.helperHints.length === 0;
    }

    function lockInputs() {
      selects.forEach((select) => {
        select.disabled = true;
      });
      checkBtn.disabled = true;
      clearBtn.disabled = true;
      moreHintBtn.disabled = true;
    }

    function clearOpenFields() {
      blanks.forEach(({ key, rowIndex, colIndex }) => {
        answers[key] = '';
        const select = api.app.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
        if (select) {
          select.value = '';
          select.classList.remove('riddle-correct', 'riddle-wrong');
        }
      });
      out.textContent = `Offene Felder geleert. ${blanks.length} Felder warten auf deine Lösung.`;
    }

    function evaluateGrid() {
      attempts += 1;
      let correctCount = 0;

      blanks.forEach(({ key, rowIndex, colIndex }) => {
        const select = api.app.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
        const expected = level.solutionRows[rowIndex][colIndex];
        const current = answers[key];
        select.classList.remove('riddle-correct', 'riddle-wrong');
        if (current && current === expected) {
          correctCount += 1;
          select.classList.add('riddle-correct');
        } else if (current) {
          select.classList.add('riddle-wrong');
        }
      });

      const allTargetCellsCorrect = level.targetCells.every(({ rowIndex, colIndex }) => {
        const visibleValue = level.visibleRows[rowIndex][colIndex];
        const currentValue = visibleValue === null ? answers[`${rowIndex}-${colIndex}`] : visibleValue;
        return currentValue === level.solutionRows[rowIndex][colIndex];
      });

      if (allTargetCellsCorrect) {
        const hintPenalty = revealedHelperHints;
        const score = Math.max(2, level.points - hintPenalty - (attempts - 1));
        totalPoints += score;
        playSuccessTone();
        lockInputs();
        out.innerHTML = `✅ Ziel erreicht! <strong>${safeHtml(level.targetSummary)}</strong><br/>${safeHtml(level.explain)}<br/>+${score} Punkte.`;
        const nextBtn = document.createElement('button');
        nextBtn.textContent = levelIndex === levels.length - 1 ? 'Rätsel abschließen' : 'Nächstes Level';
        nextBtn.addEventListener('click', () => {
          levelIndex += 1;
          if (levelIndex >= levels.length) {
            api.finish(totalPoints, `Passwort-Rätsel: ${totalPoints}/20 Basispunkte in 5 Fällen`);
          } else {
            drawLevel();
          }
        });
        out.appendChild(document.createElement('br'));
        out.appendChild(nextBtn);
      } else {
        out.textContent = `Noch nicht gelöst. Nutze die Hinweise und prüfe die farbigen Markierungen bei deinen Einträgen.`;
      }
    }

    moreHintBtn.addEventListener('click', () => {
      revealedHelperHints += 1;
      renderHints();
      out.textContent = 'Ein Zusatzhinweis ist sichtbar. Die normalen Hinweise bleiben ohne Punktabzug immer offen.';
    });
    checkBtn.addEventListener('click', evaluateGrid);
    clearBtn.addEventListener('click', clearOpenFields);
    api.app.querySelector('#menuBtn').addEventListener('click', api.menu);
    renderHints();
  }

  drawLevel();
}

function renderRows(rows, optionMap, targetKeys) {
  return rows
    .map(
      (row, rowIndex) => `<tr>
        ${row
          .map((cell, colIndex) => {
            const isTarget = targetKeys.has(`${rowIndex}-${colIndex}`);
            if (cell !== null) {
              return `<td class="${isTarget ? 'riddle-target-cell' : ''}">${safeHtml(cell)}</td>`;
            }

            return `<td>${renderSelect(rowIndex, colIndex, optionMap[colIndex], isTarget)}</td>`;
          })
          .join('')}
      </tr>`
    )
    .join('');
}

function renderSelect(rowIndex, colIndex, options, isTarget) {
  return `<select class="riddle-select${isTarget ? ' riddle-target' : ''}" data-row="${rowIndex}" data-col="${colIndex}">
    <option value="">?</option>
    ${options.map((option) => `<option value="${safeHtml(option)}">${safeHtml(option)}</option>`).join('')}
  </select>`;
}

function buildOptions(solutionRows) {
  const optionMap = {};
  const columnCount = solutionRows[0].length;

  for (let colIndex = 0; colIndex < columnCount; colIndex += 1) {
    optionMap[colIndex] = [...new Set(solutionRows.map((row) => row[colIndex]))];
  }

  return optionMap;
}

