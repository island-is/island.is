// Fallback auto-submit for the 3DS form when the gateway does not provide its
// own script (scriptPath). The form id matches what the gateway script expects.
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('webform0').submit()
})
