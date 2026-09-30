import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";
import { encryptPassword } from "../../services/passwordCrypto.js";
import { localStorageSetItem } from "../../utils/storage.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async event => {
    event.preventDefault(); setError(""); setBusy(true);
    try { const { data } = await api.post("/auth/login", { email, password: await encryptPassword(password) }); localStorageSetItem("TOKEN", data.jwtToken); navigate("/feed"); }
    catch (err) { setError(err.response?.data?.message || err.message || "Unable to sign in. Try again."); }
    finally { setBusy(false); }
  };
  return <main className="auth-page"><section className="auth-card"><div className="brand-mark">S</div><p className="eyebrow">YOUR LITTLE CORNER OF THE INTERNET</p><h1>Welcome back.</h1><p className="muted">Pick up where your people left off.</p>
    <form onSubmit={submit} className="auth-form"><label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required /></label>{error && <p className="error-message">{error}</p>}<button className="primary-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form>
    <p className="auth-switch">New around here? <Link to="/register">Create an account</Link></p></section><aside className="auth-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-note">✳</div><p>Little moments.<br/><em>Shared together.</em></p><span>MAKE ROOM FOR GOOD THINGS</span></aside></main>;
}
