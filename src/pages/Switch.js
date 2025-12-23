import { useState } from "react";
import { logout, getValidationRules, deployChanges } from "../api/salesforce";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import "../styles/switch.css";

export default function Switch() {
  const [rules, setRules] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadRules = async () => {
    const res = await getValidationRules();
    setRules(
      res.data.map((r) => ({
        name: r.ValidationName,
        active: r.Active,
      }))
    );
    setLoaded(true);
  };

  const toggleRule = (name) => {
    setRules((prev) =>
      prev.map((r) =>
        r.name === name ? { ...r, active: !r.active } : r
      )
    );
  };

  const enableAll = () => {
    setRules((prev) => prev.map((r) => ({ ...r, active: true })));
  };

  const disableAll = () => {
    setRules((prev) => prev.map((r) => ({ ...r, active: false })));
  };

  const deploy = async () => {
    await deployChanges(rules);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleLogout = async () => {
    await logout();
    window.location.replace("/");
  };

  return (
    <div className="switch-container">
      {!loaded && (
        <div className="switch-card">
          <h1 className="switch-title">Salesforce Switch</h1>

          <p className="switch-description">
            Fetch and manage validation rules from your Salesforce org.
            <br />
            Enable, disable and deploy changes securely.
          </p>

          <div className="switch-actions">
            <Button
              text="Logout"
              variant="secondary"
              onClick={handleLogout}
            />
            <Button
              text="Get Validation Rules"
              variant="primary"
              onClick={loadRules}
            />
          </div>
        </div>
      )}

      {loaded && (
        <div className="rules-container">
          <h2 className="rules-heading">Validation Rules</h2>

          <div className="rules-table">
            <div className="rules-header">
              <span>Rule Name</span>
              <span>Status</span>
            </div>

            {rules.map((r) => (
              <div className="rules-row" key={r.name}>
                <span className="rule-name">{r.name}</span>
                <Toggle
                  checked={r.active}
                  onChange={() => toggleRule(r.name)}
                />
              </div>
            ))}
          </div>

          <div className="rules-footer">
            <div className="rules-footer-left">
              <Button text="Enable All" onClick={enableAll} />
              <Button text="Disable All" onClick={disableAll} />
            </div>

            <div className="rules-footer-right">
              <Button
                text="Deploy Changes"
                variant="primary"
                onClick={deploy}
              />
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="deploy-overlay">
          <div className="deploy-success-box">
            <h3>Deployment Successful</h3>
            <p>Validation rules updated in Salesforce.</p>
          </div>
        </div>
      )}
    </div>
  );
}
