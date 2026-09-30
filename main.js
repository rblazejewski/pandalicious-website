// Waitlist signup. Posts to the join_waitlist() database function
// (PanDalicious/supabase/migrations/20260930120000_waitlist_signups.sql).
// The publishable key is the same public key the app ships with; RLS is what
// protects the data. join_waitlist() only adds an address and never returns
// the list, and the table itself is closed to this key.
const SUPABASE_URL = 'https://qrkhjntxrfcchzbpitss.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_FxV8FKy0VdNux4ySyQFYoA_tOj55__R';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const form = document.querySelector('.waitlist-form');
const status = document.querySelector('.form-status');

function showStatus(message, kind) {
  status.textContent = message;
  status.classList.toggle('is-error', kind === 'error');
  status.classList.toggle('is-success', kind === 'success');
}

if (form && status) {
  const emailInput = form.querySelector('input[name="email"]');
  const honeypot = form.querySelector('input[name="website"]');
  const button = form.querySelector('button[type="submit"]');

  emailInput.addEventListener('input', () => emailInput.removeAttribute('aria-invalid'));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();

    // Bots fill every field; pretend it worked so they move on.
    if (honeypot.value) {
      showStatus("You're on the list! We'll be in touch.", 'success');
      form.reset();
      return;
    }

    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      emailInput.setAttribute('aria-invalid', 'true');
      showStatus('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }

    button.disabled = true;
    button.textContent = 'Joining…';
    showStatus('', null);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/join_waitlist`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signup_email: email, signup_source: 'website' }),
      });

      if (response.ok) {
        showStatus("You're on the list! We'll be in touch.", 'success');
        form.reset();
        return;
      }

      // 22023 is the function's own "invalid email" error; anything else is on us.
      const body = await response.json().catch(() => null);
      if (body && body.code === '22023') {
        emailInput.setAttribute('aria-invalid', 'true');
        showStatus('Please enter a valid email address.', 'error');
      } else {
        console.error('Waitlist signup failed', response.status, body);
        showStatus('Something went wrong on our side. Please try again in a moment.', 'error');
      }
    } catch (error) {
      console.error('Waitlist signup failed', error);
      showStatus("Couldn't reach the server. Check your connection and try again.", 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Join the waitlist';
    }
  });
}
