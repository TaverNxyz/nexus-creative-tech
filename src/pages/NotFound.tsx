import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./NotFound.css";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="not-found-container">
      <div className="browser-window">
        {/* Browser Controls */}
        <div className="browser-controls">
          <div className="control-buttons">
            <div className="control-btn control-btn-red"></div>
            <div className="control-btn control-btn-yellow"></div>
            <div className="control-btn control-btn-green"></div>
          </div>
          <div className="browser-icons">
            <div className="browser-icon icon-pinterest"></div>
            <div className="browser-icon icon-exclamation"></div>
            <div className="browser-icon icon-plus"></div>
          </div>
        </div>

        {/* Browser Tab */}
        <div className="browser-tab">
          <span className="tab-text">Where R U?</span>
        </div>

        {/* Address Bar */}
        <div className="address-bar">
          <span className="url-text">http://www.find.me</span>
          <div className="search-icon">🔍</div>
        </div>

        {/* Browser Content */}
        <div className="browser-content">
          <div className="error-content">
            <div className="error-text">
              <div className="error-404">404</div>
              <div className="error-label">ERROR!</div>
            </div>
            
            <div className="door-container">
              <div className="door">
                <div className="door-knob"></div>
              </div>
              <div className="ghost">
                <div className="ghost-body">
                  <div className="ghost-eye ghost-eye-left"></div>
                  <div className="ghost-eye ghost-eye-right"></div>
                  <div className="ghost-mouth"></div>
                </div>
              </div>
            </div>

            <div className="no-one-text">No one is here!</div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="not-found-actions">
        <button
          onClick={() => navigate('/')}
          className="action-btn action-btn-primary"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="action-btn action-btn-secondary"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
