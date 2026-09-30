const keyPromise = async () => {
  const secret = import.meta.env.VITE_LOGIN_ENCRYPTION_KEY;
  if (!secret) throw new Error("VITE_LOGIN_ENCRYPTION_KEY is not configured");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt"]);
};
export async function encryptPassword(password) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await keyPromise(), new TextEncoder().encode(password)));
  const packed = new Uint8Array(iv.length + cipher.length);
  packed.set(iv); packed.set(cipher, iv.length);
  return btoa(String.fromCharCode(...packed));
}
