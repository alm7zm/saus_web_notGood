export function initVehicle() {
  const tabs   = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

  if (!tabs.length) return;

  function activateTab(tab) {
    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('tab--active');
      t.tabIndex = -1;
    });
    panels.forEach(p => { p.hidden = true; });

    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('tab--active');
    tab.tabIndex = 0;

    const panelId = tab.getAttribute('aria-controls');
    const panel   = document.getElementById(panelId);
    if (panel) panel.hidden = false;
  }

  tabs.forEach((tab, i) => {
    // Initial tabindex — only active tab in tab order
    tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;

    tab.addEventListener('click', () => {
      activateTab(tab);
      tab.focus();
    });

    tab.addEventListener('keydown', e => {
      let targetIdx = null;
      if (e.key === 'ArrowRight') targetIdx = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft')  targetIdx = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home')       targetIdx = 0;
      if (e.key === 'End')        targetIdx = tabs.length - 1;

      if (targetIdx !== null) {
        e.preventDefault();
        activateTab(tabs[targetIdx]);
        tabs[targetIdx].focus();
      }
    });
  });
}
