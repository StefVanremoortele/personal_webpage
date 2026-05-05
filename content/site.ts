export type ExperienceEntry = {
  company: string;
  role: string;
  start: string;
  end: string;
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
    "Software developer & security specialist building secure, well-crafted web platforms — backend-first, with a soft spot for clean UX.",
  location: "Oostende, Belgium",
  availability: "Available in Flanders (Belgium)",
  yearsExperience: 7,
  email: "stefvanremoortele@gmail.com",
  phone: "+32 474 019 394",
  calendly: "https://calendly.com/stefvanremoortele/15min",
  github: "https://github.com/StefVanremoortele",
  linkedin: "https://www.linkedin.com/in/stefvanremoortele/",
};

export const about = [
  "Most of my experience lies in developing web applications, with a primary focus on back-end development and infrastructure. Over time I've cultivated a real enthusiasm for client-side development and interface design — the psychology behind intuitive design, cognitive ease, and user experience as a whole.",
  "I'm passionate about building products and shipping new features, with a strong dedication to design patterns, clean code, and development workflow. I think a lot about how to streamline collaboration, documentation, testing, building, and deployment.",
  "My education in cybersecurity gives me a foundation for designing secure, reliable systems. I embed security principles throughout the development lifecycle rather than bolting them on at the end.",
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
    bullets: [
      "Provided high-level technical support and architectural oversight for active software projects — system stability, performance, alignment with business requirements.",
      "Spearheaded the integration of AI-driven coding tools and LLM workflows into the development lifecycle to accelerate delivery and modernize the engineering environment.",
    ],
    reference: "Jeffrey Drooghenbroodt (CEO)",
  },
  {
    company: "Roularta Media Group",
    role: "IT Security & Compliance Engineer",
    start: "Jul 2023",
    end: "Jan 2026",
    bullets: [
      "Improved security posture for a large media & advertising company, including an OT environment for magazine printing.",
      "Led application security and user-awareness campaigns; conditional access, IAM, and adherence to NIST / GDPR / NIS2 / ISO 27001/27005/27003.",
      "Restructured a legacy on-prem AD domain (insecure protocols, certificates, patching) and integrated it with Azure / Entra using OAuth, OpenID, SAML.",
      "Threat detection (STRIDE, threat modeling, code analysis, pentesting), risk assessment (CVSS / EPSS), and vulnerability management.",
      "Integrated SIEM and performed incident response with the SOC partner using Sentinel / Defender Advanced Hunting.",
    ],
    reference: "Oliver Martin (IT Security Manager)",
  },
  {
    company: "Zora Robotics",
    role: "Software Engineer",
    start: "Nov 2022",
    end: "Jul 2023",
    bullets: [
      "Built and maintained the back-end of a multi-tenant IoT platform on a gRPC microservices architecture.",
      "Designed for scale and fault-tolerance with replicated databases and multiple instances; HTTP and Kafka for inter-service communication.",
      "Strong emphasis on TDD with advanced stubbing/mocking; Agile delivery in a cross-functional team.",
    ],
    reference: "Wim Vanneste (CIO)",
  },
  {
    company: "NineID",
    role: "Software Engineer",
    start: "Jul 2021",
    end: "Sep 2022",
    bullets: [
      "Built a physical identity & access management system for a startup using facial recognition powered by Intel RealSense Depth and Tracking cameras — back-end plus management and end-user interfaces.",
      "Proof-of-concept work on AI mesh programming, BLE communication, and SCORM-based e-learning modules.",
      "Worked extensively in a bare Linux environment on Raspberry Pi devices for embedded deployment.",
    ],
    highlight: "Start-up experience",
    reference: "Frederik Keysers (CEO)",
  },
  {
    company: "Noordzee Helikopters Vlaanderen",
    role: "Software Engineer",
    start: "Nov 2020",
    end: "Jul 2021",
    bullets: [
      "Built a cross-platform web application for the management team and pilots of an international aviation company with multiple bases worldwide.",
      "Focused on UX consistency and platform compatibility for the operational realities of aviation.",
    ],
    reference: "Frederik Keysers (Teamlead)",
  },
  {
    company: "Easypost",
    role: "Software Engineer",
    start: "Nov 2018",
    end: "Sep 2020",
    bullets: [
      "Maintained and extended a PHP customer interface for mail tracking; built multi-threaded Python (Tkinter / PyQt) client-server apps for batch-processing handheld scanner data.",
      "Built an internal Python/Django + Angular platform integrating departments and streamlining business processes.",
      "Managed company network infrastructure: Active Directory, pfSense firewalls, OpenVPN, Veeam backups, Synology NAS; integrated specialized hardware (Pitney Bowes franking machines, Zebra printers).",
      "Led development independently before scaling the team, then mentored new members on project tech and architecture.",
      "Routine large-scale MS SQL operations via SSMS.",
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
