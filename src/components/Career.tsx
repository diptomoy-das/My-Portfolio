import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My education <span>&</span>
          <br /> achievements
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Pursuing B.Tech CSE</h4>
                <h5>IEM Kolkata</h5>
              </div>
              <h3>Aug 2024 - Present</h3>
            </div>
            <p>
              Second-year B.Tech CSE student with a strong focus on Blockchain, AI/ML, VR, and Decentralized Systems.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Sr. Secondary - Science | 92%</h4>
                <h5>DPS Ruby Park</h5>
              </div>
              <h3>Mar 2022 - May 2024</h3>
            </div>
            <p>
              Completed Senior Secondary education with a focus on Science, achieving 92% in board examinations.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Secondary Education | 91%</h4>
                <h5>Nava Nalanda</h5>
              </div>
              <h3>Mar 2010 - May 2022</h3>
            </div>
            <p>
              Completed Secondary education, achieving 91% in board examinations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
