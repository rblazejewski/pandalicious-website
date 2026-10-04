// Sign-up confirmation landing page. Supabase redirects here from the confirmation
// email: on success the URL fragment carries the new session's tokens, on failure
// it (or the query string) carries `error`. The site doesn't use the session, so
// read the outcome and strip the URL straight away.
const hashParams = new URLSearchParams(window.location.hash.slice(1));
const queryParams = new URLSearchParams(window.location.search);
const linkFailed = hashParams.has('error') || queryParams.has('error');

if (window.location.hash || window.location.search) {
  history.replaceState(null, '', window.location.pathname);
}

if (linkFailed) {
  document.getElementById('confirmed').hidden = true;
  document.getElementById('link-failed').hidden = false;
}
