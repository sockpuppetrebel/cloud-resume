// Jason Slater's Resume Data
// This is the source of truth for the chatbot - ONLY FACTUAL INFORMATION

const resumeData = {
  name: "Jason Slater",
  title: "System Administrator",
  company: "Optimizely",
  location: "Remote (Pacific Northwest)",
  email: "jasslater11@gmail.com",
  website: "slater.cloud",
  github: "github.com/sockpuppetrebel",
  tagline: "Learning by pain since 1992",
  
  summary: "Cloud-focused Systems Administrator with 5+ years automating enterprise infrastructure and deploying scalable cloud solutions. Expert in PowerShell automation, Azure architecture, and implementing AI-powered IT solutions. Demonstrated ability to design secure network architectures, implement CI/CD pipelines, and optimize cloud costs while maintaining 99.9% uptime.",
  
  currentRole: {
    title: "System Administrator",
    company: "Optimizely",
    location: "Remote",
    duration: "Oct 2021 - Present",
    achievements: [
      "Supported the enterprise rollout of Microsoft Copilot, assisting with deployment planning, user access controls, and hands-on enablement across departments",
      "Provided training, documentation, and real-time support to ensure smooth Copilot adoption",
      "Continue to assist in the ongoing effort to fully break down and migrate our complex hybrid environment, which has grown increasingly tangled due to multiple acquisitions and legacy on-prem applications",
      "Contributed to infrastructure patching workflows using Ansible, Jenkins, and Git to support automated updates across Windows server environments",
      "Previously worked in the MSP division managing server fleets for multi-tenant clients, including critical response and recovery efforts",
      "Spearheaded Intune and Jamf integration to streamline cross-platform device management",
      "Mentor junior admins through sandbox environments, process docs, and secure access onboarding"
    ]
  },
  
  previousRoles: [
    {
      title: "Field Tech",
      company: "Andersen/Robert Half",
      duration: "Jun 2021 - Oct 2021",
      highlights: [
        "Supported thousands of PCs, tablets, and printers in all corporate, remote, and production environments within Andersen",
        "Scheduled 24/7 on-call support responsibilities for all production facilities nationwide",
        "Specialized in P1 printer and engineering station incidents at the Bayport facility"
      ]
    },
    {
      title: "Level 3 Deskside Support",
      company: "Ameriprise Financial",
      duration: "Sep 2019 - Jun 2021",
      highlights: [
        "Designed custom AppleScripts to automate routine macOS processes during cloud onboarding",
        "Resolved escalated technical issues across Mac and Windows systems",
        "Led technical aspects of 10,000-user M365 migration with zero data loss",
        "Mentored team of 8 L1/L2 technicians on cloud-first troubleshooting"
      ]
    }
  ],
  
  projects: [
    {
      name: "Cloud Resume Challenge - Enterprise Azure Implementation",
      year: "2024-2025",
      description: "Enterprise-grade cloud resume with AI chatbot",
      achievements: [
        "Architected auto-scaling static web app with custom domain, achieving 100ms global response times",
        "Implemented OpenAI-powered chatbot using Azure Functions with proper CORS handling",
        "Designed enterprise VNet with 4-tier subnet architecture and NSG security rules",
        "Built zero-downtime CI/CD pipeline with staging/production environments",
        "Reduced monthly hosting costs by 75% through resource optimization"
      ],
      technologies: ["Azure Static Web Apps", "Azure Functions", "GitHub Actions", "OpenAI API", "JavaScript"]
    },
    {
      name: "PowerShell Automation Toolkit",
      description: "Comprehensive collection of enterprise PowerShell scripts",
      achievements: [
        "Built scripts for Microsoft 365, Azure, and security administration",
        "Includes compliance assessment, cost optimization, and governance automation tools",
        "12+ scripts, SOC2 compliant, enterprise-grade"
      ],
      technologies: ["PowerShell", "Microsoft Graph API", "Azure AD", "Microsoft 365"]
    }
  ],
  
  skills: {
    cloudPlatforms: ["AWS (SA-C02 certified)", "Azure", "Static Web Apps", "VNet Architecture"],
    automation: ["PowerShell", "Ansible", "Terraform", "Azure CLI"],
    devops: ["GitHub Actions", "Jenkins", "Docker"],
    ai: ["OpenAI GPT", "Azure Functions", "Chatbot Development"],
    saas: ["Microsoft 365", "G Suite", "Zoom", "Jira", "Artifactory"]
  },
  
  certifications: [
    {
      name: "AWS Solutions Architect Associate",
      code: "SA-C02",
      status: "Active"
    },
    {
      name: "AWS Cloud Practitioner", 
      code: "CLF-C01",
      status: "Active"
    },
    {
      name: "Azure Fundamentals",
      status: "In Progress"
    }
  ],
  
  education: [
    {
      school: "Montana State University",
      degree: "B.S. Computer Science (Coursework)",
      status: "Coursework Completed"
    },
    {
      credential: "FAA Private Pilot License",
      status: "Active"
    }
  ],
  
  interests: [
    "Cloud architecture and automation",
    "AI/ML integration in IT operations",
    "Pacific Northwest outdoor activities",
    "Aviation (Private pilot)",
    "Adrenaline activities"
  ]
};

module.exports = resumeData;