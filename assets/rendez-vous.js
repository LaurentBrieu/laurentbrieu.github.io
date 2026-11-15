const bookingUrl = 'https://calendly.com/laurentbrieu/30min';
const widget = document.getElementById('calendly-widget');
const fallback = document.getElementById('calendly-fallback');
const widgetScript = document.createElement('script');

function showBookingError() {
  widget.hidden = true;
  fallback.hidden = false;
}

widgetScript.src = 'https://assets.calendly.com/assets/external/widget.js';
widgetScript.addEventListener('load', () => {
  if (!window.Calendly?.initInlineWidget) {
    showBookingError();
    return;
  }

  widget.hidden = false;
  window.Calendly.initInlineWidget({
    url: bookingUrl,
    parentElement: widget,
    resize: true,
  });

  const frame = widget.querySelector('iframe');
  if (!frame) {
    showBookingError();
    return;
  }

  frame.title = widget.dataset.frameTitle;
});
widgetScript.addEventListener('error', showBookingError);
document.head.append(widgetScript);
