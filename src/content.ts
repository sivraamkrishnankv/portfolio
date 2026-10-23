// Every word on the site lives here. Facts are traceable to ../research/*.md and the CV.

export const person = {
  name: "Siv Raam Krishnan K.V",
  short: "Siv Raam",
  nameLines: ["Siv Raam", "Krishnan K.V"],
  role: "AI Engineer",
  employer: "Voxiis",
  lede: "I build software that runs on its own, checks its own work, and stops to ask a person before anything important.",
  /** The same sentence, with the three promises marked for emphasis. */
  ledeParts: [["I build software that ", false], ["runs on its own", true], [", ", false], ["checks its own work", true], [", and ", false], ["stops to ask a person", true], [" before anything important.", false]] as [string, boolean][],
  portraitNote: "The person in the loop",
  email: "sivraamkrishnankv@gmail.com",
  phone: "+91 88837 11103",
  phoneHref: "tel:+918883711103",
  whatsapp: "https://wa.me/918883711103",
  linkedin: "https://www.linkedin.com/in/sivraamkrishnankv",
  github: "https://github.com/sivraamkrishnankv",
  cv: "/Siv-Raam-Krishnan-KV-CV.pdf",
};

/* ── Live diagrams ────────────────────────────────────────────────────
   Nodes sit on a grid: `d` is [column, row] on wide screens, `m` on phones.
   Edges are [from, to, label, isLoopBack?]. A run is the route one item takes,
   with the caption shown at each stop. */
export type NodeKind = "source" | "code" | "model" | "you" | "fail";
export type FlowNode = { id: string; kind: NodeKind; title: string; body: string; d: [number, number]; m: [number, number]; small?: boolean; gate?: boolean };
export type Flow = {
  label: string;
  cols: number;
  kinds?: Partial<Record<NodeKind, string>>;
  nodes: FlowNode[];
  /** [from, to, label, "back" for a loop back to an earlier step] */
  edges: [string, string, string, "back"?][];
  runs: { item: string; steps: [string, string][] }[];
  still: string;
};

export type Chapter = {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  proof: string[];
  tags: string[];
  story: string[];
  flowTitle: string;
  flowIntro: string;
  flow: Flow;
  decisions: { title: string; body: string }[];
  brokeTitle: string;
  broke: { title: string; body: string }[];
  facts: string;
  stack: string;
  repo: string;
  repoLabel: string;
};

export const scout: Chapter = {
  slug: "scout",
  number: "01",
  name: "SCOUT",
  tagline: "A job-application agent that asks before it sends.",
  proof: ["Approval enforced in code, not in a prompt", "Every resume line fact-checked against my CV", "190 tests written as business rules"],
  tags: ["Claude Code", "Claude in Chrome", "Node.js", "Python"],
  story: [
    "Applying for a job means finding the role, checking the fit, rewriting a resume and typing the same answers again. SCOUT does that work inside my own Chrome. It reads job alerts in Gmail, keeps the roles that fit, writes a one-page resume for each from my CV, and fills in the form.",
    "Then it stops. Nothing is submitted until I approve it, and that rule is enforced in code, not in a prompt, so the model cannot talk its way past it.",
  ],
  flowTitle: "How one job moves through SCOUT",
  flowIntro: "Plain code does everything code can decide. The model is used only for judgement. And nothing is sent until I approve it.",
  flow: {
    label: "SCOUT pipeline",
    cols: 5,
    nodes: [
      { id: "gmail", kind: "source", title: "Gmail job alerts", body: "Read inside my own Chrome by Claude in Chrome.", d: [1, 1], m: [1, 1] },
      { id: "clean", kind: "code", title: "Clean and dedupe", body: "Cleans each link, drops duplicates by the employer's job ID, filters titles.", d: [2, 1], m: [1, 2] },
      { id: "fit", kind: "model", title: "Fit check", body: "Does the role fit, and am I eligible?", d: [3, 1], m: [1, 3] },
      { id: "nofit", kind: "code", title: "Not a fit", body: "Logged with the reason.", d: [3, 2], m: [2, 3], small: true },
      { id: "resume", kind: "model", title: "Resume draft", body: "A one-page resume for this role, written from my master CV.", d: [4, 1], m: [1, 4] },
      { id: "check", kind: "code", title: "Build and fact-check", body: "Builds the PDF and refuses any claim that is not in my CV.", d: [5, 1], m: [1, 5] },
      { id: "fill", kind: "code", title: "Fill the form", body: "Answers come from a saved answer bank. A new legal question parks the job.", d: [5, 3], m: [1, 6] },
      { id: "approve", kind: "you", title: "Approval card", body: "Nothing is sent until I approve. Enforced in code.", d: [4, 3], m: [1, 7], gate: true },
      { id: "submit", kind: "code", title: "Submit once", body: "Recorded before the click, clicked once, confirmation checked.", d: [3, 3], m: [1, 8] },
      { id: "track", kind: "code", title: "Tracker and Drive", body: "Append-only log, mirrored to Google Drive.", d: [2, 3], m: [1, 9] },
    ],
    edges: [
      ["gmail", "clean", "job links"],
      ["clean", "fit", "new job"],
      ["fit", "nofit", "no"],
      ["fit", "resume", "fits"],
      ["resume", "check", "resume spec"],
      ["check", "resume", "claim not in CV", "back"],
      ["check", "fill", "verified PDF"],
      ["fill", "approve", "filled form"],
      ["approve", "submit", "approved"],
      ["submit", "track", "confirmed"],
    ],
    runs: [
      {
        item: "Backend SDE",
        steps: [
          ["gmail", "A job alert lands in Gmail. (Press Approve at any time to skip ahead.)"],
          ["clean", "Plain code, not the model, cleans the link and checks the job is new."],
          ["fit", "The model judges one thing: does this role fit?"],
          ["resume", "The model drafts a one-page resume from my CV."],
          ["check", "One claim is not in my CV. Refused, and sent back."],
          ["resume", "Redrafted without the refused claim."],
          ["check", "Every line traces to my CV. The PDF passes."],
          ["fill", "The form is filled from saved answers."],
          ["approve", "It stops here, every time. Press Approve."],
          ["submit", "Recorded first, clicked once, and the confirmation page checked in code."],
          ["track", "Logged in an append-only tracker, mirrored to Google Drive. Next job."],
        ],
      },
      {
        item: "Java Lead, 10+ yrs",
        steps: [
          ["gmail", "Another alert."],
          ["clean", "Cleaned, and not seen before."],
          ["fit", "Ten years of Java is not me. The model says no."],
          ["nofit", "Logged as not a fit, with the reason. Nothing else happens."],
        ],
      },
    ],
    still: "Every job takes this route. Nothing is sent until I approve it.",
  },
  decisions: [
    {
      title: "Code decides what code can decide",
      body: "Links, IDs, duplicates, saved answers and status changes are plain Node code. The model is used only where judgement is needed: fit, resume wording and free-text answers.",
    },
    {
      title: "It cannot invent experience",
      body: "A fact-checker refuses any number, skill, title or date that is not in my master CV, including skills I have marked as genuine gaps.",
    },
    {
      title: "Legal questions come from me",
      body: "Eligibility and legal answers come only from a stored answer bank. When a question is new, the job is parked until I answer it.",
    },
  ],
  brokeTitle: "What broke, and what changed",
  broke: [
    {
      title: "A button that submitted too early",
      body: "One job board submits the moment its Apply button is clicked. On the first live run, one application went out before the approval card, with the board's stored resume instead of the tailored one. SCOUT logged it as failed instead of hiding it, and the approval gate now runs before any quick-apply button is touched.",
    },
    {
      title: "Ten problems found before launch",
      body: "An adversarial review agent I ran before publishing the code found 6 serious and 4 moderate problems. The first fix moved approval and single-submit out of the instructions and into the tracker code, where they cannot be skipped.",
    },
  ],
  facts: "5 stages, 14 job-site playbooks, and 190 automated tests written as business rules.",
  stack: "Claude Code, Claude in Chrome, Node.js, Python, Gmail, Google Drive",
  repo: "https://github.com/sivraamkrishnankv/scout",
  repoLabel: "sivraamkrishnankv/scout",
};

export const valkyrie: Chapter = {
  slug: "valkyrie",
  number: "02",
  name: "VALKYRIE",
  tagline: "An assistant I text from my phone that works on my PC.",
  proof: ["Only I can talk to it", "25 tools, each with hard limits", "Every step saved and shown live"],
  tags: ["LangGraph", "faster-whisper", "FastAPI", "Next.js"],
  story: [
    "VALKYRIE is a private assistant on Telegram. I send a message or a voice note, and it acts on my own computer: it checks system health, takes a screenshot, finds a file, sets a reminder or opens an app.",
    "Every step it takes is saved and shown on a dashboard, so I can see exactly what it did and why. It was my final-year engineering project.",
  ],
  flowTitle: "How one message moves through VALKYRIE",
  flowIntro: "The whitelist comes first, speech is transcribed on my own machine, and every tool call is saved and shown live.",
  flow: {
    label: "VALKYRIE message flow",
    cols: 5,
    nodes: [
      { id: "tg", kind: "source", title: "Telegram", body: "A text or a voice note, from me or from anyone who finds the bot.", d: [1, 1], m: [1, 1] },
      { id: "wl", kind: "code", title: "Whitelist", body: "Checks the sender's Telegram ID before anything else runs.", d: [2, 1], m: [1, 2] },
      { id: "drop", kind: "code", title: "Dropped", body: "No reply. The attempt is logged.", d: [2, 2], m: [2, 2], small: true },
      { id: "stt", kind: "model", title: "Speech to text", body: "Voice notes are transcribed on my own PC with faster-whisper.", d: [3, 1], m: [1, 3] },
      { id: "agent", kind: "model", title: "LangGraph agent", body: "Decides which tool to use. The model behind it is swappable.", d: [4, 1], m: [1, 4] },
      { id: "reply", kind: "you", title: "Reply on my phone", body: "Back in the chat.", d: [5, 1], m: [2, 4], small: true },
      { id: "tools", kind: "code", title: "25 tools on my PC", body: "Files under one root folder, 12 allowed apps, 9 processes it can never kill.", d: [4, 3], m: [1, 5] },
      { id: "db", kind: "code", title: "SQLite log", body: "Every command, tool call and reasoning step is saved.", d: [3, 3], m: [1, 6] },
      { id: "dash", kind: "code", title: "Dashboard", body: "FastAPI streams each step live to a Next.js dashboard.", d: [2, 3], m: [1, 7] },
    ],
    edges: [
      ["tg", "wl", "message"],
      ["wl", "drop", "not me"],
      ["wl", "agent", "text"],
      ["wl", "stt", "voice note"],
      ["stt", "agent", "transcript"],
      ["agent", "tools", "tool call"],
      ["tools", "agent", "result", "back"],
      ["agent", "reply", "answer"],
      ["tools", "db", "every step"],
      ["db", "dash", "live"],
    ],
    runs: [
      {
        item: "“Take a screenshot”",
        steps: [
          ["tg", "I send a voice note from my phone: “take a screenshot”."],
          ["wl", "My Telegram ID is on the list, so it goes through."],
          ["stt", "faster-whisper turns the voice note into text, on my own machine."],
          ["agent", "The agent reads the request and picks the screenshot tool."],
          ["tools", "The tool runs on my PC and saves the image."],
          ["agent", "The result comes back to the agent."],
          ["reply", "The screenshot arrives in my Telegram chat."],
        ],
      },
      {
        item: "Unknown sender",
        steps: [
          ["tg", "Someone else finds the bot and sends it a message."],
          ["wl", "Their ID is not on the list."],
          ["drop", "Dropped without a reply. The attempt is logged."],
        ],
      },
      {
        item: "Tool call #20",
        steps: [
          ["tools", "Every tool call, whatever triggered it..."],
          ["db", "...is saved with its input, its result and the agent's reasoning..."],
          ["dash", "...and streamed live to the dashboard, so I can see exactly what it did and why."],
        ],
      },
    ],
    still: "Only my messages get through, and every step it takes is saved and shown on the dashboard.",
  },
  decisions: [
    {
      title: "Only I can talk to it",
      body: "A whitelist sits in front of everything. File tools can only reach one root folder, apps launch from a fixed list of 12, and 9 system processes can never be killed.",
    },
    {
      title: "The model is swappable",
      body: "One setting switches between Gemini, Claude, OpenAI or a local model through Ollama. The tools and speech-to-text always run on my machine.",
    },
    {
      title: "Reminders survive a restart",
      body: "Reminders are stored, rescheduled when VALKYRIE starts again, and any that were missed while it was off fire straight away.",
    },
  ],
  brokeTitle: "Honest limits",
  broke: [
    {
      title: "What I would fix before anyone else used it",
      body: "It has no automated tests yet. The shell tool blocks dangerous commands from a list instead of running them in a true sandbox, and the dashboard has no login, so it must stay on my own machine. I would close all three before handing it to someone else.",
    },
  ],
  facts: "25 tools, 7 dashboard pages, 26 pages of docs, and about 3,100 lines of Python.",
  stack: "Python, aiogram, LangGraph, faster-whisper, FastAPI, SQLite, Next.js, React",
  repo: "https://github.com/sivraamkrishnankv/VALKYRIE",
  repoLabel: "sivraamkrishnankv/VALKYRIE",
};

export const shuttle: Chapter = {
  slug: "shuttle-poll",
  number: "03",
  name: "shuttle-poll",
  tagline: "A WhatsApp poll that posts itself, for ₹0 a month.",
  proof: ["Starts a median of 33 seconds after 5:30 PM", "Each service holds only its own key", "Nothing hosted, nothing paid for"],
  tags: ["GitHub Actions", "cron-job.org", "Python"],
  story: [
    "My badminton group needs to know who is playing tomorrow. Someone used to post the poll by hand every day. Now “Playing tomorrow?” appears in the group at 5:30 PM on its own.",
    "Nothing is hosted and nothing is paid for. Three free services each do one job, and none of them holds more access than it needs.",
  ],
  flowTitle: "One evening of shuttle-poll, and the two that went wrong",
  flowIntro: "The normal run takes under 20 seconds. The other two runs are real failures, and they are why the next change is a check that fails loudly.",
  flow: {
    label: "shuttle-poll run",
    cols: 5,
    kinds: { you: "People", fail: "What broke" },
    nodes: [
      { id: "cron", kind: "source", title: "cron-job.org", body: "Fires at 17:30 India time, every day.", d: [1, 1], m: [1, 1] },
      { id: "gha", kind: "code", title: "GitHub Actions", body: "Starts the workflow with the secrets it needs.", d: [2, 1], m: [1, 2] },
      { id: "py", kind: "code", title: "send_poll.py", body: "47 lines of standard-library Python. No packages to install.", d: [3, 1], m: [1, 3] },
      { id: "typo", kind: "fail", title: "WA_GROUPID", body: "One renamed setting. 11 evenings failed.", d: [3, 2], m: [2, 3], small: true },
      { id: "green", kind: "code", title: "Green API", body: "The WhatsApp gateway that posts the Yes / No poll.", d: [4, 1], m: [1, 4] },
      { id: "silent", kind: "fail", title: "“OK”, but unlinked", body: "Green for 10 days. Nothing arrived.", d: [4, 2], m: [2, 4], small: true },
      { id: "group", kind: "you", title: "The group", body: "One tap to answer, in the app everyone already uses.", d: [5, 1], m: [1, 5] },
    ],
    edges: [
      ["cron", "gha", "one-repo token"],
      ["gha", "py", "secrets"],
      ["py", "typo", "KeyError"],
      ["py", "green", "sendPoll"],
      ["green", "silent", "200 OK"],
      ["green", "group", "Yes / No poll"],
    ],
    runs: [
      {
        item: "Today, 17:30",
        steps: [
          ["cron", "cron-job.org fires at 17:30. GitHub's own scheduler ran 4 to 8 hours late, so it is not used."],
          ["gha", "Its token can start this one workflow and nothing else."],
          ["py", "The script reads the WhatsApp token from GitHub Secrets. The scheduler never sees it."],
          ["green", "Green API accepts the poll for the group."],
          ["group", "“Playing tomorrow?” goes out. The run started a median of 33 seconds after 5:30. A delivery check is the next change."],
        ],
      },
      {
        item: "21 Sep – 1 Oct",
        steps: [
          ["cron", "Same trigger, every evening."],
          ["gha", "The workflow starts."],
          ["py", "An edit had renamed one setting to WA_GROUPID."],
          ["typo", "The script crashed 11 evenings in a row. I caught it while moving to the new scheduler and fixed it in one commit."],
        ],
      },
      {
        item: "The quiet 10 days",
        steps: [
          ["cron", "The trigger fires."],
          ["gha", "The workflow runs."],
          ["py", "The script sends the poll."],
          ["green", "The WhatsApp session behind the gateway had been unlinked."],
          ["silent", "It still answered “OK”. Every dashboard was green while no poll reached the group. A success code is not delivery."],
        ],
      },
    ],
    still: "Three free services, each with one job. The two red boxes are real failures, told below.",
  },
  decisions: [
    {
      title: "On time, not roughly on time",
      body: "GitHub's own scheduler fired 4 to 8 hours late, which is useless for a poll about tomorrow. An outside scheduler now starts the run about 30 seconds after 5:30.",
    },
    {
      title: "Each service holds only its own key",
      body: "The scheduler's token can start this one workflow and nothing else. The WhatsApp token cannot be limited, so it lives only in GitHub Secrets and the scheduler never sees it.",
    },
    {
      title: "No backup schedule",
      body: "A late backup run would post a second poll into the group. One reliable trigger is better than two that can collide.",
    },
  ],
  brokeTitle: "What broke, and what changed",
  broke: [
    {
      title: "One wrong character, eleven missed evenings",
      body: "An edit renamed one setting to WA_GROUPID, and the poll failed 11 evenings in a row, from 21 September to 1 October. I caught it while moving to the new scheduler and fixed it in one commit.",
    },
    {
      title: "Green lights while nothing arrived",
      body: "For about 10 days the WhatsApp session behind the gateway was unlinked, but the gateway still answered “OK”. Every dashboard was green while no poll reached the group. A success code is not delivery, so the next change is a session check that fails the run loudly.",
    },
  ],
  facts: "Runs start a median of 33 seconds after 5:30 PM and finish in under 20 seconds.",
  stack: "GitHub Actions, cron-job.org, Green API, Python",
  repo: "https://github.com/sivraamkrishnankv/shuttle-poll",
  repoLabel: "sivraamkrishnankv/shuttle-poll",
};

export const chapters = [scout, valkyrie, shuttle];
export const chapterBySlug = (slug: string) => chapters.find((c) => c.slug === slug);

export const work = {
  heading: "At work",
  jobs: [
    {
      org: "Voxiis",
      role: "AI Engineer",
      dates: "Aug 2026 – now",
      body: "Building a product localization pipeline from scratch, plus agentic systems and automation for internal marketing, sales lead generation and product-manager assistance, in an AI-native team.",
      items: [] as { name: string; body: string }[],
    },
    {
      org: "Trilogy Innovations",
      role: "Software Development Engineer intern",
      dates: "Jan – Jul 2026",
      body: "Built two production agentic systems and contributed to a third in six months, in weekly agile cycles, in Python and TypeScript on AWS and Docker.",
      items: [
        { name: "Lace", body: "Audited 500+ production runs of 30+ AI agents and wrote an evidence-backed report for each." },
        { name: "Docate", body: "Turns product commits into documentation pull requests, resolved without human input in 80% of 30+ production runs." },
        { name: "Braintrust", body: "Contributor. Moved agent execution into a sandbox for a platform-wide 3× latency reduction." },
      ],
    },
  ],
  note: "These systems belong to the companies, so I can walk you through the engineering but cannot show the code.",
  smaller: [
    { name: "mlgos", body: "A C++ linear-regression extension for Python (pybind11), published on PyPI.", href: "https://pypi.org/project/mlgos/", linkLabel: "PyPI" },
    { name: "Fault detection", body: "A YOLOv5 detector, deployed with Docker, AWS ECR and GitHub Actions CI/CD.", href: "", linkLabel: "" },
  ],
};

export const about = {
  heading: "How I work",
  body: [
    "I start from what must never go wrong, put that rule in code, and keep a person in charge of the decisions that matter.",
    "When something breaks, I write down what happened and change the system so it cannot break the same way twice. Each case study has its own example.",
  ],
  facts: [
    { label: "Education", body: "B.Tech in Artificial Intelligence and Data Science, Sri Shakthi Institute of Engineering and Technology, 2022 – 2026. CGPA 8.19." },
    { label: "Teaching", body: "Mentored 100+ students in data structures, operating systems and computer networks, through daily problem-solving and code reviews (2025)." },
    { label: "On stage", body: "Hosted Career Conclave across 4 editions: conversations with industry experts in front of 1,000+ attendees." },
  ],
};

export const contact = {
  heading: "Book 30 minutes with me",
  body: "Tell me what you are trying to build or fix. I will tell you honestly how I would approach it.",
};
