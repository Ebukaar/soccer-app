import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function FooterSection() {
  return (
    <div className="footer-container">
     

      {/* footer links */}
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Contact Us</h2>
            <Link to="/"> Contact </Link>
            <Link to="/"> Support </Link>
            <Link to="/"> Sponsorship </Link>
            {/* <Link to="/"> Influencer </Link> */}
          </div>
          {/* <div className="footer-link-items">
            <h2>Social Media</h2>
            <Link to="/"> Instagram </Link>
            <Link to="/"> Facebook </Link>
            <Link to="/"> Youtube </Link>
            <Link to="/"> Twitter </Link>
          </div> */}
        </div>

        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Follow Us</h2>
            <Link to="/"> Facebook </Link>
            <Link to="/"> Instagram </Link>
            <Link to="/"> YouTube</Link>
            <Link to="/"> Twitter </Link>
          </div>
          {/* <div className="footer-link-items">
            <h2>Contact Us</h2>
            <Link to="/"> Contact </Link>
            <Link to="/"> Support </Link>
            <Link to="/"> Destinations </Link>
            <Link to="/"> Sponsorships </Link>
          </div> */}
        </div>
      </div>

      {/* social media section */}
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/" className="social-logo">
              Champs&nbsp;
              <i className="fa-solid fa-trophy"></i>
            </Link>
          </div>
          {/* end footer logo */}
          {/* <small className="website-rights">Champs &copy; 2022</small> */}
          {/* Copyright end */}

          <div className="social-icons">
            <Link className="social-icon-link facebook" to='/' target='_blank' aria-label='Facebook'>
                <i className="fab fa-facebook-f"></i>
            </Link>
            <Link className="social-icon-link instagram" to='/' target='_blank' aria-label='instagram'>
                <i className="fab fa-instagram"></i>
            </Link>
            <Link className="social-icon-link youtube" to='/' target='_blank' aria-label='youtube'>
                <i className="fab fa-youtube"></i>
            </Link>
            <Link className="social-icon-link twitter" to='/' target='_blank' aria-label='twitter'>
                <i className="fab fa-twitter"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FooterSection;
