/* ==========================================================================
   Renders the site from course-data.js. You should not need to edit this
   file to update the course — edit assets/course-data.js instead.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- tiny helpers ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function fill(selector, text, root) {
    (root || document).querySelectorAll(selector).forEach(function (n) {
      n.textContent = text;
    });
  }

  function classMeetings(day) {
    return day.meetings.filter(function (m) { return !m.off; });
  }

  /* ---------- shared chrome: masthead, footer, title ---------- */

  function renderChrome() {
    fill("[data-course-number]", COURSE.number);
    fill("[data-course-title]", COURSE.title);
    fill("[data-course-subtitle]", COURSE.subtitle);
    fill("[data-institution]", COURSE.institution);
    fill("[data-semester]", COURSE.semester);
    fill("[data-instructor]", COURSE.instructor);
    fill("[data-blurb]", COURSE.blurb);
    fill("[data-office]", COURSE.office);
    fill("[data-office-hours]", COURSE.officeHours);
    fill("[data-location]", COURSE.location);

    document.querySelectorAll("[data-instructor-email]").forEach(function (a) {
      a.href = "mailto:" + COURSE.email;
      if (!a.textContent.trim()) a.textContent = COURSE.email;
    });

    document.querySelectorAll("[data-year]").forEach(function (n) {
      n.textContent = String(new Date().getFullYear());
    });

    // Badge every build except the live one, so staging and local previews
    // can't be mistaken for the site students are actually using.
    if (CFG.name !== "production") {
      var bar = document.querySelector(".masthead-inner");
      if (bar) bar.appendChild(el("span", "build-badge", CFG.name));
    }
  }

  /* ---------- home page: the two day buttons ---------- */

  function renderChooser() {
    var mount = document.querySelector("[data-chooser]");
    if (!mount) return;

    Object.keys(DAYS).forEach(function (key) {
      var day = DAYS[key];

      var card = el("a", "day-card " + day.accent);
      card.href = day.page;
      card.setAttribute("aria-label", day.name + " sections — view schedule");

      card.appendChild(el("p", "day-name", day.name));
      card.appendChild(el("p", "day-sub",
        day.sections.length + " sections · " +
        classMeetings(day).length + " class meetings"));

      var list = el("ul");
      day.sections.forEach(function (s) {
        var li = el("li");
        li.appendChild(el("span", "sect", s.label));
        li.appendChild(el("span", "time", s.time));
        list.appendChild(li);
      });
      card.appendChild(list);

      var go = el("span", "go");
      go.appendChild(el("span", null, "View the " + day.name + " schedule"));
      go.appendChild(el("span", "arrow", "→"));
      card.appendChild(go);

      mount.appendChild(card);
    });
  }

  /* ---------- home page: semester key dates ---------- */

  function renderKeyDates() {
    var mount = document.querySelector("[data-keydates]");
    if (!mount) return;

    COURSE.keyDates.forEach(function (d) {
      var li = el("li");
      li.appendChild(el("span", "kd-date", d.date));
      li.appendChild(el("span", "kd-label", d.label));
      mount.appendChild(li);
    });
  }

  /* ---------- schedule pages ---------- */

  function noteNode(text, icon) {
    var note = el("p", "m-note");
    note.appendChild(el("span", "m-note-icon", icon || "★"));
    note.appendChild(el("span", null, text));
    return note;
  }

  function offRow(meeting) {
    var row = el("details", "meeting off");
    row.open = true;

    var summary = el("summary");
    summary.appendChild(el("span", "m-date", meeting.date));
    summary.appendChild(el("span", "m-title", meeting.label));
    row.appendChild(summary);

    if (meeting.note) row.appendChild(noteNode(meeting.note, "✕"));
    return row;
  }

  // Build flags. If build.js is absent we fall back to a local build, so
  // opening the source folder directly always shows everything. Note the name
  // is "local", not "production": this fallback shows unpublished decks, so it
  // must badge itself rather than pass for the site students use.
  var CFG = (typeof BUILD !== "undefined") ? BUILD
    : { name: "local", showUnpublished: true, allowPptx: true };

  function slidesVisible(session) {
    if (!session.slides) return false;
    return CFG.showUnpublished || session.published === true;
  }

  function slidesLinks(session) {
    var wrap = el("p", "m-actions");

    // Primary: the PDF, opened in a new tab.
    var view = el("a", "m-slides");
    view.href = session.slides;
    view.target = "_blank";
    view.rel = "noopener";
    view.appendChild(el("span", "m-slides-icon", "▤"));
    view.appendChild(el("span", null, "Slides (PDF)"));
    view.setAttribute("aria-label",
      "Open slides for " + session.title + " as a PDF in a new tab");
    wrap.appendChild(view);

    // Production only: the editable PowerPoint file.
    if (CFG.allowPptx && session.slidesPptx) {
      var dl = el("a", "m-slides-alt");
      dl.href = session.slidesPptx;
      dl.setAttribute("download", "");
      dl.textContent = "Download .pptx";
      wrap.appendChild(dl);
    }

    // Production only: mark decks students cannot see yet.
    if (CFG.showUnpublished && session.published !== true) {
      wrap.appendChild(el("span", "m-unpub", "not in release"));
    }

    return wrap;
  }

  function meetingRow(meeting, session, num) {
    var row = el("details", "meeting " + session.kind);

    var summary = el("summary");
    summary.appendChild(el("span", "m-date", meeting.date));
    summary.appendChild(el("span", "m-num", num == null ? "·" : String(num)));

    var title = el("span", "m-title", meeting.title || session.title);
    if (session.kind === "guest") title.classList.add("is-tbd");
    summary.appendChild(title);
    summary.appendChild(el("span", "m-toggle"));
    row.appendChild(summary);

    if (meeting.note) row.appendChild(noteNode(meeting.note));

    var body = el("div", "m-body");
    if (session.theme) body.appendChild(el("p", "m-summary", session.theme));

    if (session.topics && session.topics.length) {
      var topics = el("ul", "m-topics");
      session.topics.forEach(function (t) { topics.appendChild(el("li", null, t)); });
      body.appendChild(topics);
    }

    if (slidesVisible(session)) {
      body.appendChild(slidesLinks(session));
    }

    row.appendChild(body);
    return row;
  }

  function renderSchedule() {
    var mount = document.querySelector("[data-schedule]");
    if (!mount) return;

    var day = DAYS[mount.getAttribute("data-schedule")];
    if (!day) return;

    // Page-level bits that depend on which day this is.
    document.body.classList.add("day-page", day.accent);
    fill("[data-day-name]", day.name);
    fill("[data-day-first]", day.firstDay);
    fill("[data-day-last]", day.lastDay);
    fill("[data-day-count]", String(classMeetings(day).length));

    var chips = document.querySelector("[data-sections]");
    if (chips) {
      day.sections.forEach(function (s) {
        var chip = el("span", "chip");
        chip.appendChild(el("span", "chip-label", s.label));
        chip.appendChild(el("span", "chip-time", s.time));
        chips.appendChild(chip);
      });
    }

    // Rows, grouped by unit. Only taught classes get a number; guest
    // lectures sit in the sequence without consuming one.
    var currentUnit = null;
    var num = 0;
    day.meetings.forEach(function (meeting) {
      if (meeting.off) {
        mount.appendChild(offRow(meeting));
        return;
      }
      var session = SESSIONS[meeting.session];
      if (!session) return;

      var unit = session.unit || (session.kind === "guest" ? "Guest lecture" : null);
      if (unit && unit !== currentUnit) {
        currentUnit = unit;
        mount.appendChild(el("p", "unit-head", currentUnit));
      }
      mount.appendChild(meetingRow(meeting, session,
        session.kind === "core" ? ++num : null));
    });
  }

  /* ---------- expand / collapse all + print ---------- */

  function wireControls() {
    var toggle = document.querySelector("[data-expand-all]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var rows = document.querySelectorAll(".meeting:not(.off)");
        var anyClosed = Array.prototype.some.call(rows, function (r) { return !r.open; });
        rows.forEach(function (r) { r.open = anyClosed; });
        toggle.textContent = anyClosed ? "Collapse all" : "Expand all";
      });
    }

    // Print the whole schedule, not just the open rows.
    var reopen = [];
    window.addEventListener("beforeprint", function () {
      reopen = [];
      document.querySelectorAll(".meeting").forEach(function (r) {
        if (!r.open) { reopen.push(r); r.open = true; }
      });
    });
    window.addEventListener("afterprint", function () {
      reopen.forEach(function (r) { r.open = false; });
      reopen = [];
    });
  }

  /* ---------- go ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    renderChooser();
    renderKeyDates();
    renderSchedule();
    wireControls();
  });
})();
