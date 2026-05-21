import { MdArrowOutward } from "react-icons/md";
import { FaGithub, FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:diptomoydas20@gmail.com" data-cursor="disable">
                diptomoydas20@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+916291682773" data-cursor="disable">
                +91 6291682773
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/diptomoy-das"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              <FaGithub /> <span>Github</span> <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/diptomoy-das-0776b5312/"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              <FaLinkedin /> <span>Linkedin</span> <MdArrowOutward />
            </a>
            <a
              href="https://x.com/Diptomoy20"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              <FaXTwitter /> <span>Twitter</span> <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/diptomoy_/?hl=en"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              <FaInstagram /> <span>Instagram</span> <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Diptomoy Das</span>
            </h2>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
