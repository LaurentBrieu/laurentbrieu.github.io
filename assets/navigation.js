const menuButton = document.querySelector('.mobile-menu-toggle');
const navigation = document.getElementById('main-navigation');

function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('[data-purpose="site-header"]')) closeMenu();
});
window.matchMedia('(min-width: 768px)').addEventListener('change', closeMenu);

const workLanguageLink = navigation.querySelector('[data-project-language]');
if (workLanguageLink) {
  const translatedPage = workLanguageLink.href;

  function linkToTranslatedProject() {
    const target = document.getElementById(location.hash.slice(1));
    const isProject = target?.matches('.portfolio-project, .reference-list li');
    workLanguageLink.href = translatedPage + (isProject ? location.hash : '');
  }

  window.addEventListener('hashchange', linkToTranslatedProject);
  linkToTranslatedProject();
}
