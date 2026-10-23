// Every word on the site lives here. Facts are traceable to ../research/*.md and the CV.

export const person = {
  name: "Siv Raam Krishnan K.V",
  role: "AI Engineer",
  employer: "Voxiis",
  lede: "I build software that runs on its own, checks its own work, and stops to ask a person before anything important.",
  email: "sivraamkrishnankv@gmail.com",
  phone: "+91 88837 11103",
  phoneHref: "tel:+918883711103",
  whatsapp: "https://wa.me/918883711103",
  linkedin: "https://www.linkedin.com/in/sivraamkrishnankv",
  github: "https://github.com/sivraamkrishnankv",
  cv: "/Siv-Raam-Krishnan-KV-CV.pdf",
};

export type Layer = { title: string; detail: string; glyph: Glyph };
export type Glyph = "mail" | "filter" | "doc" | "check" | "log" | "chat" | "shield" | "mic" | "tools" | "screen" | "clock" | "play" | "code" | "send" | "poll";

export type Chapter = {
  id: string;
  number: string;
  name: string;
  tagline: string;
  story: string[];
  layersTitle: string;
  drawing: "stack" | "chain";
  /** The first chapter is told in full; later ones use a tighter layout so the page doesn't repeat itself. */
  compact: boolean;
  layers: Layer[];
  decisions: { title: string; body: string }[];
  brokeTitle: string;
  broke: { title: string; body: string }[];
  facts: string;
  stack: string;
  repo: string;
  repoLabel: string;
};

export const scout: Chapter = {
  id: "scout",
  number: "Chapter one",
  name: "SCOUT",
  tagline: "A job-application agent that asks before it sends.",
  story: [
    "Applying for a job means finding the role, checking the fit, rewriting a resume and typing the same answers again. SCOUT does that work inside my own Chrome. It reads job alerts in Gmail, keeps the roles that fit, writes a one-page resume for each from my CV, and fills in the form.",
    "Then it stops. Nothing is submitted until I approve it, and that rule is enforced in code, not in a prompt, so the model cannot talk its way past it.",
  ],
  layersTitle: "SCOUT, taken apart",
  drawing: "stack",
  compact: false,
  layers: [
    { glyph: "mail", title: "Search", detail: "Reads job alerts in Gmail, inside my own browser." },
    { glyph: "filter", title: "Curate", detail: "Code cleans each link and removes duplicates by the employer's job ID. The model only judges fit." },
    { glyph: "doc", title: "Optimise", detail: "The model drafts the resume. Code builds the PDF and fact-checks every line against my CV." },
    { glyph: "check", title: "Approve", detail: "Fills the form from saved answers, shows me an approval card, and submits once." },
    { glyph: "log", title: "Track", detail: "Every step goes into an append-only log, mirrored to Google Drive." },
  ],
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
  repoLabel: "github.com/sivraamkrishnankv/scout",
};

export const valkyrie: Chapter = {
  id: "valkyrie",
  number: "Chapter two",
  name: "VALKYRIE",
  tagline: "An assistant I text from my phone that works on my PC.",
  story: [
    "VALKYRIE is a private assistant on Telegram. I send a message or a voice note, and it acts on my own computer: it checks system health, takes a screenshot, finds a file, sets a reminder or opens an app.",
    "Every step it takes is saved and shown on a dashboard, so I can see exactly what it did and why. It was my final-year engineering project.",
  ],
  layersTitle: "VALKYRIE, taken apart",
  drawing: "stack",
  compact: true,
  layers: [
    { glyph: "chat", title: "Telegram", detail: "A text or a voice note from my phone." },
    { glyph: "shield", title: "Whitelist", detail: "Messages from anyone else are dropped without a reply, and the attempt is logged." },
    { glyph: "mic", title: "Speech to text", detail: "Voice notes are transcribed on my own machine with faster-whisper." },
    { glyph: "tools", title: "Agent", detail: "A LangGraph agent picks from 25 tools: files, apps, processes, reminders, screenshots, web search." },
    { glyph: "screen", title: "Dashboard", detail: "Every command, tool call and reasoning step is saved, then streamed live to the dashboard." },
  ],
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
  repoLabel: "github.com/sivraamkrishnankv/VALKYRIE",
};

export const shuttle: Chapter = {
  id: "shuttle-poll",
  number: "Chapter three",
  name: "shuttle-poll",
  tagline: "A WhatsApp poll that posts itself, for ₹0 a month.",
  story: [
    "My badminton group needs to know who is playing tomorrow. Someone used to post the poll by hand every day. Now “Playing tomorrow?” appears in the group at 5:30 PM on its own.",
    "Nothing is hosted and nothing is paid for. Three free services each do one job, and none of them holds more access than it needs.",
  ],
  layersTitle: "shuttle-poll, taken apart",
  drawing: "chain",
  compact: true,
  layers: [
    { glyph: "clock", title: "cron-job.org", detail: "Fires at 17:30 India time, every day." },
    { glyph: "play", title: "GitHub Actions", detail: "Starts the job with the secrets it needs." },
    { glyph: "code", title: "send_poll.py", detail: "47 lines of standard-library Python. No packages to install." },
    { glyph: "send", title: "Green API", detail: "The WhatsApp gateway that posts the Yes / No poll." },
    { glyph: "poll", title: "The group", detail: "One tap to answer, in the app everyone already uses." },
  ],
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
  repoLabel: "github.com/sivraamkrishnankv/shuttle-poll",
};

export const chapters = [scout, valkyrie, shuttle];

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
    { name: "mlgos", body: "A C++ linear-regression extension for Python (pybind11), published on PyPI." },
    { name: "Fault detection", body: "A YOLOv5 detector, deployed with Docker, AWS ECR and GitHub Actions CI/CD." },
  ],
};

export const about = {
  heading: "How I work",
  body: [
    "I start from what must never go wrong, put that rule in code, and keep a person in charge of the decisions that matter.",
    "When something breaks, I write down what happened and change the system so it cannot break the same way twice. Each chapter above has its own example.",
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
