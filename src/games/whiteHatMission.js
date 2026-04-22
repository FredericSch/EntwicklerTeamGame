/*
 * White-Hat Mission is kept as an inactive module for possible later reactivation.
 * It uses the same shell contract as the active games but is currently not listed in app.js.
 */

import { playSuccessTone, safeHtml } from '../utils.js';

export function renderWhiteHatMission(api) {
  const levels = [
    {
      title: 'Level 1: Leerer Login',
      points: 2,
      intro: 'Du willst dir Zugang zu einer App verschaffen. Teste den Login und finde die Schwachstelle.',
      minimumActions: 1,
      hints: [
        'Probiere nicht nur normale Eingaben aus.',
        'Teste auch, was ohne Eingabe passiert.',
        'Lösung: Beide Felder leer lassen und dann auf Login drücken.',
      ],
      diagnoses: [
        { id: 'empty-login', label: 'Der Login klappt sogar mit leeren Feldern.' },
        { id: 'dead-button', label: 'Der Login-Button reagiert nicht.' },
        { id: 'only-reset', label: 'Nur Passwort vergessen funktioniert.' },
        { id: 'wrong-copy', label: 'Nur der Text auf der Seite ist verwirrend.' },
      ],
      correctDiagnoses: ['empty-login'],
      explain: 'Ein Login darf nie ohne Eingabe oder Prüfung funktionieren. Hier fehlt eine grundlegende Zugangskontrolle.',
      createState: () => ({ email: '', password: '', status: 'Bitte einloggen.', unlocked: false }),
      render: (state) => `
        <div class="mission-screen">
          <div class="mission-login-panel">
            <div class="mission-logo">Campus Hub</div>
            <label class="mission-mini-label">E-Mail</label>
            <input class="mission-input" data-security-input="email" value="${escapeAttribute(state.email)}" placeholder="name@schule.de" />
            <label class="mission-mini-label">Passwort</label>
            <input class="mission-input" data-security-input="password" type="password" value="${escapeAttribute(state.password)}" placeholder="Passwort" />
            <button type="button" class="test-primary-action" data-security-action="attempt-login">Login</button>
            <div class="test-status-line">${safeHtml(state.status)}</div>
            ${state.unlocked ? '<div class="mission-success">Zugang gewährt</div>' : ''}
          </div>
        </div>
      `,
      act: (actionId, state) => {
        if (actionId === 'attempt-login') {
          if (state.email.trim() === '' && state.password.trim() === '') {
            state.unlocked = true;
            state.status = 'Willkommen im Lernbereich.';
            return 'Login mit komplett leeren Feldern klappt.';
          }
          state.unlocked = false;
          state.status = 'Zugangsdaten nicht erkannt.';
          return 'Mit normalen Eingaben scheitert der Login.';
        }
        return 'Keine neue Beobachtung.';
      },
    },
    {
      title: 'Level 2: Standardpasswort',
      points: 3,
      intro: 'Das Konto ist schon vorgegeben. Finde heraus, wie leicht man trotzdem reinkommt.',
      minimumActions: 1,
      hints: [
        'Probiere sehr einfache Passwörter aus.',
        'Denk an Dinge, die viele Menschen leider wirklich benutzen.',
        'Lösung: Das Passwort ist 123456.',
      ],
      diagnoses: [
        { id: 'default-password', label: 'Ein sehr einfaches Standardpasswort reicht für den Zugang.' },
        { id: 'email-empty', label: 'Nur ohne E-Mail kommt man rein.' },
        { id: 'button-broken', label: 'Der Login-Button reagiert nicht.' },
        { id: 'impressum-login', label: 'Nur über das Impressum klappt der Zugang.' },
      ],
      correctDiagnoses: ['default-password'],
      explain: 'Einfache Standardpasswörter sind keine echte Hürde. Schon ein banales Passwort kann ein Konto komplett offen lassen.',
      createState: () => ({ password: '', status: 'Konto: team@camp.app', unlocked: false }),
      render: (state) => `
        <div class="mission-screen">
          <div class="mission-login-panel">
            <div class="mission-logo">Team Space</div>
            <div class="mission-readonly">team@camp.app</div>
            <label class="mission-mini-label">Passwort</label>
            <input class="mission-input" data-security-input="password" type="password" value="${escapeAttribute(state.password)}" placeholder="Passwort" />
            <button type="button" class="test-primary-action" data-security-action="attempt-login">Login</button>
            <div class="test-status-line">${safeHtml(state.status)}</div>
            ${state.unlocked ? '<div class="mission-success">Der Bereich öffnet sich mit einem Standardpasswort.</div>' : ''}
          </div>
        </div>
      `,
      act: (actionId, state) => {
        if (actionId === 'attempt-login') {
          if (state.password === '123456') {
            state.unlocked = true;
            state.status = 'Willkommen im Team-Bereich.';
            return 'Das Konto öffnet sich mit dem Passwort 123456.';
          }
          state.unlocked = false;
          state.status = 'Passwort falsch.';
          return 'Mit anderen Passwörtern klappt der Login nicht.';
        }
        return 'Keine neue Beobachtung.';
      },
    },
    {
      title: 'Level 3: Passwort-Frage',
      points: 4,
      intro: 'Du kommst beim normalen Login nicht weiter. Teste, ob der Passwort-Reset eine zu einfache Abkürzung bietet.',
      minimumActions: 3,
      hints: [
        'Probiere nicht nur den Login-Button aus.',
        'Schau, ob irgendwo öffentliche Infos zur Sicherheitsfrage auftauchen.',
        'Lösung: Über Impressum findest du die Stadt Essen und kannst damit die Sicherheitsfrage lösen.',
      ],
      diagnoses: [
        { id: 'public-reset-answer', label: 'Die Antwort auf die Sicherheitsfrage steht öffentlich auf der Seite.' },
        { id: 'reset-dead', label: 'Passwort vergessen reagiert nicht.' },
        { id: 'impressum-opens-app', label: 'Das Impressum öffnet direkt den Account.' },
        { id: 'login-empty', label: 'Man kommt nur mit leerem Login rein.' },
      ],
      correctDiagnoses: ['public-reset-answer'],
      explain: 'Sicherheitsfragen taugen nichts, wenn die Antwort öffentlich sichtbar oder leicht zu erraten ist. Dann ist der Reset selbst die Schwachstelle.',
      createState: () => ({ resetOpen: false, impressumOpen: false, answer: '', status: 'Konto gesperrt.', resetDone: false }),
      render: (state) => `
        <div class="mission-screen">
          <div class="mission-login-panel">
            <div class="mission-logo">Study Cloud</div>
            <div class="mission-readonly">jule@study.app</div>
            <div class="mission-row">
              <button type="button" class="test-primary-action compact-action" data-security-action="attempt-login">Login</button>
              <button type="button" class="test-secondary-action compact-action" data-security-action="open-reset">Passwort vergessen</button>
            </div>
            <div class="mission-link-bar">
              <button type="button" class="mission-inline-link" data-security-action="open-impressum">Impressum</button>
            </div>
            <div class="test-status-line">${safeHtml(state.status)}</div>
            ${
              state.resetOpen
                ? `
                  <div class="mission-question-card">
                    <div class="mission-mini-label">Sicherheitsfrage</div>
                    <div class="mission-faded-note">In welcher Stadt ist unser Hauptsitz?</div>
                    <input class="mission-input" data-security-input="answer" value="${escapeAttribute(state.answer)}" placeholder="Antwort" />
                    <button type="button" class="test-secondary-action" data-security-action="check-answer">Antwort prüfen</button>
                  </div>
                `
                : ''
            }
            ${
              state.impressumOpen
                ? `
                  <div class="mission-legal-card">
                    <strong>Impressum</strong>
                    <span>Study Cloud GmbH</span>
                    <span>Standort: Essen</span>
                  </div>
                `
                : ''
            }
            ${state.resetDone ? '<div class="mission-success">Reset-Link gesendet. Kontoübernahme wäre möglich.</div>' : ''}
          </div>
        </div>
      `,
      act: (actionId, state) => {
        if (actionId === 'attempt-login') {
          state.status = 'Normale Loginversuche scheitern.';
          return 'Der direkte Login bringt dich hier nicht weiter.';
        }
        if (actionId === 'open-reset') {
          state.resetOpen = true;
          state.status = 'Sicherheitsfrage geöffnet.';
          return 'Passwort vergessen öffnet eine Sicherheitsfrage.';
        }
        if (actionId === 'open-impressum') {
          state.impressumOpen = true;
          state.status = 'Impressum geöffnet.';
          return 'Impressum zeigt öffentlich die Stadt Essen.';
        }
        if (actionId === 'check-answer') {
          if (state.answer.trim().toLowerCase() === 'essen') {
            state.resetDone = true;
            state.status = 'Reset erfolgreich.';
            return 'Mit der öffentlichen Info Essen lässt sich der Reset auslösen.';
          }
          state.resetDone = false;
          state.status = 'Antwort falsch.';
          return 'Mit anderen Antworten klappt der Reset nicht.';
        }
        return 'Keine neue Beobachtung.';
      },
    },
    {
      title: 'Level 4: Entwickler-Menü',
      points: 5,
      intro: 'Teste eine Einstellungsseite. Vielleicht steckt irgendwo ein versteckter Weg in einen geschützten Bereich.',
      minimumActions: 3,
      hints: [
        'Nicht nur die großen Buttons sind spannend.',
        'Manche versteckten Funktionen reagieren erst nach mehreren Klicks.',
        'Lösung: Tippe dreimal auf die Versionsnummer und öffne dann die Admin-Vorschau.',
      ],
      diagnoses: [
        { id: 'version-secret', label: 'Mehrfachklick auf die Versionsnummer öffnet einen geschützten Bereich.' },
        { id: 'settings-dead', label: 'Die Einstellungen reagieren gar nicht.' },
        { id: 'help-opens-admin', label: 'Nur der Hilfe-Button führt in den Admin-Bereich.' },
        { id: 'backdoor-login', label: 'Man braucht nur ein Standardpasswort.' },
      ],
      correctDiagnoses: ['version-secret'],
      explain: 'Versteckte Schalter ohne Zugriffskontrolle sind riskant. Schon neugieriges Herumtippen kann sonst interne Bereiche freilegen.',
      createState: () => ({ taps: 0, devVisible: false, adminOpen: false, status: 'Normale Einstellungen sichtbar.' }),
      render: (state) => `
        <div class="mission-screen">
          <div class="mission-login-panel">
            <div class="mission-logo">Focus App</div>
            <div class="test-card-block"><strong>Benachrichtigungen</strong><span>An</span></div>
            <div class="test-card-block"><strong>Design</strong><span>Hell</span></div>
            <button type="button" class="mission-version-chip" data-security-action="tap-version">Version 2.4.1</button>
            <div class="test-status-line">${safeHtml(state.status)}</div>
            ${state.devVisible ? '<button type="button" class="test-secondary-action" data-security-action="open-admin">Admin-Vorschau öffnen</button>' : ''}
            ${state.adminOpen ? '<div class="mission-success">Admin-Vorschau öffnet sich ohne weitere Prüfung.</div>' : ''}
          </div>
        </div>
      `,
      act: (actionId, state) => {
        if (actionId === 'tap-version') {
          state.taps += 1;
          if (state.taps >= 3) {
            state.devVisible = true;
            state.status = 'Entwickler-Menü sichtbar.';
            return 'Nach mehreren Klicks taucht ein verstecktes Entwickler-Menü auf.';
          }
          state.status = `Versionsfeld getestet (${state.taps}/3).`;
          return `Ein weiterer Klick auf die Versionsnummer wurde erkannt (${state.taps}/3).`;
        }
        if (actionId === 'open-admin') {
          if (state.devVisible) {
            state.adminOpen = true;
            state.status = 'Admin-Vorschau geöffnet.';
            return 'Die Admin-Vorschau öffnet sich ohne Login.';
          }
          return 'Ohne Entwickler-Menü passiert noch nichts.';
        }
        return 'Keine neue Beobachtung.';
      },
    },
    {
      title: 'Level 5: Vorschau-Link',
      points: 6,
      intro: 'Hier ist ein Album eigentlich gesperrt. Teste, ob ein geteilter Vorschau-Link die Sperre aushebelt.',
      minimumActions: 3,
      hints: [
        'Teste nicht nur den sichtbaren Schloss-Hinweis.',
        'Schau, ob Teilen oder Vorschau einen anderen Weg öffnen.',
        'Lösung: Erstelle den Vorschau-Link und öffne danach die Vorschau ohne Login.',
      ],
      diagnoses: [
        { id: 'public-preview', label: 'Ein öffentlicher Vorschau-Link umgeht die Sperre.' },
        { id: 'share-dead', label: 'Der Teilen-Button reagiert nicht.' },
        { id: 'lock-only-visual', label: 'Nur das Schloss-Symbol fehlt.' },
        { id: 'album-never-opens', label: 'Das Album lässt sich gar nicht öffnen.' },
      ],
      correctDiagnoses: ['public-preview'],
      explain: 'Auch eine Vorschau braucht klare Grenzen. Wenn ein geteilter Link denselben Zugang wie ein normales Konto ersetzt, ist die Sperre wirkungslos.',
      createState: () => ({ previewReady: false, albumOpen: false, status: 'Album nur für Teammitglieder.' }),
      render: (state) => `
        <div class="mission-screen">
          <div class="mission-login-panel">
            <div class="mission-lock-card">
              <strong>Projektalbum</strong>
              <span>🔒 Nur für Team</span>
            </div>
            <div class="mission-row">
              <button type="button" class="test-secondary-action compact-action" data-security-action="make-preview">Vorschau-Link</button>
              <button type="button" class="test-primary-action compact-action" data-security-action="open-preview" ${state.previewReady ? '' : 'disabled'}>Vorschau öffnen</button>
            </div>
            <div class="test-status-line">${safeHtml(state.status)}</div>
            ${state.albumOpen ? '<div class="mission-album-grid"><div class="mission-photo"></div><div class="mission-photo"></div><div class="mission-photo"></div></div>' : ''}
          </div>
        </div>
      `,
      act: (actionId, state) => {
        if (actionId === 'make-preview') {
          state.previewReady = true;
          state.status = 'Vorschau-Link erstellt.';
          return 'Ein öffentlicher Vorschau-Link wurde erstellt.';
        }
        if (actionId === 'open-preview') {
          if (state.previewReady) {
            state.albumOpen = true;
            state.status = 'Album geöffnet.';
            return 'Die Vorschau öffnet das Album trotz gesperrtem Bereich.';
          }
          return 'Ohne Link lässt sich noch nichts öffnen.';
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
    let revealedHints = 0;
    let submitted = false;
    let interactionCount = 0;

    api.mount(`
      <h2>🛡️ White-Hat Mission</h2>
      <p class="small">Du spielst eine ethische Hacker:in. Probiere sichere, kreative Eingaben und Buttons aus, um eine Schwachstelle zu finden. Danach beschreibst du, was die eigentliche Lücke war.</p>
      <div class="level-bar">
        <span class="tag">Level ${levelIndex + 1}/5</span>
        <span class="small">Kurze Sicherheits-Einsätze ohne technisches Vorwissen.</span>
      </div>
      <div class="hint"><strong>${safeHtml(level.title)}</strong><br/>${safeHtml(level.intro)}</div>
      <div class="test-lab-layout">
        <div class="mock-phone test-phone-shell">
          <div class="mock-header-bar">${safeHtml(level.title)}</div>
          <div id="missionPreview" class="test-preview"></div>
        </div>
        <div class="test-side-panel">
          <div class="debug-panel">
            <div class="debug-title">Test-Aktionen</div>
            <div id="missionTools" class="test-toolbar"></div>
          </div>
          <div class="debug-panel">
            <div class="debug-title">Notizen</div>
            <div id="missionNotes" class="debug-log"></div>
          </div>
          <div class="debug-panel">
            <div class="debug-title">Hinweise</div>
            <button id="hintBtn" class="secondary test-tool-button">Hinweis zeigen</button>
            <div id="hintList" class="hint-list" style="margin-top:10px;"></div>
          </div>
        </div>
      </div>
      <div class="hint test-diagnosis-hint">
        <strong>Diagnose:</strong> ${level.correctDiagnoses.length > 1 ? 'Es können mehrere Antworten stimmen.' : 'Wähle die beste Diagnose.'}
      </div>
      <div id="securityOptions" class="diagnosis-grid"></div>
      <div id="securityOut" class="hint">Teste zuerst mehrere Dinge. Wenn du festhängst, kannst du Hinweise aufdecken.</div>
      <div class="row">
        <button id="submitMission">Diagnose prüfen</button>
        <button class="secondary" id="resetMission">Level neu starten</button>
        <button class="secondary" id="menuBtn">Menü</button>
      </div>
    `);

    const preview = api.app.querySelector('#missionPreview');
    const tools = api.app.querySelector('#missionTools');
    const notesWrap = api.app.querySelector('#missionNotes');
    const hintList = api.app.querySelector('#hintList');
    const hintBtn = api.app.querySelector('#hintBtn');
    const wrap = api.app.querySelector('#securityOptions');
    const out = api.app.querySelector('#securityOut');
    const submitBtn = api.app.querySelector('#submitMission');

    function renderPreview() {
      preview.innerHTML = level.render(state);
      preview.querySelectorAll('[data-security-action]').forEach((button) => {
        button.addEventListener('click', () => handleAction(button.dataset.securityAction));
        if (submitted) button.disabled = true;
      });
      preview.querySelectorAll('[data-security-input]').forEach((input) => {
        input.addEventListener('input', () => {
          if (submitted) return;
          state[input.dataset.securityInput] = input.value;
        });
      });
    }

    function renderTools() {
      tools.innerHTML = '<div class="log-entry">Dieses Level testest du direkt im Mockup.</div>';
    }

    function renderNotes() {
      notesWrap.innerHTML = notes.length
        ? notes.map((entry) => `<div class="log-entry">${safeHtml(entry)}</div>`).join('')
        : '<div class="log-entry">Noch keine Tests durchgeführt.</div>';
      notesWrap.scrollTop = notesWrap.scrollHeight;
    }

    function renderHints() {
      hintList.innerHTML = level.hints
        .slice(0, revealedHints)
        .map((hint, index) => `<div class="hint"><strong>Hinweis ${index + 1}:</strong> ${safeHtml(hint)}</div>`)
        .join('');
      hintBtn.disabled = submitted || revealedHints >= level.hints.length;
    }

    function renderDiagnoses() {
      const correctSet = new Set(level.correctDiagnoses);
      wrap.innerHTML = level.diagnoses
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

      wrap.querySelectorAll('[data-diagnosis]').forEach((button) => {
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

    function handleAction(actionId) {
      if (submitted) return;
      interactionCount += 1;
      const note = level.act(actionId, state);
      if (note) {
        notes.push(note);
        if (notes.length > 6) notes.shift();
      }
      renderPreview();
      renderNotes();
    }

    hintBtn.addEventListener('click', () => {
      revealedHints += 1;
      renderHints();
      out.textContent = 'Ein Hinweis wurde aufgedeckt.';
    });

    submitBtn.addEventListener('click', () => {
      if (interactionCount < level.minimumActions) {
        out.textContent = `Teste zuerst mindestens ${level.minimumActions} Dinge, bevor du die Lücke bewertest.`;
        return;
      }
      if (selectedDiagnoses.size === 0) {
        out.textContent = 'Wähle mindestens eine Diagnose aus.';
        return;
      }

      submitted = true;
      const result = evaluateMissionResult(level.correctDiagnoses, selectedDiagnoses, level.points, revealedHints, level.hints.length);
      totalPoints += result.score;
      if (result.exact) playSuccessTone();
      renderPreview();
      renderTools();
      renderHints();
      renderDiagnoses();

      out.innerHTML = `${result.exact ? '✅ Lücke erkannt!' : '🙂 Teilweise richtig.'} ${safeHtml(level.explain)}<br/>+${result.score} Punkte.`;
      const nextBtn = document.createElement('button');
      nextBtn.textContent = levelIndex === levels.length - 1 ? 'Mission abschließen' : 'Nächstes Level';
      nextBtn.addEventListener('click', () => {
        levelIndex += 1;
        if (levelIndex >= levels.length) {
          api.finish(totalPoints, `White-Hat Mission: ${totalPoints}/20 Punkte in 5 Einsätzen`);
        } else {
          drawLevel();
        }
      });
      out.appendChild(document.createElement('br'));
      out.appendChild(nextBtn);
    });

    api.app.querySelector('#resetMission').addEventListener('click', drawLevel);
    api.app.querySelector('#menuBtn').addEventListener('click', api.menu);

    renderPreview();
    renderTools();
    renderNotes();
    renderHints();
    renderDiagnoses();
  }

  drawLevel();
}

function evaluateMissionResult(correctDiagnoses, selectedDiagnoses, levelPoints, revealedHints, totalHints) {
  const correctSet = new Set(correctDiagnoses);
  const selected = [...selectedDiagnoses];
  const wrong = selected.filter((item) => !correctSet.has(item)).length;
  const missed = [...correctSet].filter((item) => !selectedDiagnoses.has(item)).length;
  const exact = wrong === 0 && missed === 0;

  if (revealedHints >= totalHints) {
    return { exact, score: 1 };
  }

  return {
    exact,
    score: exact ? Math.max(1, levelPoints - revealedHints) : Math.max(1, levelPoints - wrong - missed - revealedHints),
  };
}

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}
