// ============================================================
// Enerlysis — Sprint inquiry form handler (Web3Forms)
//
// SETUP (one-time, only edit this file):
//   1. Go to https://web3forms.com
//   2. Enter info@enerlysisx.com → click "Create Access Key"
//   3. Replace the value below with the key you receive
// ============================================================

const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'; // ← paste your key here

// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('sprint-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const successEl = document.getElementById('form-success');
  const errorEl   = document.getElementById('form-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    if (errorEl) errorEl.style.display = 'none';

    // Build form data and inject key here (overrides any HTML value)
    const formData = new FormData(form);
    formData.set('access_key', WEB3FORMS_KEY);
    formData.set('botcheck', ''); // honeypot must be empty

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        form.style.display = 'none';
        if (successEl) successEl.style.display = 'flex';
      } else {
        throw new Error(data.message || 'Unknown error from Web3Forms');
      }
    } catch (err) {
      console.error('Web3Forms error:', err);
      if (errorEl) {
        const msg = errorEl.querySelector('p');
        if (msg) msg.innerHTML = `Sending failed: <em>${err.message}</em>. Please email us directly at <a href="mailto:info@enerlysisx.com">info@enerlysisx.com</a>`;
        errorEl.style.display = 'block';
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send inquiry';
    }
  });
});
