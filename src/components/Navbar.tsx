import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    const clickHandlers: { element: HTMLAnchorElement; handler: (e: MouseEvent) => void }[] = [];
    const links = document.querySelectorAll(".header ul a, .navbar-name");
    
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      const handler = (e: MouseEvent) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          const section = element.getAttribute("data-href");
          if (section) {
            smoother.scrollTo(section, true, "top top");
          }
        }
      };
      element.addEventListener("click", handler);
      clickHandlers.push({ element, handler });
    });

    const handleResize = () => {
      ScrollSmoother.refresh(true);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clickHandlers.forEach(({ element, handler }) => {
        element.removeEventListener("click", handler);
      });
    };
  }, []);
  return (
    <>
      <div className="header">
        <div className="navbar-brand">
          <a href="/#" className="navbar-title" data-cursor="disable">
            <img src="/images/logo.jpg" alt="Logo" className="navbar-logo-img" />
          </a>
          <a
            href="#about"
            data-href="#about"
            className="navbar-name"
            data-cursor="disable"
          >
            Diptomoy Das
          </a>
        </div>
        <a
          href="mailto:diptomoydas20@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          diptomoydas20@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#achievements" href="#achievements">
              <HoverLinks text="ACHIEVEMENTS" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
