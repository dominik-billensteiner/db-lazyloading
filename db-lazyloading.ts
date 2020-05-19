var browserIsIE = false; // True if browser is any Internet Explorer

/**
 * Perform actions, which need the DOM to be fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Activate lazy loading -- TEMP FIX would be to call lazyLoadingfallback instead of lazyLoading when gridCOmpat is not available
  lazyLoading();
});

/**
 * Enables lazy loading for grid images and wp-
 */
function lazyLoading() {
  var lazyImgs = document.getElementsByClassName("lazy-load"); // Put all images with class lazy-load in an array
  if (lazyImgs.length > 0) {
    // Check if array has elements
    try {
      if ("IntersectionObserver" in window || !browserIsIE) {
        // Check if IntersectionObserver is available, else fallback
        var options = {
          root: document.querySelector(".center"), // Any container
          rootMargin: "0px 0px 200px 0px", // Defines margin for intersection, image is loaded 200px before images comes in the screen
        };
        function onIntersection(imageEntites) {
          // Call function, when any image entity is in the intersection
          jQuery.map(imageEntites, function (img) {
            // Perform for every entity
            if (img.isIntersecting || img.intersectionRatio > 0) {
              // If image is intersecting || intersectionRatio covers Browsers which do not suppport isIntersecting(e.g. Samsung Browser 5.x with Chromium 5x)
              observer.unobserve(img.target);
              // Set src to data-src, and srcset to datasrc-set, remove obsulete attributes
              img.target.src = img.target.dataset.src;
              img.target.removeAttribute("data-src");
              if (img.target.dataset.srcset != null) {
                img.target.srcset = img.target.dataset.srcset;
                img.target.removeAttribute("data-srcset");
              }
              img.target.onload = function () {
                // Save loaded status of image in a data property
                img.target.setAttribute("data-loaded", "true");
                checkSlideshowImgFormat(img.target);
              };
              //img.target.classList.add("lazy-load--is-loaded"); to add styles for appearing imgs */
            }
          });
        }
        var observer = new IntersectionObserver(onIntersection, options); // Instanciate observer
        for (var i = 0; i < lazyImgs.length; i++) {
          observer.observe(lazyImgs[i]);
        }
        //lazyImgs.map(img => observer.observe(img)); // Register for every image with lazy loading class attribute
      } else lazyLoadingFallback(lazyImgs); // IntersectionObserver not available, fallback to simply loading images
    } catch (e) {
      // Catch exception if IntersectionObserver causes referencenotfound error e.g. in older safari browsers
      lazyLoadingFallback(lazyImgs);
    }
  }
}

/**
 * Fallback if error coccurs with lazy loading function, sets all src attribute of images to value of data-src
 *
 * @param  {Array} - Array of all images, which are loading lazy.
 */
function lazyLoadingFallback(lazyImgs) {
  // Go through all grid image
  if (lazyImgs != null) {
    for (var i = 0; i < lazyImgs.length; i++) {
      // Set attribute src to value of data-src
      lazyImgs[i].setAttribute("src", lazyImgs[i].getAttribute("data-src"));
    }
  }
}

/**
 * Change header style when user is scrolling.
 */
window.onscroll = function () {
  var header = document.getElementById("header"); // Get Header from DOM
  // Check if user scrolled unter the header
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    header.className = "header header--is-scrolled"; // Remember that header is in scrolling state
    if (slideoutMenuIsOpen()) {
      // Check if slideout menu is already open
      toggleMenu(); // Open/Close slideout menu
    }
  } else {
    header.className = header.className.replace(" header--is-scrolled", ""); // Remove scrolling state of header
  }
};
