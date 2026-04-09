// Encode invite data directly in the URL — no backend needed.
// The invite ID IS the data, base64 encoded in the URL hash.

export function createInvite(sender, type, duration) {
  const data = JSON.stringify({ s: sender, t: type, d: duration });
  const encoded = btoa(unescape(encodeURIComponent(data)));
  return encoded;
}

export function readInvite(encoded) {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    return { sender: data.s, type: data.t, duration: data.d };
  } catch (e) {
    return null;
  }
}

export function getInviteFromURL() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("i");
  if (!code) return null;
  return readInvite(code);
}

export function buildInviteURL(encoded) {
  const base = window.location.origin + window.location.pathname;
  return `${base}?i=${encoded}`;
}
