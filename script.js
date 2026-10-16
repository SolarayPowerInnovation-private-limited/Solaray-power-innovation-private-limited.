const toggle = document.getElementById('navToggle');
const menu = document.getElementById('navMenu');

toggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('enquiryForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const fields = [
    'Hello Solaray Power Innovations Private Limited,',
    '',
    'I would like to enquire about a solar solution.',
    'Name: ' + String(data.get('name') || '').trim(),
    'Phone: ' + String(data.get('phone') || '').trim(),
    'Interested in: ' + String(data.get('interest') || '').trim(),
    data.get('location') ? 'Project location: ' + String(data.get('location')).trim() : '',
    data.get('details') ? 'Details: ' + String(data.get('details')).trim() : ''
  ].filter(Boolean);
  document.getElementById('formStatus').textContent = 'Opening WhatsApp. Please review your message and tap Send.';
  window.open('https://wa.me/919366495875?text=' + encodeURIComponent(fields.join('\n')), '_blank', 'noopener,noreferrer');
});
