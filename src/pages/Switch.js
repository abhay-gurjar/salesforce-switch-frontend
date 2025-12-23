import { useState } from "react";
import { logout, getValidationRules, deployChanges } from "../api/salesforce";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import "../styles/switch.css";

export default function Switch() {
  const [rules, setRules] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadRules = async () => {
    const res = await getValidationRules();
    setRules(
      res.data.map(r => ({
        name: r.ValidationName,
        active: r.Active,
      }))
    );
    setLoaded(true);
  };

  const toggleRule = (name) => {
    setRules(prev =>
      prev.map(r =>
        r.name === name ? { ...r, active: !r.active } : r
      )
    );
  };

  const deploy = async () => {
    await deployChanges(rules);
    alert("Deployment Successful");
  };

  return (
    <div className="switch-container">
      {!loaded && (
        <div className="switch-card">
          <Button text="Logout" variant="secondary" onClick={logout} />
          <Button
            text="Get Validation Rules"
            variant="primary"
            onClick={loadRules}
          />
        </div>
      )}

      {loaded && (
        <>
          {rules.map(r => (
            <div key={r.name} className="rules-row">
              <span>{r.name}</span>
              <Toggle
                checked={r.active}
                onChange={() => toggleRule(r.name)}
              />
            </div>
          ))}

          <Button text="Deploy Changes" onClick={deploy} />
        </>
      )}
    </div>
  );
}
