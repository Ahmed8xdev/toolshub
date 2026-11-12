// Shared HTML encoding used when user supplied text must appear in templated markup.
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}
if (typeof module !== 'undefined' && module.exports) module.exports = { escapeHtml };
