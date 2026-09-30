import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";
import { encryptPassword } from "../../services/passwordCrypto.js";

export default function Register() {
  const navigate = useNavigate(); const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async event => {
    event.preventDefault(); setError(""); setBusy(true);
    try { await api.post("/auth/signup", { ...form, password: await encryptPassword(form.password) }); navigate("/login", { state: { created: true } }); }
    catch (err) { setError(err.response?.data?.message || err.message || "Unable to create your account."); }
    finally { setBusy(false); }
  };
  return <main className="auth-page"><section className="auth-card"><Link className="brand-mark" to="/login">S</Link><p className="eyebrow">COME ON IN</p><h1>Make yourself at home.</h1><p className="muted">A good place for the things you want to remember.</p><form onSubmit={submit} className="auth-form"><label>Your name<input autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={80}/></label><label>Email address<input type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required/></label><label>Password<input type="password" autoComplete="new-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength={8} required/></label>{error && <p className="error-message">{error}</p>}<button className="primary-button" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button></form><p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p></section><aside className="auth-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-note">✿</div><p>Find your people.<br/><em>Keep the good bits.</em></p><span>A SMALL SPACE TO SHARE</span></aside></main>;
}
