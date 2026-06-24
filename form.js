// ============================================================
// Enerlysis — Sprint inquiry form handler
// Uses mailto: — no third-party service required.
// The visitor's email client opens with all fields pre-filled
// and sends directly to info@enerlysisx.com.
// ============================================================

const RECIPIENT = 'info@enerlysisx.com';

// Human-readable labels for each form field name
const FIELD_LABELS = {
  name:      'Name',
  email:     'Email',
  company:   'Company',
  challenge: 'Technical challenge',
  decision:  'Decision to make',
  timeline:  'Timeline',
  geometry:  'CAD geometry available',
  data:      'Data / documentation available',
};

// Fields to skip in the email body (meta / honeypot)
const SKIP_FIELDS = new Set(['access_key', 'botcheck', 'subject', 'sprint', 'from_name']);

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('sprint-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const successEl = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Opening email…';

    const data   = new FormData(form);
    const sprint = data.get('sprint')  || 'Sprint inquiry';
    const subject = 'Enerlysis inquiry — ' + sprint;

    // Build the email body from all visible form fields
    const lines = ['Sprint: ' + sprint, ''];

    for (const [key, value] of data.entries()) {
      if (SKIP_FIELDS.has(key) || !value.trim()) continue;
      const label = FIELD_LABELS[key] || key;
      if (value.includes('\n')) {
        lines.push(label + ':');
        lines.push(value.trim());
        lines.push('');
      } else {
        lines.push(label + ': ' + value.trim());
      }
    }

    const body   = lines.join('\n');
    const mailto = 'mailto:' + RECIPIENT
                 + '?subject=' + encodeURIComponent(subject)
                 + '&body='    + encodeURIComponent(body);

    // Open the email client
    window.location.href = mailto;

    // Show success state after a short delay
    setTimeout(function() {
      form.style.display = 'none';
      if (successEl) successEl.style.display = 'flex';
    }, 600);
  });
});
