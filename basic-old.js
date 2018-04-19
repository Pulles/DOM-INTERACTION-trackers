if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function(callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

class ValtTagManager {
  constructor() {
    this.events = [];
    this.callbacks = [];
    this.numSectionsCount = 0;
    this.viewedComponents = [];

    this.init();
  }
  // this checks if there is an function defined in some TSM
  registerCallback(fn) {
    if (typeof fn !== "function") return;

    this.events.forEach(event => fn(event));
    this.callbacks.push(fn);
  }

  addEvent(eventInfo) {
    this.viewedComponents.push(eventInfo.eventLabel);
    this.events.push(eventInfo);
    this.callbacks.forEach(fn => fn(eventInfo));
  }
  initVirtualPageview() {
    document.addEventListener("virtual-page-view", e => {
      console.log(e);
      const details = e.detail;
      const eventInfo = {
        eventName: details.eventName,
        path: details.path || window.location.pathname,
        title: details.title,
        dealererId: details.dealerID,
        locationId: details.establishmentId,
        employeeId: details.employeeId
      };
      console.log(eventInfo);

      this.addEvent(eventInfo);
    });
  }

  initTrackClicks() {
    const clickTrackElements = document.querySelectorAll(".js-track-click");
    const _this = this;

    [].map.call(clickTrackElements, element => {
      element.addEventListener("click", event => {
        const target = event.target;

        const eventInfo = {
          eventName: target.getAttribute("data-name") || "buttonClick",
          eventAction:
          target.getAttribute("data-action") || target.innerText.trim(),
          eventLabel:
          target.getAttribute("data-label") || window.location.pathname,
          eventCategory:
          target.getAttribute("data-eventCategory") || "button click"
        };

        _this.addEvent(eventInfo);
      });
    });
  }
  initTrackClicksAjax() {
    document.addEventListener("click", e => {
      const el = e.target;
      if (el.classList.contains("js-track-click")) {
        const eventInfo = {
          eventName:
          el.attributes.getNamedItem("data-name").value || "buttonClick",
          eventAction:
          el.attributes.getNamedItem("data-action").value ||
          target.innerText.trim(),
          eventLabel:
          el.attributes.getNamedItem("data-label").value ||
          window.location.pathname,
          eventCategory:
          el.attributes.getNamedItem("data-eventCategory").value ||
          "button click"
        };

        _this.addEvent(eventInfo);
      }
    });
  }

  initTrackComponentViews() {
    const viewTrackElements = [].slice.call(
      document.querySelectorAll(".js-track-componentviewed")
    );
    this.numSectionsCount = viewTrackElements.length;

    window.addEventListener("scroll", () => {
      viewTrackElements.forEach(el => {
        if (this.isElementPartiallyInViewport(el)) {
          this.trackInView(el);
        }
      });
    });

    viewTrackElements.forEach(el => {
      if (this.isElementPartiallyInViewport(el)) {
        this.trackInView(el);
      }
    });
  }

  isElementPartiallyInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.top <=
      (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
      rect.left >= 0 &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  trackInView(el) {
    const label = `${el.getAttribute("data-index")} - ${this.numSectionsCount}`;

    if (this.viewedComponents.indexOf(label) > -1) return;

    var objEventInfo = {
      eventName: "componentViewed",
      eventAction: el.getAttribute("data-track-name"),
      eventLabel: label,
      eventCategory: "Component viewed on " + document.location.pathname
    };

    this.addEvent(objEventInfo);
  }

  setTrackingAttributes() {
    const viewTrackElements = [].slice.call(
      document.querySelectorAll(".js-track-componentviewed")
    );

    viewTrackElements.forEach((el, index) => {
      el.setAttribute("data-index", index + 1);
    });
  }

  init() {
    if (
      document.readyState === "complete" ||
      document.readyState === "loaded"
    ) {
      this.setTrackingAttributes();
      this.initTrackComponentViews();
      this.initVirtualPageview();
      this.initTrackClicksAjax();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        this.setTrackingAttributes();
        this.initTrackComponentViews();
        this.initVirtualPageview();
        this.initTrackClicksAjax();
      });
    }
  }
}

window.digitalData = new ValtTagManager();
