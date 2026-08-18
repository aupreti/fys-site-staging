/* ==========================================================================
   COURSE DATA — this is the only file you need to edit for normal updates.
   Everything on the site (home page, Monday page, Wednesday page) is
   generated from the values below.

   Three things live here:
     1. COURSE   — title, number, instructor, semester, office hours.
     2. SESSIONS — the class sessions, keyed by id. SHARED by both days:
                   edit a topic once and both schedules update.
     3. DAYS     — the calendar for each day. This is where Monday and
                   Wednesday differ (holidays, recess, guest lectures).

   NOTE ON GROUP ACTIVITIES: by design they are NOT on this website. Each
   one lives only in that class's .pptx deck, so students meet it cold.

   Dates come from the UMass Amherst Fall 2026 academic calendar:
   https://www.umass.edu/registrar/academic-calendar
   ========================================================================== */

const COURSE = {
  number: "FYS 191MCS26",
  title: "Bits, Bytes, and Modern Computing Systems",
  subtitle: "First-Year Seminar",
  institution: "University of Massachusetts Amherst",
  semester: "Fall 2026",
  instructor: "Angela Upreti",
  email: "aupreti@umass.edu",
  office: "TBD",
  officeHours: "TBD — by appointment",
  location: "TBD",

  // Short pitch shown on the home page.
  blurb:
    "Everything a computer does — every photo, song, message, and model — is " +
    "built out of nothing but ones and zeros. This seminar takes that claim " +
    "apart and puts it back together, from a single bit up to the machine in " +
    "your pocket.",

  // Semester-wide dates shown on the home page. Add or remove freely.
  keyDates: [
    { date: "Tue, Sep 8",   label: "First day of classes" },
    { date: "Mon, Sep 14",  label: "Last day to add/drop with no record" },
    { date: "Wed, Nov 4",   label: "Last day to drop with a “W”" },
    { date: "Tue, Dec 15",  label: "Last day of classes" },
    { date: "Wed, Dec 16",  label: "Reading day" },
    { date: "Dec 17–23",    label: "Final examination period" }
  ]
};

/* --------------------------------------------------------------------------
   SESSIONS — keyed by id, shared by all four sections.

     kind      "core" (a taught class), "guest", or "wrap"
     title     the topic students see
     theme     one line on what the class is about
     topics    short chips listed under the topic
     slides    path to the deck's PDF, or "" for none yet
     published PER DECK. Controls the RELEASE build only:
                 true  → the PDF ships and the link appears
                 false → the PDF is not copied and no link appears
               The production build always shows every deck regardless.

   Flip one deck's `published` to true when you're ready for students to
   have it, then re-run tools/build_site.py.

   Add a session by adding a key here, then referencing that key from the
   `meetings` list of each day below.
   -------------------------------------------------------------------------- */

const SESSIONS = {

  c1: {
    kind: "core",
    unit: "Foundations",
    title: "Two Symbols, Everything Else",
    theme:
      "Where computers came from, why they settled on just 0 and 1, and the " +
      "four logic gates that turn two symbols into everything else.",
    topics: ["Evolution of computers", "Conveying information with 0s and 1s",
             "AND · OR · NOT · XOR", "About me + icebreakers"],
    slides: "slides/01-origins-and-logic.pdf",
    slidesPptx: "",
    published: true
  },

  c2: {
    kind: "core",
    unit: "Foundations",
    title: "Where the Bits Actually Live",
    theme:
      "Memory as a numbered street of bytes, the enormous cost of distance, " +
      "and the argument about which end of a number goes first.",
    topics: ["Bits and bytes in memory", "Latency and the memory hierarchy",
             "Little endian vs. big endian", "How an SSD works"],
    slides: "",
    slidesPptx: "",
    published: false
  },

  c3: {
    kind: "core",
    unit: "Representation",
    title: "Counting With Two Fingers",
    theme:
      "Representing numbers with bits and bytes — students invent the binary " +
      "number system before it gets defined for them.",
    topics: ["Place value in any base", "Binary and hexadecimal",
             "Why 255 keeps appearing", "Overflow"],
    slides: "",
    slidesPptx: "",
    published: false
  },

  c4: {
    kind: "core",
    unit: "Representation",
    title: "How “a” Became a Number",
    theme:
      "Representing text: the arbitrary choice at the heart of ASCII, the " +
      "global mess that followed, and how Unicode cleaned it up.",
    topics: ["ASCII", "Mojibake", "Unicode and UTF-8", "Why emoji break"],
    slides: "",
    slidesPptx: "",
    published: false
  },

  c5: {
    kind: "core",
    unit: "Representation",
    title: "Pictures Are Just Grids",
    theme:
      "Representing images: pixels, colour as three numbers, and the " +
      "arithmetic that shows why an uncompressed photo is absurdly large.",
    topics: ["Bitmaps and raster scanning", "RGB and hex colour",
             "Resolution as sampling", "Why files get huge"],
    slides: "",
    slidesPptx: "",
    published: false
  },

  c6: {
    kind: "core",
    unit: "Representation",
    title: "Making It Smaller",
    theme:
      "Compression: finding structure and exploiting it, the hard limit on " +
      "how far that goes, and what lossy formats quietly throw away.",
    topics: ["Run-length and dictionary coding", "Huffman and frequency",
             "Lossless vs. lossy", "Generation loss"],
    slides: "",
    slidesPptx: "",
    published: false
  },

  c7: {
    kind: "core",
    unit: "Systems",
    title: "Who Is Allowed to Read That?",
    theme:
      "The operating system as referee, and the nine permission bits that " +
      "decide who may touch which file.",
    topics: ["The OS as a layer", "Processes and abstraction",
             "Unix permission bits", "Phone app permissions"],
    slides: "",
    slidesPptx: "",
    published: false
  },

  c8: {
    kind: "core",
    unit: "Systems",
    title: "Bits That Leave the Building",
    theme:
      "Networking: addressing five billion machines in 32 bits, splitting " +
      "messages into packets, and measuring the speed of light from a laptop.",
    topics: ["IP addresses as four bytes", "Packet switching", "DNS",
             "Latency across the world"],
    slides: "",
    slidesPptx: "",
    published: false
  },

  guest: {
    kind: "guest",
    title: "Guest lecture",
    theme: "Speaker and topic to be announced.",
    topics: [],
    slides: "", slidesPptx: "", published: false
  },

  wrap: {
    kind: "wrap",
    unit: "Closing",
    title: "Wrap-Up and Student Presentations",
    theme:
      "Students present their projects, and we trace the whole path once " +
      "more — from a single bit up to the machine in your pocket.",
    topics: ["Final presentations", "Where to go next"],
    slides: "", slidesPptx: "", published: false
  }
};

/* --------------------------------------------------------------------------
   DAYS — the per-day calendar. This is what differs between sections.

   Each entry in `meetings` is either a class meeting:

     { session: "c3", date: "Mon, Sep 28" }

   a day off:

     { off: true, date: "Mon, Oct 12", label: "…", note: "…" }

   Any meeting also takes an optional `title` (overrides the session title,
   useful for naming a guest speaker) and an optional `note` that shows as a
   highlighted callout on that row.
   -------------------------------------------------------------------------- */

const DAYS = {
  monday: {
    key: "monday",
    name: "Monday",
    short: "Mon",
    page: "monday.html",
    accent: "mon",
    sections: [
      { label: "Section A", time: "9:05 – 9:55 am" },
      { label: "Section B", time: "12:20 – 1:10 pm" }
    ],
    firstDay: "Monday, September 14, 2026",
    lastDay: "Monday, December 14, 2026",
    meetings: [
      { session: "c1",    date: "Mon, Sep 14" },
      { session: "c2",    date: "Mon, Sep 21" },
      { session: "c3",    date: "Mon, Sep 28" },
      { session: "c4",    date: "Mon, Oct 5" },
      { off: true,        date: "Mon, Oct 12",
        label: "Indigenous Peoples' Day — no classes",
        note: "University holiday. We do not meet." },
      { session: "guest", date: "Mon, Oct 19",
        note: "Instructor away this week — guest lecture." },
      { session: "c5",    date: "Mon, Oct 26" },
      { session: "c6",    date: "Mon, Nov 2" },
      { session: "c7",    date: "Mon, Nov 9" },
      { session: "c8",    date: "Mon, Nov 16" },
      { session: "guest", date: "Mon, Nov 23",
        note: "Last class before Thanksgiving recess. Monday classes meet as usual." },
      { session: "guest", date: "Mon, Nov 30" },
      { session: "guest", date: "Mon, Dec 7" },
      { session: "wrap",  date: "Mon, Dec 14",
        note: "Last Monday meeting of the semester." }
    ]
  },

  wednesday: {
    key: "wednesday",
    name: "Wednesday",
    short: "Wed",
    page: "wednesday.html",
    accent: "wed",
    sections: [
      { label: "Section C", time: "9:05 – 9:55 am" },
      { label: "Section D", time: "10:10 – 11:00 am" }
    ],
    firstDay: "Wednesday, September 9, 2026",
    lastDay: "Wednesday, December 9, 2026",
    meetings: [
      { session: "c1",    date: "Wed, Sep 9" },
      { session: "c2",    date: "Wed, Sep 16" },
      { session: "c3",    date: "Wed, Sep 23" },
      { session: "c4",    date: "Wed, Sep 30" },
      { session: "guest", date: "Wed, Oct 7" },
      { session: "guest", date: "Wed, Oct 14" },
      { session: "guest", date: "Wed, Oct 21",
        note: "Instructor away this week — guest lecture." },
      { session: "c5",    date: "Wed, Oct 28" },
      { session: "c6",    date: "Wed, Nov 4" },
      { off: true,        date: "Wed, Nov 11",
        label: "Veterans' Day — no classes",
        note: "University holiday. We do not meet." },
      { session: "c7",    date: "Wed, Nov 18" },
      { session: "c8",    date: "Tue, Nov 24",
        note: "Heads up: this is a TUESDAY. The university follows a Wednesday class schedule on Nov 24, so we meet at our normal Wednesday time." },
      { off: true,        date: "Wed, Nov 25",
        label: "Thanksgiving recess — no classes",
        note: "Recess begins after the last class on Tue, Nov 24. Classes resume Mon, Nov 30." },
      { session: "guest", date: "Wed, Dec 2" },
      { session: "wrap",  date: "Wed, Dec 9",
        note: "Last Wednesday meeting of the semester." }
    ]
  }
};
