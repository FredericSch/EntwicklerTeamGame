# EntwicklerTeamGame

Mobile-first WebApp mit kurzen Minigames (Deutsch), die 12–15-Jährigen ohne Vorkenntnisse spielerisch zeigt, wie sich Software-Engineering anfühlt.

## Inhalte (ca. 20 Minuten gesamt)

- **Bug Hunt** – Befehle korrigieren und Roboter zum Ziel führen
- 🔐 **Passwort-Rätsel** – Logikrätsel mit 5 Häusern/Kategorien
- 🎨 **Design-Duell** – UX-Entscheidungen mit 2 Optionen vergleichen
- 🧪 **Test-Labor** – 5 Fehler in einer Mock-Webseite finden
- 🕵️ **Datenpfad-Detektiv** – einfache, nicht-technische Alternative zur Hacker-Idee

Alle Spiele sind bewusst kurz (je ~3–4 Minuten), leicht verständlich und unabhängig voneinander. Wenn ein Spiel fehlschlägt, bleiben die anderen spielbar.

## Lokal starten

Da es eine statische WebApp ist, reicht ein einfacher Webserver:

```bash
cd /home/runner/work/EntwicklerTeamGame/EntwicklerTeamGame
python3 -m http.server 4173
```

Dann im Browser öffnen: `http://localhost:4173`

## GitHub Hosting + QR Code

1. Repository auf GitHub Pages veröffentlichen (Branch `main`, Root).
2. Die veröffentlichte URL öffnen.
3. Im Startmenü den Button **„QR-Code laden“** drücken, um den Code für die aktuelle URL zu erzeugen.
4. Schüler:innen scannen den Code und können direkt spielen (ohne Installation).

## Erweiterbarkeit

Neue Minigames lassen sich in `app.js` über den `games`-Array ergänzen (`id`, `title`, `maxScore`, `render`).
