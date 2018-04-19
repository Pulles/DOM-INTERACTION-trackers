import danoneFramework from '../settings';

class ValtTagManager {
  constructor() {
    this.allDmElements = Array.from(document.querySelectorAll('[data-dm]'));
    this.allDmComponents = Array.from(document.querySelectorAll('[data-dm^="component"]'));
    this.viewedComponents = [];
    this.viewTrackElement = [];
    this.eventArray = [];
    this.TMScallbacks = [];
    this.pageloadTimestamp = Date.now();
  }

  init(newDMElements) {

    if (newDMElements) {
      this.components = Array.from(newDMElements).filter(dm => dm.dataset.dm.includes('component'));
      this.elements = Array.from(newDMElements).filter(dm => dm.dataset.dm.includes('component') === false);

    } else {
      this.elements = this.allDmElements;
      this.components = this.allDmComponents;
    }

    this.elements.forEach((dm) => {
      // Add events.
      if ((dm.nodeName === 'INPUT' || dm.nodeName === 'TEXTAREA') && (dm.getAttribute('type') !== 'submit' && dm.getAttribute('type') !== 'button' && dm.getAttribute('type') !== 'checkbox' && dm.getAttribute('type') !== 'radio')) {
      dm.addEventListener('blur', (event) => {
        this.sendEventInfo(dm, event);
    }, false);
    } else if (dm.nodeName === 'A' || dm.nodeName === 'SPAN' || dm.nodeName === 'BUTTON' || (dm.nodeName === 'INPUT' || dm.getAttribute('type') === 'submit')) {
      dm.addEventListener('click', (event) => {
        this.sendEventInfo(dm, event);
    }, false);
    }
  });

    this.setTrackingAttributes();

    this.components.forEach((dm, index) => {
      this.isComponentInPage(dm, index);
  });

    // Check on scroll if component is in page viewport
    window.addEventListener('scroll', ValtTagManager.throttle(() => {
      this.components.forEach((dm, index) => {
      this.isComponentInPage(dm, index);
  });
  }, 300));

  }

  registerTMS(fn) {
    if (typeof fn === 'function') {
      this.eventArray.forEach(eventInfo => fn(eventInfo));
      this.TMScallbacks.push(fn);
    }
  }

  sendEventInfo(dm, event, index) {

    this.eventInfo = {
      className: dm.getAttribute('class') || null,
      nodeName: dm.nodeName || null,
      elementType: dm.getAttribute('type') || null,
      elementSource: dm.getAttribute('src') || null,
      elementUrl: dm.href || window.location.href,
      elementIsChecked: dm.checked || null,
      elementValue: dm.value || dm.innerText || null,
      eventName: event.type ? event.type : (event || null),
      eventLabel: dm.getAttribute('data-dm') || null,
      eventCategory: dm.getAttribute('data-dm').split('.').shift() || null,
      eventAction: dm.getAttribute('data-dm').split('.').pop() || null,
      pagePath: window.location.pathname || null,
      timestampMS: Date.now() - this.pageloadTimestamp,
      pageComponentsTotal: document.querySelectorAll('[data-dm^="component"]').length + 1,
      pageComponentIndex: (index + 1) || 0
    };

    this.eventArray.push(this.eventInfo);
    this.TMScallbacks.forEach(fn => fn(this.eventInfo));

  }

  setTrackingAttributes() {
    this.elements.forEach((dm) => {
      if (dm.dataset.dm.includes('component')) {
      this.viewTrackElement.push(dm);
    }
  });
  }

  isComponentInPage(dm, index) {
    if (ValtTagManager.isElementInViewport(dm, 0.75)) {
      const name = `${dm.getAttribute('data-dm')}-${index}`;
      if (!this.viewedComponents.includes(name)) {
        this.viewedComponents.push(name);
        this.sendEventInfo(dm, 'is-viewed', index);
      }
    }
  }

  static isElementInViewport(el, offsetTop) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0
      && rect.top <= (window.innerHeight || document.documentElement.clientHeight) * offsetTop
      && rect.left >= 0
      && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  static throttle(callback, limit) {
    let wait = false;
    return () => {
      if (!wait) {
        callback.call();
        wait = true;

        setTimeout(() => {
          wait = false;
      }, limit);
      }
    };
  }
}

/*
*
*  DISABLED FOR IN WCMMODE
*
*/
if (!danoneFramework.settings.wcmMode) {

  window.digitalData = new ValtTagManager();

  if (document.readyState === 'complete' || document.readyState === 'loaded') {
    window.digitalData.init();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.digitalData.init();
  });
  }
}

export default window.digitalData;
