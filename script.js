const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('quoteForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get('fullName') || '').trim();
  const phone = String(form.get('phone') || '').trim();
  const project = String(form.get('projectType') || '').trim();
  const location = String(form.get('location') || '').trim();
  const message = String(form.get('message') || '').trim();

  const text = [
    'Hello Solaray Power Innovations Private Limited,',
    '',
    'I would like to enquire about solar solutions.',
    'Name: ' + name,
    'Phone: ' + phone,
    'Interested in: ' + project,
    location ? 'Project location: ' + location : '',
    message ? 'Details: ' + message : ''
  ].filter(Boolean).join('\n');

  document.getElementById('formStatus').textContent = 'Opening WhatsApp with your enquiry. Please review and press Send.';
  const whatsappUrl = 'https://wa.me/919366495875?text=' + encodeURIComponent(text);
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});
