import { useEffect, useState } from "react";
import {
  logout,
  getValidationRules,
  deployChanges,
  me,
} from "../api/salesforce";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import "../styles/switch.css";

export default function Switch() {
  const [rules, setRules] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    me().catch(() => {
      window.location.href = "/";
    });
  }, []);

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
          {rules.map((r) => (
            <div className="rules-row" key={r.name}>
              <span>{r.name}</span>
              <Toggle
                checked={r.active}
                onChange={() => toggleRule(r.name)}
              />
            </div>
          ))}

          <Button
            text={deploying ? "Deploying..." : "Deploy Changes"}
            onClick={deploy}
          />
        </div>
      )}

      {success && (
        <div className="deploy-overlay">
          <div className="deploy-success-box">
            Deployment Successful
          </div>
        </div>
      )}
    </div>
  );
}
