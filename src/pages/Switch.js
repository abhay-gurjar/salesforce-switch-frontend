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
  const [error, setError] = useState("");

  // 🔹 NEW STATES FOR FILTERING
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadRules = async () => {
    setError("");
    try {
      const res = await getValidationRules();
      setRules(
        res.data.map((r) => ({
          name: r.ValidationName,
          active: r.Active,
        }))
      );
      setLoaded(true);
    } catch (err) {
      if (err?.response?.status === 401) {
        window.location.replace("/");
      } else {
        setError("Unable to load validation rules. Please try again.");
      }
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
    setRules([]);
    setLoaded(false);
    window.location.replace("/");
  };

  // 🔹 FILTER LOGIC (CORE PART)
  const filteredRules = rules.filter((rule) => {
    // Search by rule name
    if (
      searchText &&
      !rule.name.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (statusFilter === "Active" && !rule.active) {
      return false;
    }

    if (statusFilter === "Inactive" && rule.active) {
      return false;
    }

    return true;
  });

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

          {error && <p className="error-text">{error}</p>}

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

          <p className="rules-description">
            Review and manage Account validation rules from a centralized
            interface.
            <br />
            Toggle rules on or off and deploy changes directly to Salesforce.
          </p>

          {/* 🔹 FILTER UI */}
          <div className="rules-filters">
            <input
              type="text"
              placeholder="Search rule name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {filteredRules.length === 0 && (
            <div className="empty-state">
              No validation rules match the selected filters.
            </div>
          )}

          {filteredRules.length > 0 && (
            <div className="rules-table">
              <div className="rules-header">
                <span>Rule Name</span>
                <span>Status</span>
              </div>

              {filteredRules.map((r) => (
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
                  setRules((prev) =>
                    prev.map((r) =>
                      filteredRules.some((f) => f.name === r.name)
                        ? { ...r, active: true }
                        : r
                    )
                  )
                }
              />

              <Button
                text="Disable All"
                variant="primary"
                onClick={() =>
                  !deploying &&
                  setRules((prev) =>
                    prev.map((r) =>
                      filteredRules.some((f) => f.name === r.name)
                        ? { ...r, active: false }
                        : r
                    )
                  )
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
