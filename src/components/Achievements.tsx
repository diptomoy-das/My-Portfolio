import "./styles/Achievements.css";
import { FaTrophy, FaBriefcase, FaAward } from "react-icons/fa6";

const Achievements = () => {
  const achievements = [
    { title: "YESIST 2024-25", detail: "Honourable Mention" },
    { title: "ETH Mumbai 2026", detail: "Finalist" },
    { title: "Kshitij IIT KGP", detail: "B-Plan Finalist" },
    { title: "East India Blockchain Summit", detail: "Finalist" },
    { title: "PHYCATHON 2024", detail: "1st Place (out of 103 teams)" },
    { title: "Central India Hackathon 2025", detail: "5th Place (out of 1000 teams)" },
    { title: "Smart India Hackathon", detail: "Participant" },
  ];

  const experience = [
    { title: "Website Creator", detail: "SSO Olympiad / IEEE Converge 2026" },
    { title: "NIDAR Drone Challenge", detail: "Extended Team Member" },
    { title: "Smart Maker's Festival 2024", detail: "5 Project Showcases" },
  ];

  return (
    <div className="achievements-section section-container" id="achievements">
      <div className="achievements-container">
        <h2>
          Achievements <span>&</span> <br />
          Experience
        </h2>
        <div className="achievements-grid">
          <div className="achievements-column">
            <h3 className="column-title">
              <FaTrophy className="title-icon" /> Key Achievements
            </h3>
            <div className="achievements-list">
              {achievements.map((item, idx) => (
                <div key={idx} className="achievement-item" data-cursor="disable">
                  <div className="item-bullet"><FaAward /></div>
                  <div className="item-content">
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="achievements-column">
            <h3 className="column-title">
              <FaBriefcase className="title-icon" /> Experience & Roles
            </h3>
            <div className="achievements-list">
              {experience.map((item, idx) => (
                <div key={idx} className="achievement-item" data-cursor="disable">
                  <div className="item-bullet"><FaAward /></div>
                  <div className="item-content">
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
