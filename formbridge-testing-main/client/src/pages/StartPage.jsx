import { useNavigate } from "react-router";
import { useContext } from "react";
import { GlobalContext } from "../GlobalContext.jsx";
import builders from "../assets/builders.png";
import formbridge from "../assets/formbridge_white_logotext.png";
import form from "../assets/form2.png";
import bridge from "../assets/bridge.png";
import frame from "../assets/frame2.png";

export default function StartPage() {
  const { user, logout } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <>
      <section className="placement">
        <div className="start-container">
          <nav className="start-navbar">
            <div className="start-logo">
              <img src={formbridge} alt="formbridge-logo" />
            </div>
            <div className="nav-links">
              <span
                onClick={() => (!user ? navigate("/customer") : navigate("/"))}
              >
                [Demo] Customer Forms
              </span>
              <span>About Us</span>
              <span>FAQ</span>
              <span>...</span>
            </div>
            {
              user ?
                <>
                  <div className="image-text">
                    <img src="../src/assets/agents_icon.png" />
                    <div className="nav-links">
                      <span onClick={() => navigate("/admin")}>{user.firstname} {user.lastname}</span>
                    </div>
                  </div>
                  <button className="sign-in-btn" onClick={logout}>
                    ← Sign Out
                  </button>
                </>
                :
                <button className="sign-in-btn" onClick={() => navigate("/login")}>
                  Sign In →
                </button>
            }
          </nav>

          <section className="hero-container">
            <div className="hero">
              <div className="hero-text">
                <h1 className="hero-title">
                  Bridge the gap between Customer Forms & Support Teams.
                </h1>
                <p className="hero-description">
                  FormBridge helps businesses streamline customer interactions
                  by seamlessly connecting online forms with dedicated Support
                  Teams. Our platform allows companies to create customizable
                  forms, automatically route customer inquiries to the right
                  Support Agents, and efficiently manage Support Tickets - all
                  in one place.
                </p>
                <button
                  className="cta-button"
                  onClick={() => navigate("/login")}
                >
                  Get Started For Free →
                </button>
              </div>
              <div className="hero-image">
                <img src={builders} alt="builders" />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="feature-container">
        <div className="features">
          <article className="feature">
            <div className="feature-icon">
              <img src={form} alt="form" />
            </div>
            <h3 className="feature-title">Create your Form</h3>
            <p className="feature-description">
              Design and publish forms tailored to your customer's needs
            </p>
          </article>

          <article className="feature">
            <div className="feature-icon">
              <img src={bridge} alt="form" />
            </div>
            <h3 className="feature-title">Let us be the bridge</h3>
            <p className="feature-description">
              Instantly connect customer responses to the right Support Team
            </p>
          </article>

          <article className="feature">
            <div className="feature-icon">
              <img src={frame} alt="form" />
            </div>
            <h3 className="feature-title">Your Customer Support</h3>
            <p className="feature-description">
              Manage, track and resolve Tickets efficiently <br />- All in one
              platform
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
