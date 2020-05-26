// Set console log debuging to true/false
const lazyDebuging: boolean = true;

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
        // Debugging
        loadingWithEvents(imgs);
      } else {
        // Debugging
        if (lazyDebuging === true)
          console.log(
            "%c LazyLoading: Scrolling Alternative",
            "color: lightblue; font-weight: bold;"
          );

        showAllImages(imgs);
        /*document.addEventListener("scroll", lazyloadAlternative);
        window.addEventListener("resize", lazyloadAlternative);
        window.addEventListener("orientationChange", lazyloadAlternative);*/
      }
    } catch (e) {
      // IntersectionObserver not available, fallback to simply loading images

      // Debugging
      if (lazyDebuging === true)
        console.log(
          "%c LazyLoading: Fallback",
          "color: lightblue; font-weight: bold;"
        );

      // Catch exception if IntersectionObserver causes referencenotfound error e.g. in older safari browsers
      showAllImages(imgs);
    }
  }
});

function loadingWithObserver(imgs: any) {
  if (lazyDebuging === true)
    console.log(
      "%c LazyLoading: IntersectinObserver in window",
      "color: lightblue; font-weight: bold;"
    );

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

  // Prepare observer options
  let options: any = {
    root: null,
    rootMargin: "0px 0px 500px 0px", // Defines margin for intersection, image is loaded 200px before images comes in the screen
    treshhold: 0.01,
  };

  // Instanciate observer
  let observer: any = new IntersectionObserver(onIntersection, options);

  // Register IntersectionObserver on images
  imgs.forEach((img: any) => {
    observer.observe(img);
  });
}

function loadingWithEvents(imgs: any) {
  let lazyloadThrottleTimeout: any;
  //let imgs: any = document.querySelectorAll(".db-lazy");
  console.log("alternative: " + imgs);
  if (lazyloadThrottleTimeout) {
    clearTimeout(lazyloadThrottleTimeout);
  }

  lazyloadThrottleTimeout = setTimeout(() => {
    let scrollTop = window.pageYOffset;
    for (let i = 0; i <= imgs.length; i++) {
      if (imgs[i].offsetTop < window.innerHeight + scrollTop) {
        console.log(imgs[i].src);
        loadImage(imgs[i]);
      }
    }
    if (imgs.length == 0) {
      document.removeEventListener("scroll", loadingWithEvents);
      window.removeEventListener("resize", loadingWithEvents);
      window.removeEventListener("orientationChange", loadingWithEvents);
    }
  }, 20);
}

function loadImage(img: any) {
  console.log(`${img.dataset.src} is intersecting`);
  img.src = img.dataset.src;
  img.removeAttribute("data-src");
  if (img.dataset.srcset != null) {
    img.srcset = img.dataset.srcset;
    img.removeAttribute("data-srcset");
  }

  /*
  // Set loaded status to true if image has completlety loaded
  img.onload = () => {
    img.setAttribute("data-loaded", "true");
    // Add styles for appearing imgs
    img.classList.add("db-lazy--loaded");
  };*/
}

/**
 * Shows all images by setting src attribute.
 *
 * @param  {any} imgs - NodeList of all images, which are loading lazy.
 */
function showAllImages(imgs: any) {
  // Go through all grid image
  console.log("Lazy show all images");
  if (imgs) {
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].setAttribute("src", imgs[i].getAttribute("data-src"));
    }
  }
}
