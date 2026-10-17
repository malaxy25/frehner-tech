// Generic quiz: renders window.UMFRAGE (see public/umfrage/index.html), scores the answers,
// shows the result and sends everything to the Apps Script (tools/umfrage/apps-script.js).
// Config shape:
//   { id, endpoint, results: { key: { name, emoji, lines: [..] } },
//     questions: [ { text, answers: [ { text, points: { key: n } } ] } ] }
(function () {
  const cfg = window.UMFRAGE;
  const app = document.getElementById("umfrage");
  const storeKey = "umfrage-" + cfg.id;
  let name = "";
  let step = 0;
  let picks = [];
  let order = [];

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };
  const shuffle = (list) => {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const load = () => { try { return JSON.parse(localStorage.getItem(storeKey)); } catch (_) { return null; } };
  const save = (v) => { try { localStorage.setItem(storeKey, JSON.stringify(v)); } catch (_) {} };
  // the page header (title, tagline) only on the start screen, so questions fit on a phone screen
  const show = (...nodes) => {
    document.body.classList.toggle("quiz-started", !nodes[0].matches("form"));
    app.replaceChildren(...nodes);
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  };

  function intro() {
    const form = el("form", "quiz-card");
    form.append(el("h2", "quiz-q", cfg.intro || "Wie heisst du?"));
    const label = el("label", "quiz-label", "Dein Name");
    label.htmlFor = "quiz-name";
    const input = el("input", "quiz-input");
    Object.assign(input, { id: "quiz-name", name: "name", required: true, maxLength: 60, autocomplete: "given-name", value: name });
    const trap = el("input", "quiz-trap");
    Object.assign(trap, { name: "website", tabIndex: -1, autocomplete: "off" });
    trap.setAttribute("aria-hidden", "true");
    const go = el("button", "quiz-btn", "Los geht's");
    go.type = "submit";
    form.append(label, input, trap, go);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (trap.value) return;
      name = input.value.trim();
      if (!name) return input.focus();
      step = 0;
      picks = [];
      order = cfg.questions.map((q) => shuffle(q.answers.map((_, i) => i)));
      question();
    });
    show(form);
    input.focus();
  }

  function question() {
    const q = cfg.questions[step];
    const card = el("div", "quiz-card");
    const progress = el("div", "quiz-progress");
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", String(cfg.questions.length));
    progress.setAttribute("aria-valuenow", String(step + 1));
    const bar = el("span");
    bar.style.width = ((step + 1) / cfg.questions.length) * 100 + "%";
    progress.append(bar);
    card.append(el("div", "quiz-step", "Frage " + (step + 1) + " von " + cfg.questions.length), progress,
      el("h2", "quiz-q", q.text));
    const list = el("div", "quiz-answers");
    order[step].forEach((i) => {
      const b = el("button", "quiz-answer", q.answers[i].text);
      b.type = "button";
      if (picks[step] === i) b.classList.add("picked");
      b.addEventListener("click", () => {
        picks[step] = i;
        step + 1 < cfg.questions.length ? (step++, question()) : finish();
      });
      list.append(b);
    });
    card.append(list);
    const back = el("button", "quiz-back", "← Zurück");
    back.type = "button";
    back.addEventListener("click", () => (step > 0 ? (step--, question()) : intro()));
    card.append(back);
    show(card);
  }

  function finish() {
    const scores = {};
    Object.keys(cfg.results).forEach((k) => (scores[k] = 0));
    cfg.questions.forEach((q, n) => {
      const pts = q.answers[picks[n]].points || {};
      Object.keys(pts).forEach((k) => (scores[k] = (scores[k] || 0) + pts[k]));
    });
    const best = Math.max(...Object.values(scores));
    const key = shuffle(Object.keys(scores).filter((k) => scores[k] === best))[0];   // tie: random
    const r = cfg.results[key];
    const line = r.lines[Math.floor(Math.random() * r.lines.length)];
    const answers = {};
    cfg.questions.forEach((q, n) => (answers[q.text] = q.answers[picks[n]].text));
    const payload = {
      survey: cfg.id, name, result: r.name, line,
      scores: Object.keys(scores).map((k) => cfg.results[k].name + " " + scores[k]).join(", "),
      answers,
    };
    const state = { name, key, line, sent: false, payload };
    save(state);
    result(state, payload);
  }

  function result(state, payload) {
    const r = cfg.results[state.key];
    const card = el("div", "quiz-card quiz-result");
    card.append(el("div", "quiz-step", state.name + ", du bist …"), el("div", "quiz-emoji", r.emoji),
      el("h2", "quiz-flavor", r.name), el("p", "quiz-line", state.line));
    const status = el("p", "quiz-status");
    status.setAttribute("role", "status");
    card.append(status);
    if (payload) send(payload, state, status);
    const again = el("button", "quiz-back", "Nochmals ausfüllen");
    again.type = "button";
    again.addEventListener("click", intro);
    card.append(again);
    show(card);
  }

  async function send(payload, state, status) {
    status.textContent = "Wird gespeichert …";
    status.className = "quiz-status";
    try {
      if (!cfg.endpoint) {
        if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) throw new Error("no endpoint");
        console.info("[umfrage] no endpoint configured, not sent:", payload);   // local testing only
      } else {
        // text/plain keeps it a simple request (no CORS preflight, which Apps Script cannot answer)
        const res = await fetch(cfg.endpoint, { method: "POST", body: JSON.stringify(payload) });
        if (!res.ok || (await res.text()).trim() !== "ok") throw new Error("not ok");
      }
      status.textContent = "Gespeichert. Danke fürs Mitmachen!";
      save(Object.assign(state, { sent: true, payload: null }));
    } catch (_) {
      status.textContent = "Speichern hat nicht geklappt. ";
      status.className = "quiz-status error";
      const retry = el("button", "quiz-link", "Nochmals versuchen");
      retry.type = "button";
      retry.addEventListener("click", () => send(payload, state, status));
      status.append(retry);
    }
  }

  const done = load();
  if (done && done.key && cfg.results[done.key]) {
    name = done.name;
    result(done, done.sent ? null : done.payload);   // retry a send that failed last time
  } else {
    intro();
  }
})();
