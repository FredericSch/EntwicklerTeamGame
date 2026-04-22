# DevQuest Style Guide

## Purpose

This guide keeps the project consistent as more minigames or classroom-focused polish are added.

## Project Structure

- `app.js` owns shared state, score handling, pacing metadata, and the game launcher.
- `src/games/*.js` contains one minigame per file.
- `src/utils.js` holds reusable helpers that are not tied to one specific game.
- `styles.css` contains the shared design tokens first, then common surfaces, then game-specific styles.

## JavaScript Conventions

- Export one main `render...` function per game module.
- Keep game state inside the render function or small helpers close to it.
- Use the shell API contract consistently:
  - `mount(html)` to replace the screen
  - `menu()` to return to the start screen
  - `finish(score, detail)` to report base points and a summary string
- Let `app.js` handle shared concerns such as total scoring, time bonuses, and menu progress.
- Prefer small, readable helper functions over deeply nested event handlers.
- Escape dynamic HTML with `safeHtml` unless the string is fully controlled markup.

## Commenting Rules

- Add a short module header when the file owns a distinct gameplay system.
- Add inline comments only for logic that would be hard to infer quickly.
- Avoid comments that restate obvious assignments or DOM lookups.

## CSS Conventions

- Reuse the top-level tokens in `:root` before introducing new colors.
- Keep shell styles readable and high-contrast even when a mockup intentionally demonstrates a bad design choice.
- Use descriptive class names tied to the feature surface, for example `test-`, `mission-`, or `qa-` prefixes.
- Preserve large tap targets on mobile. Interactive elements should generally stay around 44px height or larger.
- Put shared interaction feedback in reusable classes such as `choice-correct` and `choice-wrong`.

## UX Rules For New Games

- Favor short, visual interactions over text-heavy explanation.
- Keep each game at five short levels unless the product scope changes.
- Teach through interaction first; explanation text should confirm what the player just discovered.
- Make failures informative so weaker players still learn and still earn points.

## Documentation Checklist

When adding or changing a minigame:

1. Update `README.md` if the active game list or runtime expectations change.
2. Document any new conventions here if they affect future maintenance.