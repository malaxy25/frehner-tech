// Umfragen auf frehner.tech (z. B. /muesli/) – nimmt die Antworten entgegen (siehe public/umfrage.js).
// Generisch: jede Umfrage bekommt ein eigenes Tabellenblatt, jede Frage eine eigene Spalte.
// Neue oder umbenannte Fragen ergeben automatisch neue Spalten; am Script muss nichts geändert werden.
//
// Einrichten (einmal):
// 1. Neues Google Sheet → Erweiterungen → Apps Script → diese Datei einfügen.
// 2. Projekteinstellungen → Script-Eigenschaften:
//      NOTIFY = E-Mail-Adresse für die Benachrichtigung pro Antwort (optional)
// 3. Bereitstellen → Neue Bereitstellung → Web-App: «Ausführen als: Ich», «Zugriff: Jeder».
//    Die /exec-URL kommt in public/<umfrage>/index.html als «endpoint».
// Nach Änderungen am Script: Bereitstellen → Bereitstellungen verwalten → bearbeiten → neue Version (URL bleibt).

const FIXED = ["Zeit", "Name", "Ergebnis", "Punkte"];

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return answer("bad request");
  }
  // Honeypot: das Feld ist für Menschen unsichtbar, nur Bots füllen es aus
  if (!data || data.website) return answer("ok");
  const survey = String(data.survey || "").replace(/[^\w-]/g, "").slice(0, 40);
  const name = String(data.name || "").trim().slice(0, 60);
  const answers = data.answers && typeof data.answers === "object" ? data.answers : {};
  if (!survey || !name) return answer("bad request");

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = sheetFor(survey);
    const questions = Object.keys(answers).slice(0, 50);
    const header = headerWith(sheet, questions);
    const row = header.map((column) => {
      if (column === "Zeit") return new Date();
      if (column === "Name") return safe(name);
      if (column === "Ergebnis") return safe(data.result);
      if (column === "Punkte") return safe(data.scores);
      return column in answers ? safe(String(answers[column]).slice(0, 500)) : "";
    });
    sheet.appendRow(row);

    const notify = PropertiesService.getScriptProperties().getProperty("NOTIFY");
    if (notify) {
      const lines = questions.map((q) => "- " + q + ": " + answers[q]);
      MailApp.sendEmail(notify, "Umfrage " + survey + ": " + name + " → " + (data.result || "?"),
        name + " hat die Umfrage «" + survey + "» abgeschlossen.\n\nErgebnis: " + (data.result || "–") +
        "\nPunkte: " + (data.scores || "–") + "\n\n" + lines.join("\n") + "\n\n" +
        SpreadsheetApp.getActiveSpreadsheet().getUrl());
    }
  } finally {
    lock.releaseLock();
  }
  return answer("ok");
}

function sheetFor(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(FIXED);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Hängt Fragen, die noch keine Spalte haben, hinten an den Kopf an
function headerWith(sheet, questions) {
  const width = Math.max(sheet.getLastColumn(), 1);
  const header = sheet.getRange(1, 1, 1, width).getValues()[0].map(String);
  const missing = questions.filter((q) => header.indexOf(q) === -1);
  if (missing.length) {
    sheet.getRange(1, header.length + 1, 1, missing.length).setValues([missing]);
    return header.concat(missing);
  }
  return header;
}

// Ein Text, der mit = + - @ beginnt, würde im Sheet als Formel ausgeführt
function safe(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function answer(text) {
  return ContentService.createTextOutput(text);
}
