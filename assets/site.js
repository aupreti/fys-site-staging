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
    fill("[data-office-hours]", COURSE.officeHours);
    fill("[data-location]", COURSE.location);

    document.querySelectorAll("[data-instructor-email]").forEach(function (a) {
      a.href = "mailto:" + COURSE.email;
      if (!a.textContent.trim()) a.textContent = COURSE.email;
    });

    // The syllabus is a Google Doc. Until COURSE.syllabusUrl is set, drop the
    // links entirely rather than leave them pointing nowhere.
    document.querySelectorAll("[data-syllabus-link]").forEach(function (a) {
      if (COURSE.syllabusUrl) {
        a.href = COURSE.syllabusUrl;
        a.target = "_blank";
        a.rel = "noopener";
      } else if (a.parentNode) {
        a.parentNode.removeChild(a);
      }
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
    var row = el("div", "meeting off");

    var head = el("div", "m-head");
    head.appendChild(el("span", "m-date", meeting.date));
    head.appendChild(el("span", "m-title", meeting.label));
    row.appendChild(head);

    if (meeting.note) row.appendChild(noteNode(meeting.note, "✕"));
    return row;
  }

  // Build flags. If build.js is absent we fall back to a local build, so
  // opening the source folder directly always shows everything. Note the name
  // is "local", not "production": this fallback shows unpublished decks, so it
  // must badge itself rather than pass for the site students use.
  var CFG = (typeof BUILD !== "undefined") ? BUILD
    : { name: "local", showUnpublished: true };

  function slidesVisible(session) {
    if (!session.slidesUrl) return false;
    return CFG.showUnpublished || session.published === true;
  }

  function slidesLinks(session) {
    var wrap = el("p", "m-actions");

    // The deck lives in Google Slides; nothing is hosted here.
    var view = el("a", "m-slides");
    view.href = session.slidesUrl;
    view.target = "_blank";
    view.rel = "noopener";
    view.appendChild(el("span", "m-slides-icon", "▤"));
    view.appendChild(el("span", null, "Slides"));
    view.setAttribute("aria-label",
      "Open slides for " + session.title + " in a new tab");
    wrap.appendChild(view);

    // Local view only: mark decks students cannot see yet.
    if (CFG.showUnpublished && session.published !== true) {
      wrap.appendChild(el("span", "m-unpub", "not in release"));
    }

    return wrap;
  }

  function meetingRow(meeting, session, num) {
    var row = el("div", "meeting " + session.kind);

    var head = el("div", "m-head");
    head.appendChild(el("span", "m-date", meeting.date));
    head.appendChild(el("span", "m-num", num == null ? "·" : String(num)));

    // An unrevealed week has had its title stripped out by the build, so there
    // is nothing to show but a placeholder. A guest slot reads the same way
    // until the speaker is confirmed; confirming one means giving it its own
    // published session, so `published` is what tells an announced guest from a
    // placeholder — kind alone would grey out both.
    var titleText = meeting.title || session.title;
    var title = el("span", "m-title", titleText || "TBD");
    if (!titleText || (session.kind === "guest" && session.published !== true)) {
      title.classList.add("is-tbd");
    }
    head.appendChild(title);
    row.appendChild(head);

    if (meeting.note) row.appendChild(noteNode(meeting.note));

    var body = el("div", "m-body");
    if (session.theme) body.appendChild(el("p", "m-summary", session.theme));

    if (slidesVisible(session)) {
      body.appendChild(slidesLinks(session));
    }

    // Rows are always open, so an empty body is not hidden any more — it would
    // show as a bare bordered strip. A withheld week has neither theme nor
    // slides, so only attach the body when there is something in it.
    if (body.childNodes.length) row.appendChild(body);
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

    var chips = document.querySelector("[data-sections]");
    if (chips) {
      day.sections.forEach(function (s) {
        var chip = el("span", "chip");
        chip.appendChild(el("span", "chip-label", s.label));
        chip.appendChild(el("span", "chip-time", s.time));
        chips.appendChild(chip);
      });
    }

    // One flat list of rows. The schedule used to be broken into labelled
    // groups by `unit` ("Foundations", "Representation") with "Guest lecture"
    // standing in where a session had none. Those headings are deliberately
    // not rendered: the dates and titles carry the schedule on their own.
    // Only taught classes get a number; guest lectures sit in the sequence
    // without consuming one.
    var num = 0;
    day.meetings.forEach(function (meeting) {
      if (meeting.off) {
        mount.appendChild(offRow(meeting));
        return;
      }
      var session = SESSIONS[meeting.session];
      if (!session) return;

      mount.appendChild(meetingRow(meeting, session,
        session.kind === "core" ? ++num : null));
    });
  }

  /* ---------- print ---------- */

  // Rows used to be <details> that had to be forced open before printing and
  // closed again afterwards. They are plain always-visible blocks now, so the
  // whole schedule prints as-is. There is no print button any more either —
  // the browser's own print command is all that is needed, and nothing here
  // has to be wired up for it.

  /* ---------- go ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    renderChooser();
    renderKeyDates();
    renderSchedule();
  });
})();
