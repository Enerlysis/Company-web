// ============================================================
// Enerlysis — Sprint inquiry form handler (Web3Forms)
//
// SETUP (one-time):
//   1. Go to https://web3forms.com
//   2. Enter info@enerlysisx.com and click "Create Access Key"
//   3. Replace YOUR_WEB3FORMS_ACCESS_KEY below with the key you receive
// ============================================================

const WEB3FORMS_KEY = '7aa76f3b-0bfc-4cd5-874a-0f4de38a0055';

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('sprint-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const successEl = document.getElementById('form-success');
  const errorEl   = document.getElementById('form-error');

  // Inject the access key into the hidden field
  const keyInput = form.querySelector('[name="access_key"]');
  if (keyInput) keyInput.value = WEB3FORMS_KEY;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    if (errorEl) errorEl.style.display = 'none';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      });
      const data = await res.json();

      if (data.success) {
        form.style.display = 'none';
        if (successEl) successEl.style.display = 'flex';
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Form error:', err);
      if (errorEl) errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send inquiry';
    }
  });
});
