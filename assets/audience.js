(() => {
  const id = 'G-0ZQ6D1E8JV';
  const key = 'lb-audience-consent-v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  const panel = document.getElementById('audience-consent');
  const preferences = document.getElementById('audience-preferences');
  const accept = panel.querySelector('[data-accept]');
  const refuse = panel.querySelector('[data-refuse]');
  let started = false;

  function readChoice() {
    try {
      const choice = JSON.parse(localStorage.getItem(key));
      if (choice && choice.expires > Date.now()) return choice.value;
    } catch {
      // Storage may be unavailable in private browsing or with restrictive settings.
    }
    return null;
  }

  function startAnalytics() {
    if (started || location.hostname !== 'laurentbrieu.github.io') return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }

    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    gtag('js', new Date());
    gtag('config', id, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 15552000,
      cookie_update: false
    });

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(tag);
  }

  function choose(value) {
    let saved = false;
    try {
      localStorage.setItem(key, JSON.stringify({ value, expires: Date.now() + maxAge }));
      saved = true;
    } catch {
      // Apply the choice to this page even when storage is unavailable.
    }

    const returnFocus = panel.contains(document.activeElement);
    panel.hidden = true;
    preferences.setAttribute('aria-expanded', 'false');
    if (returnFocus) preferences.focus();

    if (value === 'allow' && !started) startAnalytics();
    if (value === 'deny' && started) {
      window['ga-disable-' + id] = true;
      for (const name of ['_ga', '_ga_' + id.slice(2)]) {
        const expires = name + '=; Max-Age=0; Path=/; SameSite=Lax; Secure';
        document.cookie = expires;
        document.cookie = expires + '; Domain=' + location.hostname;
      }
      if (saved) location.reload();
    }
    if (value === 'allow') window['ga-disable-' + id] = false;
  }

  preferences.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    preferences.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) refuse.focus();
  });
  accept.addEventListener('click', () => choose('allow'));
  refuse.addEventListener('click', () => choose('deny'));
  preferences.hidden = false;

  const choice = readChoice();
  if (choice === 'allow') startAnalytics();
  if (!choice) {
    panel.hidden = false;
    preferences.setAttribute('aria-expanded', 'true');
  }
})();
