import { useState } from "react";
import {
  logout,
  getValidationRules,
  deployChanges,
} from "../api/salesforce";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import "../styles/switch.css";

export default function Switch() {
  const [rules, setRules] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadRules = async () => {
    try {
      const res = await getValidationRules();
      setRules(
        res.data.map((r) => ({
          name: r.ValidationName,
          active: r.Active,
        }))
      );
      setLoaded(true);
    } catch {
      window.location.href = "/";
    }
  };

  const toggleRule = (name) => {
    if (deploying) return;
    setRules((prev) =>
      prev.map((r) =>
        r.name === name ? { ...r, active: !r.active } : r
      )
    );
  };

  const deploy = async () => {
    setDeploying(true);
    setSuccess(false);
    await deployChanges(rules);
    setDeploying(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="switch-container">
      {!loaded && (
        <div className="switch-card">
          <h1 className="switch-title">Salesforce Switch</h1>

          <p className="switch-description">
            Manage and control Account validation rules in your Salesforce
            organization from a single interface.
            <br />
            Enable, disable, and deploy rule changes securely using Salesforce
            Metadata APIs.
          </p>

          <div className="switch-actions">
            <Button text="Logout" variant="secondary" onClick={handleLogout} />
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

          {rules.length === 0 && (
            <div className="empty-state">
              No validation rules found for this Account object.
            </div>
          )}

          {rules.length > 0 && (
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
          )}

          <div className="rules-footer">
            <div className="rules-footer-left">
              <Button
                text="Enable All"
                variant="primary"
                onClick={() =>
                  !deploying &&
                  setRules((r) => r.map((x) => ({ ...x, active: true })))
                }
              />
              <Button
                text="Disable All"
                variant="primary"
                onClick={() =>
                  !deploying &&
                  setRules((r) => r.map((x) => ({ ...x, active: false })))
                }
              />
            </div>

            <div className="rules-footer-right">
              <Button
                text={deploying ? "Deploying..." : "Deploy Changes"}
                variant="primary"
                onClick={deploy}
              />
            </div>
          </div>
        </div>
      )}

      {deploying && (
        <div className="deploy-overlay">
          <div className="deploy-box">
            <div className="spinner" />
            <p>Deploying changes to Salesforce</p>
          </div>
        </div>
      )}

      {success && (
        <div className="deploy-overlay">
          <div className="deploy-success-box">
            <h3>Deployment Successful</h3>
            <p>Validation rules have been updated in Salesforce.</p>
          </div>
        </div>
      )}
    </div>
  );
}
