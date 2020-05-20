/**
 * Enable lazy loading after DOM has been loaded.
 * URLs must be set as data-src attribute on images.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Get all imgs from DOM
  let imgs: any = document.querySelectorAll(".db-lazy");

  if (imgs.length) {
    try {
      // Check if IntersectionObserver is available, else fallback
      if ("IntersectionObserver" in window) {
        console.log("Lazy IntersectinObserver in window");
        let options: any = {
          root: null,
          rootMargin: "0px 0px 100px 0px", // Defines margin for intersection, image is loaded 200px before images comes in the screen
          treshhold: 0.01,
        };
        const onIntersection = (entries: any) => {
          // Call function, when any image entity is in the intersection
          entries.forEach((entry: any) => {
            // intersectionRatio covers Browsers which do not suppport isIntersecting
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              let img = entry.target;
              // Stop observing the intersecting image
              observer.unobserve(img);

              // Display image instead of loading icon
              loadImage(img);
            }
          });
        };

        // Instanciate observer
        let observer: any = new IntersectionObserver(onIntersection, options);

        // Register IntersectionObserver on images
        imgs.forEach((img: any) => {
          observer.observe(img);
        });
      } else {
        console.log("Lazy Scrolling Fallback");
        let lazyloadThrottleTimeout: any;

        const lazyload = () => {
          if (lazyloadThrottleTimeout) {
            clearTimeout(lazyloadThrottleTimeout);
          }

          lazyloadThrottleTimeout = setTimeout(() => {
            var scrollTop = window.pageYOffset;
            imgs.forEach(function (img: any) {
              if (img.offsetTop < window.innerHeight + scrollTop) {
                loadImage(img);
              }
            });
            if (imgs.length == 0) {
              document.removeEventListener("scroll", lazyload);
              window.removeEventListener("resize", lazyload);
              window.removeEventListener("orientationChange", lazyload);
            }
          }, 20);
        };

        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
      } // IntersectionObserver not available, fallback to simply loading images
    } catch (e) {
      console.log("Lazy full fallback");

      // Catch exception if IntersectionObserver causes referencenotfound error e.g. in older safari browsers
      showAllImages(imgs);
    }
  }
});

function loadImage(img: any) {
  console.log(`${img.dataset.src} is intersecting`);
  img.src = img.dataset.src;
  img.removeAttribute("data-src");
  if (img.dataset.srcset != null) {
    img.srcset = img.dataset.srcset;
    img.removeAttribute("data-srcset");
  }
  // Set loaded status to true if image has completlety loaded
  img.onload = () => {
    img.setAttribute("data-loaded", "true");
    // Add styles for appearing imgs
    img.classList.add("db-lazy--loaded");
  };
}

/**
 * Shows all images by setting src attribute.
 *
 * @param  {any} imgs - NodeList of all images, which are loading lazy.
 */
function showAllImages(imgs: any) {
  // Go through all grid image
  if (imgs) {
    imgs.forEach((img: any) => {
      // Set attribute src to value of data-src
      img.setAttribute("src", img.getAttribute("data-src"));
    });
  }
}
