// Inhalt der Umfrage /umfrage/ und der Karten (tools/karten/karten.html). Fragen, Antworten und Sprüche hier anpassen. Jede Antwort gibt Punkte für einen oder mehrere Geschmäcker;
// der Geschmack mit den meisten Punkten gewinnt (bei Gleichstand zufällig). Neue Fragen ergeben im Sheet neue Spalten.
window.UMFRAGE = {
  id: "muesli",
  endpoint: "https://script.google.com/macros/s/AKfycbzlAEStvdEmZLmok3qHpbK0iQ_cXnH1aC0mWstEjP4EnZEomnEXoGntAebslpaT86sF/exec",   // /exec-URL der Apps-Script-Web-App (tools/umfrage/apps-script.js)
  intro: "Wie heisst du?",
  showResult: false,   // Ergebnis erst an Weihnachten auf der Karte verraten
  thanks: "Deine Antworten sind gespeichert. Was dabei herauskommt, erfährst du bald 😉",
  // Karten: persönlicher Satz aus den Antworten, die am meisten zum Ergebnis beigetragen haben
  reason: "Verraten haben dich: «{a}» und «{b}».",
  results: {
    schoko: {
      name: "Schoko", emoji: "🍫", color: "#6b3a1e",
      lines: [
        "Du sagst, du frühstückst gesund. Wir haben dich durchschaut.",
        "Für dich ist Schokolade kein Dessert, sondern eine Lebenseinstellung.",
        "Dunkel, süss und ein kleines bisschen verführerisch – genau wie dein perfekter Morgen.",
      ],
    },
    apfel: {
      name: "Apfel-Zimt", emoji: "🍎", color: "#b3372b",
      lines: [
        "Du riechst nach Weihnachtsmarkt. Auch im Juli.",
        "Gemütlichkeit ist für dich kein Zustand, sondern ein Beruf.",
        "Ein Apfel am Tag hält den Doktor fern. Mit Zimt bleibt sogar der Montag weg.",
      ],
    },
    aprikose: {
      name: "Aprikose", emoji: "🍑", color: "#d9821a",
      lines: [
        "Du bist ein Sonnenschein auf zwei Beinen. Auch um 7 Uhr morgens.",
        "Bei dir ist immer Sommer, egal was das Thermometer sagt.",
        "Fruchtig, frisch und ein bisschen wild – wir haben es geahnt.",
      ],
    },
  },
  questions: [
    { text: "Wie startest du am liebsten in den Tag?", answers: [
      { text: "Starker Kaffee und etwas Süsses", points: { schoko: 2 } },
      { text: "Gemütlich mit Tee und Zeitung", points: { apfel: 2 } },
      { text: "Fenster auf, Sonne rein", points: { aprikose: 2 } },
      { text: "Snooze-Taste. Dreimal.", points: { schoko: 1, apfel: 1 } },
    ] },
    { text: "Welches Dessert nimmst du?", answers: [
      { text: "Mousse au Chocolat", points: { schoko: 2 } },
      { text: "Warmer Apfelstrudel mit Vanillesauce", points: { apfel: 2 } },
      { text: "Aprikosenwähe", points: { aprikose: 2 } },
    ] },
    { text: "Deine Traumferien?", answers: [
      { text: "Städtetrip mit Cafés und Confiserien", points: { schoko: 2 } },
      { text: "Berghütte mit Kamin und Schnee", points: { apfel: 2 } },
      { text: "Mittelmeer, Markt und Sonne", points: { aprikose: 2 } },
    ] },
    { text: "Deine Lieblingsjahreszeit?", answers: [
      { text: "Winter", points: { schoko: 2 } },
      { text: "Herbst", points: { apfel: 2 } },
      { text: "Sommer", points: { aprikose: 2 } },
      { text: "Frühling", points: { aprikose: 1, apfel: 1 } },
    ] },
    { text: "Wie süss darf es sein?", answers: [
      { text: "So süss wie möglich", points: { schoko: 2 } },
      { text: "Süss, aber mit Würze", points: { apfel: 2 } },
      { text: "Lieber fruchtig-frisch", points: { aprikose: 2 } },
    ] },
    { text: "Was ist sicher in deinem Vorratsschrank?", answers: [
      { text: "Eine angefangene Tafel Schoggi (mindestens)", points: { schoko: 2 } },
      { text: "Zimt, Nelken und Lebkuchengewürz", points: { apfel: 2 } },
      { text: "Dörrfrüchte", points: { aprikose: 2 } },
    ] },
    { text: "Dein perfekter Sonntag?", answers: [
      { text: "Sofa, Decke, Serie", points: { schoko: 2 } },
      { text: "Waldspaziergang, danach Tee", points: { apfel: 2 } },
      { text: "Velotour mit Picknick", points: { aprikose: 2 } },
    ] },
    { text: "Welche Farbe passt zu dir?", answers: [
      { text: "Dunkelbraun und Gold", points: { schoko: 2 } },
      { text: "Rot und Kupfer", points: { apfel: 2 } },
      { text: "Orange und Sonnengelb", points: { aprikose: 2 } },
    ] },
    { text: "Was trinkst du am liebsten?", answers: [
      { text: "Heisse Schokolade", points: { schoko: 2 } },
      { text: "Glühwein oder Punsch", points: { apfel: 2 } },
      { text: "Frisch gepresster Saft", points: { aprikose: 2 } },
    ] },
  ],
};
