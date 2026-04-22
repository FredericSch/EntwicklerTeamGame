/*
 * Test-Labor simulates exploratory QA work.
 * Players interact with a mini screen, collect observations, and then submit the most accurate diagnosis.
 */

import { playSuccessTone, safeHtml } from '../utils.js';

export function renderTestLab(api) {
  const levels = [
    {
      title: 'Level 1: Lade-Button',
      points: 2,
      intro: 'Teste einen Button, der Inhalte laden soll, und finde die Fehler.',
      tools: [{ id: 'wait', label: '3 Sekunden warten' }],
      minimumActions: 2,
      diagnoses: [
        { id: 'endless-loading', label: 'Der Ladevorgang endet nicht.' },
        { id: 'button-dead', label: 'Der Button reagiert gar nicht.' },
        { id: 'wrong-page', label: 'Es öffnet sich die falsche Seite.' },
        { id: 'no-feedback', label: 'Es gibt gar kein Feedback.' },
      ],
      correctDiagnoses: ['endless-loading'],
      explain:
        'Der Button reagiert und zeigt sogar Feedback. Das Problem ist, dass der Zustand nie abgeschlossen wird und Nutzer:innen festhängen.',
      createState: () => ({ loading: false, waited: false }),
      render: (state) => `
        <div class="test-screen landing-demo">
          <div class="test-hero-panel">
            <div class="test-kicker">Festival Tickets</div>
            <div class="test-subline">Heute nur noch 12 Plaetze</div>
          </div>
          <button type="button" class="test-primary-action" data-test-action="press-button">
            ${
              state.loading
                ? '<span class="test-spinner"></span><span>Laedt ...</span>'
                : '<span>Tickets laden</span>'
            }
          </button>
          <div class="test-status-line">
            ${state.waited ? 'Noch immer keine Liste sichtbar.' : 'Beliebte Events in deiner Stadt'}
          </div>
        </div>
      `,
      act: (actionId, state) => {
        if (actionId === 'press-button') {
          state.loading = true;
          return 'Button gedrueckt: Ein Spinner erscheint.';
        }

        if (actionId === 'wait') {
          if (!state.loading) return 'Ohne Klick passiert noch nichts.';
          state.waited = true;
          return 'Auch nach ein paar Sekunden endet das Laden nicht.';
        }

        return 'Keine neue Beobachtung.';
      },
    },
    {
      title: 'Level 2: Burger-Menü',
      points: 3,
      intro: 'Teste ein Burger-Menü und finde heraus, was kaputt ist. Das Menü sollte sich schließen, wenn man einen Menüpunkt auswählt, raus kickt oder nochmal auf das Menü klickt.',
      tools: [],
      minimumActions: 3,
      diagnoses: [
        { id: 'menu-does-not-open', label: 'Das Menü öffnet nicht.' },
        { id: 'items-dead', label: 'Die Menüeinträge reagieren nicht.' },
        { id: 'outside-no-close', label: 'Klick außerhalb schließt das Menü nicht.' },
        { id: 'only-burger-closes', label: 'Das Menü schließt nur über das Menüsymbol.' },
      ],
      correctDiagnoses: ['outside-no-close', 'only-burger-closes'],
      explain:
        'Die Einträge reagieren, denn der Seitentitel ändert sich. Das eigentliche Problem ist das Schließen: Außenklick und Menüeintrag schließen das Menü nicht, nur das Symbol tut es.',
      createState: () => ({ menuOpen: false, pageTitle: 'Start', lastMenuAction: 'Noch kein Test.' }),
      render: (state) => `
        <div class="test-screen app-demo">
          <div class="test-app-bar">
            <button type="button" class="test-icon-button" data-test-action="toggle-menu">☰</button>
            <div class="test-app-title">${safeHtml(state.pageTitle)}</div>
            <div class="test-app-dot">●</div>
          </div>
          <div class="test-content-card-group">
            <div class="test-card-block"><strong>Heute</strong><span>Projektbesprechung 14:00</span></div>
            <div class="test-card-block"><strong>Neu</strong><span>2 Nachrichten</span></div>
          </div>
          <div class="test-status-line test-inline-status">${safeHtml(state.lastMenuAction)}</div>
          ${
            state.menuOpen
              ? `
                <button type="button" class="test-backdrop" data-test-action="tap-outside" aria-label="Außenfläche"></button>
                <div class="test-drawer">
                  <button type="button" class="test-drawer-item" data-test-action="goto-termine">Termine</button>
                  <button type="button" class="test-drawer-item" data-test-action="goto-profil">Profil</button>
                  <button type="button" class="test-drawer-item" data-test-action="goto-hilfe">Hilfe</button>
                </div>
              `
              : ''
          }
        </div>
      `,
      act: (actionId, state) => {
        if (actionId === 'toggle-menu') {
          state.menuOpen = !state.menuOpen;
          state.lastMenuAction = state.menuOpen ? 'Menü geöffnet.' : 'Menü über das Symbol wieder geschlossen.';
          return state.lastMenuAction;
        }

        if (actionId === 'tap-outside') {
          state.lastMenuAction = state.menuOpen ? 'Außenfläche angetippt: Das Menü bleibt offen.' : 'Außenklick ohne offenes Menü.';
          return state.lastMenuAction;
        }

        if (actionId === 'goto-termine') {
          state.pageTitle = 'Termine';
          state.lastMenuAction = 'Eintrag Termine angeklickt: Der Titel wechselt, das Menü bleibt aber offen.';
          return state.lastMenuAction;
        }

        if (actionId === 'goto-profil') {
          state.pageTitle = 'Profil';
          state.lastMenuAction = 'Eintrag Profil angeklickt: Der Titel wechselt, das Menü bleibt aber offen.';
          return state.lastMenuAction;
        }

        if (actionId === 'goto-hilfe') {
          state.pageTitle = 'Hilfe';
          state.lastMenuAction = 'Eintrag Hilfe angeklickt: Der Titel wechselt, das Menü bleibt aber offen.';
          return state.lastMenuAction;
        }

        return 'Keine neue Beobachtung.';
      },
    },
    {
      title: 'Level 3: Formular-Fehler',
      points: 4,
      intro: 'Teste ein Formular. Prüfe nicht nur, ob etwas rot wird, sondern ob Nutzer:innen wirklich verstehen, was falsch ist.',
      tools: [
        { id: 'fill-invalid', label: 'Falsche Mail einsetzen' },
        { id: 'fill-valid', label: 'Gültige Mail einsetzen' },
      ],
      minimumActions: 3,
      diagnoses: [
        { id: 'save-dead', label: 'Speichern funktioniert gar nicht.' },
        { id: 'visual-only-error', label: 'Der Fehler wird nur über Farbe oder Icon gezeigt.' },
        { id: 'missing-error-text', label: 'Es fehlt eine verständliche Fehlermeldung.' },
        { id: 'field-clears', label: 'Die Eingabe wird sofort gelöscht.' },
      ],
      correctDiagnoses: ['visual-only-error', 'missing-error-text'],
      explain:
        'Mit einer gültigen Mail klappt Speichern. Das Problem liegt also nicht im Button, sondern darin, dass bei Fehlern nur ein visueller Zustand erscheint und keine echte Hilfe für Nutzer:innen.',
      createState: () => ({ emailValue: '', attemptedSave: false, saved: false }),
      render: (state) => `
        <div class="test-screen form-demo">
          <div class="test-form-card ${state.attemptedSave && !isValidEmail(state.emailValue) ? 'form-error-state' : ''}">
            <label>Mailadresse</label>
            <div class="test-input-row">
              <input
                type="text"
                class="test-manual-input"
                data-test-input="email"
                value="${escapeAttribute(state.emailValue)}"
                placeholder="name@schule.de"
                ${state.saved ? 'disabled' : ''}
              />
              ${
                state.attemptedSave && !isValidEmail(state.emailValue)
                  ? '<span class="test-error-dot">!</span>'
                  : ''
              }
            </div>
          </div>
          <button type="button" class="test-primary-action" data-test-action="save-form">Speichern</button>
          <div class="test-status-line">
            ${state.saved ? 'Profil gespeichert.' : 'Profil für das Creator-Camp'}
          </div>
        </div>
      `,
      act: (actionId, state) => {
        if (actionId === 'fill-invalid') {
          state.emailValue = 'name.schule.de';
          state.attemptedSave = false;
          state.saved = false;
          return 'Falsche Mail eingesetzt.';
        }

        if (actionId === 'fill-valid') {
          state.emailValue = 'name@schule.de';
          state.attemptedSave = false;
          state.saved = false;
          return 'Gültige Mail eingesetzt.';
        }

        if (actionId === 'input-changed') {
          state.attemptedSave = false;
          state.saved = false;
          return `Eingabe geändert: ${state.emailValue || 'Feld ist leer.'}`;
        }

        if (actionId === 'save-form') {
          state.attemptedSave = true;
          if (isValidEmail(state.emailValue)) {
            state.saved = true;
            return 'Speichern mit gültiger Mail funktioniert.';
          }

          state.saved = false;
          return 'Speichern mit ungültiger Mail markiert nur das Feld, erklärt aber nichts.';
        }

        return 'Keine neue Beobachtung.';
      },
    },
    {
      title: 'Level 4: Tabs prüfen',
      points: 5,
      intro: 'Teste eine kleine Profilansicht mit Tabs. Prüfe, ob die sichtbaren Inhalte wirklich zum aktiven Tab passen.',
      tools: [],
      minimumActions: 2,
      diagnoses: [
        { id: 'tabs-dead', label: 'Die Tabs reagieren gar nicht.' },
        { id: 'content-mismatch', label: 'Aktiver Tab und angezeigter Inhalt passen nicht zusammen.' },
        { id: 'screen-no-scroll', label: 'Die Seite lädt endlos lange.' },
        { id: 'back-missing', label: 'Posts verschwinden einfach.' },
      ],
      correctDiagnoses: ['content-mismatch'],
      explain:
        'Die Tabs reagieren sichtbar, denn der aktive Zustand wechselt. Der eigentliche Bug ist, dass der Inhalt darunter nicht mitwechselt und damit falsches Feedback gibt.',
      createState: () => ({ activeTab: 'Posts' }),
      render: (state) => `
        <div class="test-screen tabs-demo">
          <div class="test-profile-head">
            <strong>Creator Camp</strong>
            <span>12,4k Follower</span>
          </div>
          <div class="test-tab-row">
            ${renderTabButton('Posts', state.activeTab)}
            ${renderTabButton('Videos', state.activeTab)}
            ${renderTabButton('Info', state.activeTab)}
          </div>
          <div class="test-tab-state">Aktiv: ${safeHtml(state.activeTab)}</div>
          <div class="test-content-card-group">
            <div class="test-card-block"><strong>Post</strong><span>Behind the scenes</span></div>
            <div class="test-card-block"><strong>Post</strong><span>Neue Workshopbilder</span></div>
          </div>
        </div>
      `,
      act: (actionId, state) => {
        if (actionId === 'tab-posts') {
          state.activeTab = 'Posts';
          return 'Tab Posts aktiviert. Inhalt bleibt wie zuvor.';
        }

        if (actionId === 'tab-videos') {
          state.activeTab = 'Videos';
          return 'Tab Videos aktiviert. Sichtbar bleiben trotzdem normale Posts.';
        }

        if (actionId === 'tab-info') {
          state.activeTab = 'Info';
          return 'Tab Info aktiviert. Sichtbar bleiben trotzdem normale Posts.';
        }

        return 'Keine neue Beobachtung.';
      },
    },
    {
      title: 'Level 5: Share-Sheet',
      points: 6,
      intro: 'Härteres Level: Teste ein Share-Sheet. Finde heraus, was mit dem Panel und dem Hintergrund schiefläuft.',
      tools: [{ id: 'like-post', label: 'Like Button klicken' }],
      minimumActions: 4,
      diagnoses: [
        { id: 'share-does-not-open', label: 'Der Teilen-Button öffnet kein Panel.' },
        { id: 'outside-no-close', label: 'Klick außerhalb schließt das Panel nicht.' },
        { id: 'sheet-actions-dead', label: 'Die Aktionen im Panel reagieren nicht.' },
        { id: 'background-still-active', label: 'Der Hintergrund bleibt trotz offenem Panel bedienbar.' },
      ],
      correctDiagnoses: ['outside-no-close', 'background-still-active'],
      explain:
        'Das Panel öffnet sich und seine Aktionen reagieren. Der eigentliche Fehler ist die Modallogik: Außenklick schließt nicht und der Hintergrund bleibt weiter klickbar.',
      createState: () => ({ sheetOpen: false, likes: 12, infoText: 'Teile dein Projekt' }),
      render: (state) => `
        <div class="test-screen share-demo">
          <div class="test-photo-card">
            <div class="test-photo-title">Projektfoto</div>
            <div class="test-photo-meta">Likes: ${state.likes}</div>
          </div>
          <div class="test-action-row">
            <button type="button" class="test-secondary-action" data-test-action="like-post">Like</button>
            <button type="button" class="test-primary-action compact-action" data-test-action="open-share">Teilen</button>
          </div>
          <div class="test-status-line">${safeHtml(state.infoText)}</div>
          ${
            state.sheetOpen
              ? `
                <button type="button" class="test-backdrop light-backdrop" data-test-action="tap-outside" aria-label="Außenfläche"></button>
                <div class="test-sheet">
                  <div class="test-sheet-title">Teilen</div>
                  <button type="button" class="test-sheet-item" data-test-action="copy-link">Link kopieren</button>
                  <button type="button" class="test-sheet-item" data-test-action="share-chat">Im Klassenchat teilen</button>
                </div>
              `
              : ''
          }
        </div>
      `,
      act: (actionId, state) => {
        if (actionId === 'open-share') {
          state.sheetOpen = true;
          state.infoText = 'Share-Sheet geöffnet';
          return 'Share-Sheet geöffnet.';
        }

        if (actionId === 'tap-outside') {
          return state.sheetOpen ? 'Außenfläche angetippt: Das Panel bleibt offen.' : 'Ohne Panel gibt es keine Außenfläche zu testen.';
        }

        if (actionId === 'copy-link') {
          state.infoText = 'Link kopiert';
          return 'Link kopieren reagiert, das Panel bleibt aber offen.';
        }

        if (actionId === 'share-chat') {
          state.infoText = 'Im Klassenchat geteilt';
          return 'Share-Aktion reagiert, das Panel bleibt aber offen.';
        }

        if (actionId === 'like-post') {
          state.likes += 1;
          return state.sheetOpen
            ? 'Trotz offenem Panel lässt sich der Hintergrund liken.'
            : 'Like funktioniert normal.';
        }

        return 'Keine neue Beobachtung.';
      },
    },
  ];

  let levelIndex = 0;
  let totalPoints = 0;

  function drawLevel() {
    const level = levels[levelIndex];
    const state = level.createState();
    const notes = [];
    const selectedDiagnoses = new Set();
    let submitted = false;

    api.mount(`
      <h2>🧪 Test-Labor</h2>
      <p class="small">Du bist QA-Tester:in. Teste kleine Komponenten und Mini-Screens aktiv: klicken, beobachten, vergleichen und danach die richtige Diagnose auswählen. Nutze den Bereich "Test-Aktionen" um verschiedene Aktionen zu simulieren.</p>
      <div class="level-bar">
        <span class="tag">Level ${levelIndex + 1}/5</span>
        <span class="small">${safeHtml(level.intro)}</span>
      </div>
      <div class="test-lab-layout">
        <div class="mock-phone test-phone-shell">
          <div class="mock-header-bar">${safeHtml(level.title)}</div>
          <div id="testPreview" class="test-preview"></div>
        </div>
        <div class="test-side-panel">
          <div class="debug-panel test-toolbar-panel">
            <div class="debug-title">Test-Aktionen</div>
            <div id="testTools" class="test-toolbar"></div>
          </div>
          <div class="debug-panel">
            <div class="debug-title">Test-Notizen</div>
            <div id="testNotes" class="debug-log"></div>
          </div>
        </div>
      </div>
      <div class="hint test-diagnosis-hint">
        <strong>Diagnose:</strong> ${
          level.correctDiagnoses.length > 1
            ? 'Es können mehrere Antworten stimmen.'
            : 'Wähle die beste Diagnose.'
        }
      </div>
      <div id="diagnosisGrid" class="diagnosis-grid"></div>
      <div class="row">
        <button id="submitLab">Diagnose prüfen</button>
        <button class="secondary" id="resetLab">Level neu starten</button>
        <button class="secondary" id="menuBtn">Menü</button>
      </div>
      <div id="labOut" class="hint">Teste zuerst mehrere Dinge. Die Antworten verraten nicht, was du ausprobieren solltest.</div>
    `);

    const preview = api.app.querySelector('#testPreview');
    const tools = api.app.querySelector('#testTools');
    const notesWrap = api.app.querySelector('#testNotes');
    const diagnosisGrid = api.app.querySelector('#diagnosisGrid');
    const out = api.app.querySelector('#labOut');
    const submitBtn = api.app.querySelector('#submitLab');
    const resetBtn = api.app.querySelector('#resetLab');

    function renderTools() {
      const toolButtons = level.tools
        .map(
          (tool) =>
            `<button type="button" class="secondary test-tool-button" data-tool-action="${tool.id}" ${submitted ? 'disabled' : ''}>${safeHtml(tool.label)}</button>`
        )
        .join('');

      tools.innerHTML = toolButtons || '<div class="log-entry">Dieses Level testest du direkt im Mockup.</div>';
      tools.querySelectorAll('[data-tool-action]').forEach((button) => {
        button.addEventListener('click', () => handleAction(button.dataset.toolAction));
      });
    }

    function renderNotes() {
      notesWrap.innerHTML = notes.length
        ? notes.map((entry) => `<div class="log-entry">${safeHtml(entry)}</div>`).join('')
        : '<div class="log-entry">Noch keine Tests durchgeführt.</div>';
      notesWrap.scrollTop = notesWrap.scrollHeight;
    }

    function renderDiagnoses() {
      const correctSet = new Set(level.correctDiagnoses);
      diagnosisGrid.innerHTML = level.diagnoses
        .map((diagnosis) => {
          const isSelected = selectedDiagnoses.has(diagnosis.id);
          const resultClass = submitted
            ? correctSet.has(diagnosis.id)
              ? 'choice-correct'
              : isSelected
                ? 'choice-wrong'
                : ''
            : '';
          return `
            <button
              type="button"
              class="secondary diagnosis-choice ${isSelected ? 'active' : ''} ${resultClass}"
              data-diagnosis="${diagnosis.id}"
              ${submitted ? 'disabled' : ''}
            >
              ${safeHtml(diagnosis.label)}
            </button>
          `;
        })
        .join('');

      diagnosisGrid.querySelectorAll('[data-diagnosis]').forEach((button) => {
        button.addEventListener('click', () => {
          const { diagnosis } = button.dataset;
          if (selectedDiagnoses.has(diagnosis)) {
            selectedDiagnoses.delete(diagnosis);
          } else {
            selectedDiagnoses.add(diagnosis);
          }
          renderDiagnoses();
        });
      });
    }

    function renderPreview() {
      preview.innerHTML = level.render(state);
      preview.querySelectorAll('[data-test-action]').forEach((button) => {
        button.addEventListener('click', () => handleAction(button.dataset.testAction));
        if (submitted) button.disabled = true;
      });
      preview.querySelectorAll('[data-test-input]').forEach((input) => {
        input.addEventListener('input', () => {
          if (submitted) return;
          state.emailValue = input.value;
          const note = level.act('input-changed', state);
          if (note) {
            notes.push(note);
            if (notes.length > 5) notes.shift();
          }
          renderNotes();
        });
      });
    }

    function handleAction(actionId) {
      if (submitted) return;
      const note = level.act(actionId, state);
      if (note) {
        notes.push(note);
        if (notes.length > 5) notes.shift();
      }
      renderPreview();
      renderNotes();
    }

    submitBtn.addEventListener('click', () => {
      if (notes.length < level.minimumActions) {
        out.textContent = `Teste zuerst mindestens ${level.minimumActions} Dinge, bevor du eine Diagnose abgibst.`;
        return;
      }

      if (selectedDiagnoses.size === 0) {
        out.textContent = 'Wähle mindestens eine Diagnose aus.';
        return;
      }

      submitted = true;
      const result = evaluateDiagnoses(level.correctDiagnoses, selectedDiagnoses, level.points);
      totalPoints += result.score;
      if (result.exact) playSuccessTone();
      renderPreview();
      renderTools();
      renderDiagnoses();

      out.innerHTML = `${
        result.exact ? '✅ Gute Diagnose!' : '🙂 Teilweise richtig.'
      } ${safeHtml(level.explain)}<br/>+${result.score} Punkte.`;
      const nextBtn = document.createElement('button');
      nextBtn.textContent = levelIndex === levels.length - 1 ? 'Labor abschließen' : 'Nächstes Level';
      nextBtn.addEventListener('click', () => {
        levelIndex += 1;
        if (levelIndex >= levels.length) {
          api.finish(totalPoints, `Test-Labor: ${totalPoints}/20 Basispunkte in 5 Testfällen`);
        } else {
          drawLevel();
        }
      });
      out.appendChild(document.createElement('br'));
      out.appendChild(nextBtn);
      submitBtn.disabled = true;
    });

    resetBtn.addEventListener('click', drawLevel);
    api.app.querySelector('#menuBtn').addEventListener('click', api.menu);

    renderPreview();
    renderTools();
    renderNotes();
    renderDiagnoses();
  }

  drawLevel();
}

function renderTabButton(label, activeTab) {
  const actionId = `tab-${label.toLowerCase()}`;
  const activeClass = label === activeTab ? 'is-active-tab' : '';
  return `<button type="button" class="test-tab-button ${activeClass}" data-test-action="${actionId}">${safeHtml(label)}</button>`;
}

function evaluateDiagnoses(correctDiagnoses, selectedDiagnoses, levelPoints) {
  const correctSet = new Set(correctDiagnoses);
  const selected = [...selectedDiagnoses];
  const wrong = selected.filter((item) => !correctSet.has(item)).length;
  const missed = [...correctSet].filter((item) => !selectedDiagnoses.has(item)).length;
  const exact = wrong === 0 && missed === 0;
  const score = exact ? levelPoints : Math.max(1, levelPoints - wrong - missed);

  return {
    exact,
    score,
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}
