export const ROUTES = ["/", "/terms", "/privacy", "/dashboard", "/admin"] as const;

// When the app is not served from the domain root (preview sandboxes, subfolders,
// or a direct index.html file) clean pushState paths would break on reload,
// so the router transparently falls back to hash routing.
export const usesHashRouting = !ROUTES.includes(window.location.pathname as (typeof ROUTES)[number]);

export function readPath(): string {
  const hash = window.location.hash;
  if (hash.startsWith("#/")) {
    const candidate = `/${hash.slice(2).split(/[?#]/)[0]}`;
    return ROUTES.includes(candidate as (typeof ROUTES)[number]) ? candidate : "/";
  }
  const { pathname } = window.location;
  return ROUTES.includes(pathname as (typeof ROUTES)[number]) ? pathname : "/";
}

export function writePath(destination: string) {
  const nextPath = destination.split("#")[0] || readPath();
  if (usesHashRouting) {
    window.location.hash = `#${nextPath}`;
    return nextPath;
  }
  try {
    window.history.pushState({}, "", destination);
  } catch {
    window.location.hash = `#${nextPath}`;
  }
  return nextPath;
}

export function setAuthIntent(mode: "login" | "signup") {
  try {
    window.sessionStorage.setItem("prime-polo-auth-mode", mode);
  } catch {
    /* storage unavailable */
  }
}

export function takeAuthIntent(): "login" | "signup" {
  try {
    const stored = window.sessionStorage.getItem("prime-polo-auth-mode");
    window.sessionStorage.removeItem("prime-polo-auth-mode");
    return stored === "signup" ? "signup" : "login";
  } catch {
    return "login";
  }
}
