import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const projects = [
  {
    name: "MindPal",
    category: "VR Application",
    tools: "Next.js, React, Three.js, VR",
    description: "VR solution supporting social & cognitive development of autistic children through immersive inclusive technology.",
    image: "/images/mindpal.png",
    liveLink: "https://mindpal222.vercel.app/",
    githubLink: "https://github.com/debojyoti10CC/mindpal222"
  },
  {
    name: "Xencruit",
    category: "AI Web App",
    tools: "MediaPipe, YOLOv8, OpenCV",
    description: "AI-powered interview confidence meter analyzing facial expressions, posture & blink rate.",
    image: "/images/xencruit.png",
    liveLink: "https://xencruit.vercel.app/",
    githubLink: "https://github.com/debojyoti10CC/Xencruit"
  },
  {
    name: "Axylos",
    category: "Decentralized AI",
    tools: "Web3, HTTP 402, AI Agents",
    description: "Decentralized prototype for autonomous AI agent economy with P2P service discovery, negotiation & HTTP 402 micropayments.",
    image: "/images/axylos.png",
    liveLink: "https://axylos-new-24rq-7osr4dsmb-diptomoys-projects.vercel.app/",
    githubLink: "https://github.com/debojyoti10CC/axylosfirstdraft"
  },
  {
    name: "Aegis",
    category: "AI & Blockchain",
    tools: "Multi-agent AI pipelines, computer vision, Docker orchestration, and Redis message queues drive automated verification and blockchain fund distribution",
    description: "Detect, verify, fund.",
    image: "/images/aegis.png",
    liveLink: "https://aegis-front.vercel.app/",
    githubLinks: [
      { label: "Dashboard GitHub", url: "https://github.com/debojyoti10CC/aegis-dashboard" },
      { label: "Frontend GitHub", url: "https://github.com/debojyoti10CC/Aegis-front.git" }
    ]
  },
  {
    name: "HealthChain",
    category: "Blockchain Medical",
    tools: "Celo blockchain, Web3",
    description: "Decentralized medical record management on Celo blockchain — patients securely store & share records via a single verifiable transaction.",
    image: "/images/healthchain.png",
    liveLink: "https://health-chain-final.vercel.app/",
    githubLink: "https://github.com/diptomoy-das/HealthChain-final"
  },
  {
    name: "BondFi",
    category: "DeFi App",
    tools: "Stellar, USDC, Soroban",
    description: "Decentralized app on Stellar for fractional ownership of government bonds using USDC & Soroban smart contracts.",
    image: "/images/bondfi.png",
    githubLink: "https://github.com/diptomoy-das/BondFi"
  },
  {
    name: "Carbon Credit",
    category: "ML / Data Science",
    tools: "Sentinel-2, Random Forest",
    description: "Uses Sentinel-2 satellite imagery & Random Forest classifier to automate mangrove ecosystem identification.",
    image: "/images/carboncredit.png",
    liveLink: "https://drive.google.com/file/d/1bjQeE0-jlzWTG2i-pFDmM5E-aaUP_2ii/view?usp=sharing",
    liveLinkLabel: "Project Report"
  }
];

const Work = () => {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getTranslateX = () => {
        const box = document.getElementsByClassName("work-box");
        if (!box.length) return 0;
        const workContainer = document.querySelector(".work-container");
        if (!workContainer) return 0;
        const rectLeft = workContainer.getBoundingClientRect().left;
        const rect = box[0].getBoundingClientRect();
        const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
        const padding = parseInt(window.getComputedStyle(box[0]).padding) / 2;
        return rect.width * box.length - (rectLeft + parentWidth) + padding;
      };

      let timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: () => `+=${getTranslateX()}`, // Use actual scroll width dynamically
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          id: "work",
        },
      });

      timeline.to(".work-flex", {
        x: () => -getTranslateX(),
        ease: "none",
      });
    });

    // Clean up
    return () => {
      mm.revert();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
                
                {(project.liveLink || project.githubLink || ('githubLinks' in project && project.githubLinks)) && (
                  <div className="work-project-links">
                    {project.liveLink && (
                      <a href={project.liveLink} className="live-link" target="_blank" rel="noreferrer" data-cursor="disable">
                        {project.liveLinkLabel || "Live Demo"} <MdArrowOutward />
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} className="github-link" target="_blank" rel="noreferrer" data-cursor="disable">
                        <FaGithub /> GitHub
                      </a>
                    )}
                    {'githubLinks' in project && project.githubLinks && (project.githubLinks as any[]).map((link: any, idx: number) => (
                      <a key={idx} href={link.url} className="github-link" target="_blank" rel="noreferrer" data-cursor="disable">
                        <FaGithub /> {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <WorkImage image={project.image} alt={project.name} link={project.liveLink || project.githubLink || ('githubLinks' in project && project.githubLinks ? (project.githubLinks as any[])[0]?.url : '')} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
