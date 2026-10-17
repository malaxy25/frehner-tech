# frehner.tech

Persönliche Website von Andrea Frehner. Statisches HTML/CSS/JS ohne Build-Schritt, deployt als Render Static Site mit Publish-Verzeichnis `public`. Sprache der Inhalte: Deutsch (Schweiz).

## Aufbau
- `public/` – alles, was online geht. Nur hier liegen Website-Dateien.
  - `index.html` – Startseite (Über mich, Projekte, Kontakt, Herkunft)
  - `platzhalter/index.html` – Unterseite (URL `/platzhalter/`); neue Unterseiten genauso als `public/<name>/index.html`
  - `style.css` – gemeinsame Styles aller Seiten (Farben als Variablen in `:root`)
  - `site.js` – gemeinsames Script: Jahr im Footer, Navigation (Hamburger + Untermenü)
  - `manifest.webmanifest`, `*.png` – Icons, Wappen, Homescreen-Manifest
  - `muesli/index.html` – Umfrage für Freunde (nicht im Menü, nur per Link, `noindex`)
  - `umfrage.js` – generischer Ablauf für Umfragen (Name → Fragen → Ergebnis → Versand)
- `tools/umfrage/apps-script.js` – Google Apps Script: speichert Antworten im Google Sheet, schickt E-Mail. Nicht öffentlich.
- Im Root nur Projektdateien (`CLAUDE.md`, `README.md`, `tools/`), die nicht öffentlich sein sollen.

## Umfragen
- Inhalt (Fragen, Antworten, Punkte, Ergebnisse, Sprüche) steht nur im `window.UMFRAGE`-Block der Seite. `umfrage.js` und das Apps Script bleiben bei Änderungen unberührt.
- Nur Auswahl-Antworten, kein Freitext. Jede Antwort vergibt Punkte an Ergebnis-Schlüssel; Punkte pro Ergebnis ausgeglichen halten.
- Sheet: ein Tabellenblatt pro Umfrage-`id`, eine Spalte pro Fragetext. Geänderter Fragetext = neue Spalte.
- Umfrageseiten haben kein Menü; der Satz zum Datenschutz (Google-Tabelle) bleibt auf der Seite.

Die Navigation (`<nav class="nav">`) steht als identischer Block in jeder Seite. Bei Änderungen am Menü **alle Seiten** anpassen; auf der jeweiligen Seite den eigenen Link mit `aria-current="page"` markieren. Links auf Abschnitte der Startseite immer absolut (`/#projekte`), damit sie auch von Unterseiten funktionieren.

## Immer einhalten
- **Mobile first / responsive:** Jede Änderung muss auf dem Handy (ab 320px Breite) funktionieren – kein horizontales Scrollen, Tap-Ziele mind. 44px, Safe-Areas (`env(safe-area-inset-*)`) beachten, Menü klappt unter 720px zum Hamburger zusammen.
- **Teilbar (Link-Vorschau):** Jede Seite braucht im `<head>`: `<title>`, `meta description`, `link rel="canonical"` und Open-Graph-/Twitter-Tags (`og:title`, `og:description`, `og:url`, `og:image` als absolute URL, `og:site_name`, `og:locale`, `twitter:card`), damit Links in WhatsApp, Signal, iMessage, Teams, LinkedIn usw. eine schöne Vorschau zeigen. `og:image` klein halten (< 300 KB, sonst zeigt WhatsApp nichts an).
- Keine externen Abhängigkeiten / Frameworks ohne Rückfrage.

## Versionierung
Version steht im Footer jeder Seite (`v1.x.y`) und in der Commit-Nachricht (`v1.6.0: kurze Beschreibung`). Bei jeder Änderung hochzählen – neue Funktion: Minor, Korrektur/Text: Patch – und auf allen Seiten gleich halten.

## Lokal ansehen
`python -m http.server 8000 -d public`, dann http://localhost:8000 (die absoluten Pfade wie `/style.css` brauchen einen Server, Doppelklick auf die Datei reicht nicht).
