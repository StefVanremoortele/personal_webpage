export type Era = "dev" | "sec" | "agent";

export type NowStatus = "past" | "current" | "upcoming";

export type ExperienceEntry = {
  company: string;
  role: string;
  start: string;
  end: string;
  era: Era;
  bullets: string[];
  reference?: string;
  highlight?: string;
};

export type Project = {
  name: string;
  description: string;
  url: string;
  tags: string[];
};

export const siteUrl = "https://stefvanremoortele.be";

export const profile = {
  name: "Stef Vanremoortele",
  title: "Software Developer & Security Specialist",
  tagline:
    "Backend-oriented software engineer with an education in security, building reliable applications where architecture, security, and UX hold together.",
  location: "Oostende, Belgium",
  availability: "Available in Flanders (Belgium)",
  yearsExperience: 7,
  email: "stefvanremoortele.io@gmail.com",
  phone: "+32 474 019 394",
  whatsapp: "https://wa.me/32474019394",
  calendly: "https://calendly.com/stefvanremoortele/15min",
  github: "https://github.com/StefVanremoortele",
  linkedin: "https://www.linkedin.com/in/stefvanremoortele/",
};

export const about = [
  "My educational background in IT security, combined with strong analytical and conceptual thinking, helps me approach software challenges with both engineering depth and a security perspective.",
  "I work well across teams and like turning complex technical or security problems into practical solutions. A structured, quality-driven approach lets me contribute independently while still fitting into Agile delivery environments.",
  "I'm eager to keep learning, adapt quickly to new technologies and methodologies, and take ownership with a pragmatic make-it-happen attitude.",
];

export const skills = [
  "TypeScript",
  "Node.js",
  "Python",
  "Django",
  "Angular",
  "React / Next.js",
  "gRPC & Microservices",
  "Kafka",
  "PostgreSQL / MS SQL",
  "Azure / Entra",
  "OAuth / OpenID / SAML",
  "Threat modeling (STRIDE)",
  "SIEM (Sentinel/Defender)",
  "NIST / ISO 27001 / NIS2 / GDPR",
];

export const experience: ExperienceEntry[] = [
  {
    company: "SIMIT",
    role: "IT Solutions Architect",
    start: "Jan 2026",
    end: "Mar 2026",
    era: "agent",
    bullets: [
      "Integrated AI-driven coding tools and LLM workflows into the development lifecycle.",
      "Accelerated development speed and improved code quality through modern tooling adoption.",
    ],
    reference: "Jeffrey Drooghenbroodt (CEO)",
  },
  {
    company: "Roularta Media Group",
    role: "IT Security & Compliance Engineer",
    start: "Jul 2023",
    end: "Jan 2026",
    era: "sec",
    bullets: [
      "Improved security posture across a large media and industrial environment through policies and awareness campaigns covering clean desk, password hygiene, and phishing.",
      "Led application security initiatives through SSDLC practices: SAST/DAST, OWASP, Intigriti, penetration testing, threat modeling, and vulnerability and risk management using CVSS and ASVS.",
      "Implemented identity and access management solutions with Azure Entra, OAuth, OpenID, SAML, Palo Alto Strata, Prisma, and Cortex.",
      "Integrated SIEM capabilities and collaborated with SOC teams on incident response, EASM, XDR, threat detection, monitoring, and hunting.",
      "Migrated legacy infrastructure toward zero-trust, cloud-based authentication using ZTNA.",
      "Contributed to compliance work across NIST, ISO 27001/27002/27017/27701, GDPR, and NIS2 frameworks.",
    ],
    reference: "Oliver Martin (IT Security Manager)",
  },
  {
    company: "Zora Robotics",
    role: "Software Engineer",
    start: "Nov 2022",
    end: "Jul 2023",
    era: "dev",
    bullets: [
      "Built and maintained a multi-tenant backend platform using a gRPC microservices architecture.",
      "Designed scalable and fault-tolerant systems with distributed services and replicated databases.",
      "Implemented asynchronous communication using Kafka and HTTP APIs.",
      "Applied Test-Driven Development practices with advanced mocking and stubbing techniques.",
      "Collaborated in Agile teams delivering incremental improvements.",
    ],
    reference: "Wim Vanneste (CIO)",
  },
  {
    company: "NineID",
    role: "Software Engineer",
    start: "Jul 2021",
    end: "Sep 2022",
    era: "dev",
    bullets: [
      "Developed identity and access management systems using facial recognition technology.",
      "Built backend services and client-facing interfaces for secure authentication systems.",
      "Prototyped innovative solutions including BLE communication and AI-based integrations.",
      "Worked extensively with embedded Linux systems.",
    ],
    highlight: "Start-up experience",
    reference: "Frederik Keysers (CEO)",
  },
  {
    company: "Noordzee Helikopters Vlaanderen",
    role: "Software Engineer",
    start: "Nov 2020",
    end: "Jul 2021",
    era: "dev",
    bullets: [
      "Developed a cross-platform web application for a globally distributed aviation company.",
      "Delivered scalable solutions supporting multiple international locations.",
      "Implemented interactive learning for end users using SCORM and xAPI.",
      "Implemented verification checks for flight rules and mandatory training.",
    ],
    reference: "Frederik Keysers (Teamlead)",
  },
  {
    company: "Easypost",
    role: "Software Engineer",
    start: "Nov 2018",
    end: "Sep 2020",
    era: "dev",
    bullets: [
      "Built internal platforms using Python and Angular to streamline business processes.",
      "Developed multi-threaded client-server applications for hardware integration.",
      "Managed infrastructure including Active Directory, VPN, backups, and networking.",
      "Led development efforts independently and mentored new team members.",
      "Performed large-scale database operations and optimization.",
    ],
    highlight: "Migration to new office",
    reference: "Bart Despontin (CIO)",
  },
];

// To feature open-source projects, add entries here and uncomment the
// <Projects /> render in app/page.tsx.
export const projects: Project[] = [
  // {
  //   name: "example-repo",
  //   description: "One-line description of what it does.",
  //   url: "https://github.com/StefVanremoortele/example-repo",
  //   tags: ["TypeScript", "CLI"],
  // },
];
