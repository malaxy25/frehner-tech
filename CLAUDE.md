# frehner.tech

## Zusammenarbeit
- Kurz und fachlich antworten, kein Smalltalk.
- Kritisch sein: Anforderungen hinterfragen, bessere Alternativen vorschlagen.
- Texte für die Website: kein ß (immer ss), kein Komma vor «und».

Persönliche Website von Andrea Frehner. Statisches HTML/CSS/JS ohne Build-Schritt, deployt als Render Static Site (Publish-Verzeichnis `.`). Sprache der Inhalte: Deutsch (Schweiz).

## Aufbau
- `index.html` – Startseite (Über mich, Projekte, Kontakt, Herkunft)
- `platzhalter/index.html` – Unterseite (URL `/platzhalter/`); neue Unterseiten genauso als `<name>/index.html`
- `style.css` – gemeinsame Styles aller Seiten (Farben als Variablen in `:root`)
- `site.js` – gemeinsames Script: Jahr im Footer, Navigation (Hamburger + Untermenü), Teilen-Button
- `manifest.webmanifest`, `*.png` – Icons, Wappen, Homescreen-Manifest

Die Navigation (`<nav class="nav">`) steht als identischer Block in jeder Seite. Bei Änderungen am Menü **alle Seiten** anpassen; auf der jeweiligen Seite den eigenen Link mit `aria-current="page"` markieren. Links auf Abschnitte der Startseite immer absolut (`/#projekte`), damit sie auch von Unterseiten funktionieren.

## Immer einhalten
- **Mobile first / responsive:** Jede Änderung muss auf dem Handy (ab 320px Breite) funktionieren – kein horizontales Scrollen, Tap-Ziele mind. 44px, Safe-Areas (`env(safe-area-inset-*)`) beachten, Menü klappt unter 720px zum Hamburger zusammen.
- **Teilbar (Link-Vorschau):** Jede Seite braucht im `<head>`: `<title>`, `meta description`, `link rel="canonical"` und Open-Graph-/Twitter-Tags (`og:title`, `og:description`, `og:url`, `og:image` als absolute URL, `og:site_name`, `og:locale`, `twitter:card`), damit Links in WhatsApp, Signal, iMessage, Teams, LinkedIn usw. eine schöne Vorschau zeigen. `og:image` klein halten (< 300 KB, sonst zeigt WhatsApp nichts an).
- **Teilen-Button:** Jede Seite hat den Teilen-Button in der Navigation (`site.js`: native Teilen-Funktion auf dem Handy, sonst Link kopieren).
- Keine externen Abhängigkeiten / Frameworks ohne Rückfrage.

## Versionierung
Version steht im Footer jeder Seite (`v1.x.y`) und in der Commit-Nachricht (`v1.5.0: kurze Beschreibung`). Bei jeder Änderung hochzählen – neue Funktion: Minor, Korrektur/Text: Patch – und auf allen Seiten gleich halten.

## Lokal ansehen
`python -m http.server 8000` im Projektordner, dann http://localhost:8000 (die absoluten Pfade wie `/style.css` brauchen einen Server, Doppelklick auf die Datei reicht nicht).
