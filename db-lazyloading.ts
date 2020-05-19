/**
 * Enable lazy loading after DOM has been loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Get all imgs from DOM
  let imgs: any = document.querySelectorAll("img");

  // Add lazy loading class to imgs
  imgs.forEach((img: any) => {
    img.classList.add("db-lazy");
  });

  if (imgs.length) {
    try {
      // Check if IntersectionObserver is available, else fallback
      if ("IntersectionObserver" in window) {
        let options: any = {
          root: document.querySelector(".center"), // Any container
          rootMargin: "0px 0px 200px 0px", // Defines margin for intersection, image is loaded 200px before images comes in the screen
        };
        function onIntersection(imageEntites: any) {
          // Call function, when any image entity is in the intersection
          imageEntites.forEach((img: any) => {
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
              };
              //img.target.classList.add("lazy-load--is-loaded"); to add styles for appearing imgs */
            }
          });
        }
        var observer = new IntersectionObserver(onIntersection, options); // Instanciate observer
        for (var i = 0; i < imgs.length; i++) {
          observer.observe(imgs[i]);
        }
        //lazyImgs.map(img => observer.observe(img)); // Register for every image with lazy loading class attribute
      } else lazyLoadingFallback(imgs); // IntersectionObserver not available, fallback to simply loading images
    } catch (e) {
      // Catch exception if IntersectionObserver causes referencenotfound error e.g. in older safari browsers
      lazyLoadingFallback(imgs);
    }
  }
});

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
