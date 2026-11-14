# Orbit Health Check

A browser-based health self-assessment dashboard for astronauts, built for the **NASA Space Apps Challenge 2026** challenge **"Health Monitoring Software"**.

> This tool is for demonstration and is not a medical diagnosis. All sample data is synthetic. Numeric thresholds are illustrative general reference ranges chosen by our team, not official clinical or NASA thresholds.

## What it does

An astronaut far from a doctor enters a few health indicators and instantly sees what they mean: a green / yellow / red status, why it was given, how spaceflight can affect that indicator, when to alert the crew or ground flight surgeons, and which simple general actions can help.

Indicators: heart rate (bpm), systolic blood pressure (mmHg), blood sugar (mg/dL), daily sleep (hours), mood (1-5 self-rating).

## How it addresses the challenge

| Challenge question | Where the tool answers it |
| --- | --- |
| Which measurements can be performed in space? | "How it can be measured in space" for every indicator |
| Why is the check needed? | "Why it matters in space" |
| How do spaceflight hazards affect it? | Hazard tag + "How spaceflight hazards can affect it" |
| When should the crew or ground flight surgeons be alerted? | "When to alert..." text, trend alerts, printable summary |
| What actions can prevent a critical condition? | "Simple general actions that can help" |

## NASA resources and hazards

The knowledge basis is the **NASA Human Research Program (HRP)**: the five hazards of human spaceflight (space radiation, isolation and confinement, distance from Earth, gravity fields, hostile closed environments), summarized in our own words.
Further reading: <https://www.nasa.gov/hrp/hazards> and <https://humanresearchroadmap.nasa.gov/>.

Our own work: the sample data is synthetic, the indicator ranges are illustrative, and the hazard tags are a simplified mapping. No NASA dataset is used for the numbers, and no NASA logos or branding are used.

## Features

- Input form with validation and unit labels; status per indicator and overall (color + icon + text)
- "Why this result?" panel showing the illustrative range used
- Hazard tags (NASA HRP hazards) on every indicator
- Time-series chart (inline SVG, no libraries) with a table alternative
- Clickable, keyboard-usable body figure (brain, heart, bones, immune/overall)
- Environment selector (ISS / Moon base / Mars transit) with approximate communication delay and "act first, message the ground team in parallel" advice for long delays
- Trend alerts (simple rule-based "watch this trend" notices)
- Demo mode with three synthetic scenarios
- Saved in the browser (localStorage) with a reset button
- CSV export and a printable one-page summary
- In-page measurement reminders, daily check-in streak and badges
- Accessibility: keyboard navigation, visible focus, ARIA labels, never color alone
- Optional offline support through a tiny service worker (http/https only)

## Run locally

Open `index.html` in a browser. No install, no build step, no internet needed.

## Deploy on Vercel

1. Push the repository to GitHub (public).
2. In Vercel choose **Add New > Project** and import the repository.
3. Keep the defaults: framework preset **Other**, no build command, no output directory. It is a static site.
4. Use the production URL as the project link.

## Project structure

```
index.html
README.md
sw.js                    optional offline cache
css/        base.css, layout.css, components.css
js/
  core/     namespace.js, state.js, storage.js, evaluate.js, trends.js
  data/     indicators.js, hazards.js, environments.js, sample-history.js, scenarios.js
  ui/       form, status-cards, explanations, chart, body-figure, environment,
            gamification, reminders, export-summary, demo-mode, a11y
  main.js
```

Plain HTML, CSS and vanilla JavaScript with classic script tags and one global namespace (`window.SpaceHealth`). No frameworks, no external libraries, no backend, no API keys.

## Limits

Not a medical device and not a diagnosis. Ranges are illustrative, guidance is general, and the tool tracks only five indicators (blood pressure uses the systolic value only).

## Use of AI

AI tools (Claude by Anthropic) were used to help write the code and draft text, including this README. The team reviewed and tested the result. No AI-generated images, video or audio are used; all graphics are hand-written SVG and CSS.

## Update: Hazard Shields and Image lab
- **Hazard Shields** (js/ui/shields.js): one 0-100 shield per NASA HRP hazard, filled by daily tasks; XP, ranks (Cadet to Commander), environment missions, mini quiz, and a clearly labeled 7-day demo simulation.
- **Image lab: cell counter** (js/ui/cell-counter.js): Otsu threshold + connected components, pure JS/canvas, educational only. Put a small NASA OSDR image at `img/osdr-sample.jpg` and set `SAMPLE_CREDIT` in the file (study name/accession). Without it, a synthetic image is used and labeled.
