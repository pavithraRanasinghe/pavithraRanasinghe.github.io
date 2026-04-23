// Portfolio content — single source of truth.
// Exposed on window at bottom so other script files can read it.

const PROFILE = {
  name: "Pavithra Ranasinghe",
  title: "Senior Software Engineer",
  blurb: "Backend engineer building scalable SaaS platforms, distributed systems, and event-driven architectures.",
  location: "Galle, Sri Lanka",
  based: "Galle · UTC+5:30",
  email: "ranasinghemdpavithra@gmail.com",
  phone: "+94 71 918 4013",
  github: "github.com/pavithraranasinghe",
  githubUrl: "https://github.com/pavithraranasinghe",
  linkedin: "linkedin.com/in/pavithra-ranasinghe",
  linkedinUrl: "https://linkedin.com/in/pavithra-ranasinghe",
  site: "pavithraranasinghe.github.io",
  siteUrl: "https://pavithraranasinghe.github.io/",
  resumeUrl: "https://pavithraranasinghe.github.io/",
};

// Nodes on the architecture canvas. viewBox 1320 x 900.
// Types: service, db (unused now), queue (unused now), client
const NODES = [
  // Ingress
  { id: "client",    kind: "client",   x:  120, y: 420, w: 140, h: 64, label: "visitor",  sub: "CLIENT",  panel: null },

  // Core services (navigation targets) — vertical column
  { id: "about",     kind: "service",  x:  360, y: 180, w: 180, h: 72, label: "about",        sub: "SVC · /me",        panel: "about" },
  { id: "experience",kind: "service",  x:  360, y: 300, w: 180, h: 72, label: "experience",   sub: "SVC · /career",    panel: "experience" },
  { id: "projects",  kind: "service",  x:  360, y: 420, w: 180, h: 72, label: "projects",     sub: "SVC · /work",      panel: "projects" },
  { id: "systems",   kind: "service",  x:  360, y: 540, w: 180, h: 72, label: "systems",      sub: "SVC · /diagrams",  panel: "systems" },
  { id: "writing",   kind: "service",  x:  360, y: 660, w: 180, h: 72, label: "writing",      sub: "SVC · /notes",     panel: "writing" },

  // Interactive surfaces — second column
  { id: "terminal",  kind: "service",  x:  720, y: 180, w: 200, h: 80, label: "terminal",     sub: "INTERACTIVE · pty",    panel: "terminal" },
  { id: "contact",   kind: "service",  x:  720, y: 420, w: 200, h: 80, label: "endpoints",    sub: "INTERACTIVE · /links", panel: "contact" },
  { id: "resume",    kind: "service",  x:  720, y: 660, w: 200, h: 80, label: "resume",       sub: "STATIC · /download",   panel: "resume" },

  // Work-log region — third column. Three employer "service instances" with uptime bars.
  { id: "altrium",   kind: "instance", x: 1060, y: 170, w: 200, h: 96,
    label: "altrium · us health saas",
    sub: "INSTANCE · senior swe",
    uptime: { start: 2024.17, end: 2025.92, label: "mar·24 → nov·25" },
    panel: "altrium" },
  { id: "zeroday",   kind: "instance", x: 1060, y: 402, w: 200, h: 96,
    label: "zero day security · au saas",
    sub: "INSTANCE · swe → senior swe",
    uptime: { start: 2021.58, end: 2024.17, label: "aug·21 → mar·24" },
    panel: "zeroday" },
  { id: "ceyentra",  kind: "instance", x: 1060, y: 634, w: 200, h: 96,
    label: "ceyentra technologies · intern",
    sub: "INSTANCE · sw engineer intern",
    uptime: { start: 2020.92, end: 2021.58, label: "dec·20 → aug·21" },
    panel: "ceyentra" },
];

// Edges — visually sync (solid) or async (dashed).
const EDGES = [
  { from: "client",     to: "about",      kind: "sync",  label: "GET" },
  { from: "client",     to: "experience", kind: "sync",  label: "GET" },
  { from: "client",     to: "projects",   kind: "sync",  label: "GET" },
  { from: "client",     to: "systems",    kind: "sync",  label: "GET" },
  { from: "client",     to: "writing",    kind: "sync",  label: "GET" },

  { from: "about",      to: "terminal",   kind: "sync",  label: "ws upgrade" },
  { from: "projects",   to: "contact",    kind: "sync",  label: "mailto" },
  { from: "experience", to: "resume",     kind: "sync",  label: "render pdf" },

  // Career flow: experience → each employer instance
  { from: "experience", to: "altrium",    kind: "async", label: "2024 — 2025" },
  { from: "experience", to: "zeroday",    kind: "async", label: "2021 — 2024" },
  { from: "experience", to: "ceyentra",   kind: "async", label: "2020 — 2021" },
];

// Panels
const PANELS = {
  about: {
    kicker: "SVC / about",
    title: "About",
    hint: "cat /me",
    sections: [
      { kind: "prose", body: "I'm a Senior Software Engineer with 5+ years of experience building scalable backend systems and SaaS platforms. My work has focused on Java, Spring Boot, distributed systems, and event-driven architectures, with hands-on experience designing reliable production systems, optimizing performance, and solving real-world engineering challenges at scale." },
      { kind: "prose", body: "Over the years, I have worked on multi-tenant platforms, asynchronous processing systems, real-time status updates, and cloud-based backend services. I enjoy turning complex business requirements into practical technical solutions, while also thinking deeply about system design, maintainability, and long-term scalability." },
      { kind: "prose", body: "Beyond implementation, I take pride in engineering ownership — from architecture decisions and production debugging to mentoring junior developers and improving development workflows. I'm especially interested in building systems that are reliable, observable, and designed with clear trade-offs in mind." },
      { kind: "stack", entries: [
        ["Languages",   "Java 21, TypeScript, JavaScript"],
        ["Frameworks",  "Spring Boot, React, Next.js, JUnit"],
        ["Data",        "MongoDB, PostgreSQL (schema-based multi-tenant)"],
        ["Runtime",     "Linux, Docker, Kubernetes (Lens), AWS"],
        ["Messaging",   "SQS, SES, S3, change streams, WebSockets, SSE, Pub/Sub"],
        ["Observability","New Relic, OpenSearch, structured logs"],
        ["CI / repos",  "Jenkins, Bitbucket, AWS Amplify"],
        ["AI-augmented","Claude Code, Codex, Augment Code, v0"],
        ["Based",       "Galle, Sri Lanka · open to remote"],
      ]},
      { kind: "education", entries: [
        {
          degree: "Bachelor of Engineering in Software Engineering",
          honors: "First Class Honours",
          school: "London Metropolitan University",
        },
        {
          degree: "Graduate Diploma in Software Engineering",
          school: "Institute of Java & Software Engineering",
        },
      ]},
    ],
  },

  experience: {
    kicker: "SVC / experience",
    title: "Experience",
    hint: "5y · 3 roles · click a work-log instance for detail",
    roles: [
      {
        company: "Altrium (Private) Limited",
        title: "Senior Software Engineer",
        dates: "Mar 2024 — Nov 2025",
        context: "US health-insurance SaaS · 1M users · 8-person micro team",
        trace: true,
        bullets: [
          "Designed and maintained scalable backend services in <b>Java 21 + Spring Boot</b>; contributed to architecture decisions and sprint planning.",
          "Led backend for an <b>event-driven email pipeline</b> (SES · S3 · SQS · Spring Boot) handling ~5,000 emails/day, designed to scale an order of magnitude further.",
          "Built <b>real-time status propagation</b> for async document processing using MongoDB change streams and Pub/Sub over WebSockets + SSE — <b>sub-500ms</b> client updates.",
          "Optimized MongoDB aggregations and indexes: <b>~2s → sub-second</b> on hot read paths.",
          "Acted as incident support engineer — live debugging, RCAs, and the follow-up fixes nobody sees.",
          "Mentored 2 junior engineers; ran code reviews with a bias toward <i>teaching the why</i>.",
        ],
      },
      {
        company: "Zero Day Security (Private) Limited",
        title: "Software Engineer → Senior Software Engineer",
        dates: "Aug 2021 — Mar 2024",
        context: "Australian house-maintenance SaaS · 10 live tenants, designed for 50+",
        bullets: [
          "Designed and implemented a <b>schema-based multi-tenant architecture</b> in PostgreSQL — a dynamic tenant provisioner creates an isolated schema per tenant on signup.",
          "Architected backend services that served 10 active tenants with headroom for 50+ without re-architecting.",
          "Built RESTful services including <b>geospatial features with PostGIS</b>.",
          "Collaborated across the stack — Angular on web, React Native on mobile.",
        ],
      },
      {
        company: "Ceyentra Technologies",
        title: "Software Engineer Intern",
        dates: "Dec 2020 — Aug 2021",
        context: "Generalist internship · full-stack product work",
        bullets: [
          "Contributed to full-stack features across the product; my first hands-on exposure to production code review and CI.",
          "Picked up the habits that stuck: small commits, readable diffs, and writing the test before the fix.",
        ],
      },
    ],
  },

  projects: {
    kicker: "SVC / projects",
    title: "Selected projects",
    hint: "the writeups, not the wall-of-logos",
    items: [
      {
        name: "Event-driven email pipeline",
        meta: "Altrium · Java 21 · Spring Boot · SES · S3 · SQS · MongoDB",
        body: [
          "The product needed to accept inbound email, route it by tenant, durably store attachments, and notify the right account manager within seconds — without losing a message on any failure mode.",
          "I designed the pipeline as four decoupled stages (<b>ingest → parse → classify → notify</b>) with SQS between each. SES pushes raw email into S3; a lightweight parser publishes a normalized event; a classifier enriches with tenant and policy metadata; the notifier fans out to Mongo change streams consumed by the realtime service.",
          "DLQ on every stage. Every handler idempotent. ~5,000 emails/day in production, designed to scale an order of magnitude further.",
        ],
        tags: ["event-driven", "SQS", "SES/S3", "idempotency", "DLQ", "MongoDB"],
      },
      {
        name: "Real-time document status",
        meta: "Altrium · MongoDB change streams · WebSockets · SSE · Pub/Sub",
        body: [
          "Document processing is asynchronous — OCR, extraction, validation, enrichment. The UI wanted a live progress feel without polling.",
          "I wired Mongo change streams into an internal Pub/Sub topic keyed by tenant + document id. The realtime service fans out to WebSockets (desktop) and SSE (low-bandwidth) with the same payload shape, so clients pick whichever transport they can hold open.",
          "End-to-end p95 from DB commit to rendered UI update: <b>under 500ms</b>.",
        ],
        tags: ["realtime", "change streams", "WebSockets", "SSE", "Pub/Sub"],
      },
      {
        name: "Schema-based multi-tenant provisioner",
        meta: "Zero Day Security · PostgreSQL · Spring Boot",
        body: [
          "One shared Postgres, one schema per tenant, one signup flow that creates the schema, runs migrations against it, and wires routing at the service layer based on the authenticated tenant.",
          "Trade-off accepted: shared connection pool, per-schema search_path, background migrator that replays pending Flyway changes against every tenant schema.",
          "Ran 10 tenants in production; the design had headroom for 50+ before we'd want to rethink (at which point: one database per tenant, or Citus).",
        ],
        tags: ["PostgreSQL", "multi-tenant", "Flyway", "schemas"],
      },
      {
        name: "AI-assisted meal scheduling & distribution",
        meta: "Japan client · Next.js · Supabase (Postgres) · AWS Amplify",
        body: [
          "An internal ops system for 50 active users, delivered <b>independently, end-to-end</b>. Next.js on the front, Supabase/Postgres on the back, Amplify for deploy.",
          "I used Codex + v0 as pair programmers for the repetitive screens and schema plumbing, then spent the saved time on the scheduling model itself — which is the actual product.",
          "Shipped as a production-ready system, not a prototype.",
        ],
        tags: ["Next.js", "Supabase", "Amplify", "AI-augmented"],
      },
      {
        name: "Event Management System",
        meta: "Personal · full-stack",
        body: [
          "An end-to-end event management platform — registration, scheduling, and attendee communication — built to exercise the full stack outside of work hours.",
        ],
        tags: ["full-stack", "side-project"],
      },
    ],
  },

  systems: {
    kicker: "SVC / systems",
    title: "Systems I've built",
    hint: "the diagrams, not the slogans",
    prose: "Some of the recurring shapes in my work. Click any service node on the main canvas to see the real writeups — this page is the vocabulary.",
    diagrams: [
      {
        name: "Fan-in → fan-out with per-tenant isolation",
        use: "Inbound email, webhook ingestion, anywhere you can't drop a message.",
        shape: "one queue per source, a router that classifies and re-publishes on a per-tenant topic, downstream consumers that are idempotent and parallel-safe.",
      },
      {
        name: "Change stream → pub/sub → realtime transport",
        use: "Async processing you want to feel synchronous.",
        shape: "Mongo change stream → internal Pub/Sub keyed by tenant+entity → WebSocket (or SSE) fan-out. Clients subscribe once, state flows. Back-pressure handled at the Pub/Sub layer, not the transport.",
      },
      {
        name: "Schema-per-tenant on shared Postgres",
        use: "Early-stage multi-tenant B2B where you want isolation without the ops cost of a DB per tenant.",
        shape: "Shared cluster, per-tenant schema, Flyway migrations replayed per schema, routing via authenticated tenant context on the connection.",
      },
      {
        name: "Hot-path aggregation tuning",
        use: "Mongo queries that started at 2s and had to get under 500ms without a rewrite.",
        shape: "Profile with $indexStats, pin compound indexes to the exact predicate order, move $lookup out of the hot path via denormalization, cache the slow-changing bits.",
      },
    ],
  },

  writing: {
    kicker: "SVC / writing",
    title: "Writing",
    hint: "short notes on LinkedIn · click to read the full thread",
    posts: [
      {
        date: "2026 · 04",
        title: "AI-native development is not vibe coding",
        meta: "software engineering · ai-native · system design",
        excerpt: "Why AI-native development is still an engineering discipline — architects stay in control, AI provides leverage. Covers requirement clarity, task decomposition, constraint definition, and the post-implementation review questions every engineer should ask.",
        url: "https://www.linkedin.com/pulse/ai-native-development-vibe-coding-pavithra-ranasinghe-wsxpc",
      },
      {
        date: "2025 · 05",
        title: "Designing for failure: resilience patterns in microservices",
        meta: "microservices · system design · resilience",
        excerpt: "Why resilience is a design property, not a library. Timeouts, retries, circuit breakers, bulkheads — and where each one actually belongs in a service mesh.",
        url: "https://www.linkedin.com/posts/pavithra-ranasinghe_microservices-systemdesign-resilience-activity-7443515271346057217-NepM",
      },
      {
        date: "2025 · 05",
        title: "What changes when you move from mid-level to senior",
        meta: "software engineering · senior engineer · backend",
        excerpt: "A short reflection on the shift from writing the ticket to owning the outcome — code review, mentorship, and the meetings that actually matter.",
        url: "https://www.linkedin.com/posts/pavithra-ranasinghe_softwareengineering-seniorengineer-backendengineering-activity-7443900163141840897-DVeO",
      },
      {
        date: "2025 · 05",
        title: "System design: thinking in contracts, not code",
        meta: "software engineering · backend · system design",
        excerpt: "The habit that improved my designs the most — starting with the contract between components instead of the implementation inside them.",
        url: "https://www.linkedin.com/posts/pavithra-ranasinghe_softwareengineering-backendengineering-systemdesign-activity-7444260601477951488-eixq",
      },
      {
        date: "2025 · 05",
        title: "Observability is a first-class feature",
        meta: "software engineering · observability · backend",
        excerpt: "Logs, metrics, traces — and the questions each one actually answers. Notes from shipping services you have to keep alive at 3am.",
        url: "https://www.linkedin.com/posts/pavithra-ranasinghe_softwareengineering-observability-backendengineering-activity-7445031058070405120-GTAL",
      },
      {
        date: "2025 · 05",
        title: "On being a solution architect in the product trenches",
        meta: "software engineering · system design · solution architect",
        excerpt: "The gap between the architecture diagram and the sprint backlog — and how to write designs that survive contact with delivery.",
        url: "https://www.linkedin.com/posts/pavithra-ranasinghe_softwareengineering-systemdesign-solutionarchitect-activity-7446056800371773440-PoFm",
      },
      {
        date: "2025 · 05",
        title: "Sync vs. async: choosing the right communication style",
        meta: "software engineering · system design · backend",
        excerpt: "A practical guide to picking between request/response and event-driven — with the failure modes of each laid out honestly.",
        url: "https://www.linkedin.com/posts/pavithra-ranasinghe_softwareengineering-systemdesign-backendengineering-activity-7446842520455618560-EHlH",
      },
      {
        date: "2025 · 06",
        title: "Distributed systems: what actually makes them hard",
        meta: "software engineering · system design · distributed systems",
        excerpt: "Partial failure, consistency, and the ops cost nobody talks about up front — a short field guide to the things that bite you after launch.",
        url: "https://www.linkedin.com/posts/pavithra-ranasinghe_softwareengineering-systemdesign-distributedsystems-activity-7447549323418034177-pD5Z",
      },
      {
        date: "2025 · 06",
        title: "Multi-tenancy patterns: shared, schema-per-tenant, database-per-tenant",
        meta: "software architecture · system design · multi-tenancy",
        excerpt: "The three classic multi-tenant shapes, when to pick which, and the specific signal that tells you it's time to switch.",
        url: "https://www.linkedin.com/posts/pavithra-ranasinghe_softwarearchitecture-systemdesign-multitenancy-activity-7447884240689688577-34Gs",
      },
    ],
  },

  terminal: {
    kicker: "INTERACTIVE / terminal",
    title: "Terminal",
    hint: "type `help` or click a chip",
    body: "terminal-widget",
  },

  contact: {
    kicker: "INTERACTIVE / endpoints",
    title: "Endpoints",
    hint: "the public surface — all working links",
    body: "contact-widget",
  },

  resume: {
    kicker: "STATIC / resume",
    title: "Résumé",
    hint: "the short version",
    prose: "Company, dates, impact — one page. The canvas is the long version.",
    action: { label: "Download resume", href: "public/Pavithra_Ranasinghe_Senior_Software_Engineer.pdf", download: true },
  },

  // Employer instance drawers (reuse the experience role data)
  altrium:  { kicker: "INSTANCE / altrium",  title: "Altrium",  hint: "mar 2024 — nov 2025", roleIndex: 0 },
  zeroday:  { kicker: "INSTANCE / zero day", title: "Zero Day Security", hint: "aug 2021 — mar 2024", roleIndex: 1 },
  ceyentra: { kicker: "INSTANCE / ceyentra", title: "Ceyentra Technologies", hint: "dec 2020 — aug 2021", roleIndex: 2 },
};

// Trace data for the email pipeline flamegraph (used by the trace signature mode).
const TRACE = {
  totalMs: 420,
  summary: "Email pipeline · ingest → parse → classify → notify → realtime. Total: 420 ms end-to-end.",
  rows: [
    { name: "SES ingest → S3 write",         depth: 0, start: 0,   end: 48,  kind: "sync",  note: "raw email stored durably" },
    { name: "SQS publish (ingest→parse)",     depth: 0, start: 48,  end: 62,  kind: "async" },
    { name: "parse handler",                  depth: 1, start: 62,  end: 130, kind: "sync",  note: "normalize envelope + attachments" },
    { name: "S3 attachment read",             depth: 2, start: 70,  end: 118, kind: "async", note: "parallel read" },
    { name: "SQS publish (parse→classify)",   depth: 1, start: 130, end: 144, kind: "async" },
    { name: "classify handler",               depth: 1, start: 144, end: 230, kind: "sync",  note: "tenant lookup + policy match" },
    { name: "mongo tenant query",             depth: 2, start: 150, end: 196, kind: "sync",  note: "indexed · sub-50ms" },
    { name: "SQS publish (classify→notify)",  depth: 1, start: 230, end: 244, kind: "async" },
    { name: "notify handler",                 depth: 1, start: 244, end: 320, kind: "sync",  note: "fan-out to account managers" },
    { name: "mongo write (notification)",     depth: 2, start: 254, end: 298, kind: "sync" },
    { name: "change stream → pub/sub",        depth: 2, start: 298, end: 340, kind: "async", note: "triggers realtime" },
    { name: "ws fan-out (2 clients)",         depth: 3, start: 340, end: 420, kind: "async", note: "p95 < 500ms ✓" },
  ],
};

// Add trace panel to PANELS
PANELS.trace = {
  kicker: "TRACE / email pipeline",
  title: "Request trace",
  hint: "one email · ingest → parse → classify → notify → realtime",
};

window.PROFILE = PROFILE;
window.NODES = NODES;
window.EDGES = EDGES;
window.PANELS = PANELS;
window.TRACE = TRACE;
