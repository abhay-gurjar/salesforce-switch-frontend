import { login } from "../api/salesforce";
import "../styles/login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Salesforce Login</h1>

        <p className="login-description">
          Login to Salesforce to manage Account validation rules.
        </p>

        <button className="login-button" onClick={login}>
          Login with Salesforce
        </button>
      </div>
    </div>
  );
}
