"use strict";
/**
 * Enable lazy loading after DOM has been loaded.
 * URLs must be set as data-src attribute on images.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Get all imgs from DOM
    var imgs = document.querySelectorAll("db-lazy");
    if (imgs.length) {
        try {
            // Check if IntersectionObserver is available, else fallback
            if ("IntersectionObserver" in window) {
                console.log("Lazy IntersectinObserver in window");
                var options = {
                    root: null,
                    rootMargin: "0px",
                    treshhold: 0.01
                };
                var onIntersection = function (entries) {
                    // Call function, when any image entity is in the intersection
                    entries.forEach(function (entry) {
                        // intersectionRatio covers Browsers which do not suppport isIntersecting
                        if (entry.isIntersecting || entry.intersectionRatio > 0) {
                            var img = entry.target;
                            // Stop observing the intersecting image
                            observer_1.unobserve(img);
                            // Display image instead of loading icon
                            loadImage(img);
                        }
                    });
                };
                // Instanciate observer
                var observer_1 = new IntersectionObserver(onIntersection, options);
                // Register IntersectionObserver on images
                imgs.forEach(function (img) {
                    observer_1.observe(img);
                });
            }
            else {
                console.log("Lazy Scrolling Fallback");
                var lazyloadThrottleTimeout_1;
                var lazyload_1 = function () {
                    if (lazyloadThrottleTimeout_1) {
                        clearTimeout(lazyloadThrottleTimeout_1);
                    }
                    lazyloadThrottleTimeout_1 = setTimeout(function () {
                        var scrollTop = window.pageYOffset;
                        imgs.forEach(function (img) {
                            if (img.offsetTop < window.innerHeight + scrollTop) {
                                loadImage(img);
                            }
                        });
                        if (imgs.length == 0) {
                            document.removeEventListener("scroll", lazyload_1);
                            window.removeEventListener("resize", lazyload_1);
                            window.removeEventListener("orientationChange", lazyload_1);
                        }
                    }, 20);
                };
                document.addEventListener("scroll", lazyload_1);
                window.addEventListener("resize", lazyload_1);
                window.addEventListener("orientationChange", lazyload_1);
            } // IntersectionObserver not available, fallback to simply loading images
        }
        catch (e) {
            console.log("Lazy full fallback");
            // Catch exception if IntersectionObserver causes referencenotfound error e.g. in older safari browsers
            showAllImages(imgs);
        }
    }
});
function loadImage(img) {
    console.log(img.dataset.src + " is intersecting");
    img.src = img.dataset.src;
    img.removeAttribute("data-src");
    if (img.dataset.srcset != null) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute("data-srcset");
    }
    // Set loaded status to true if image has completlety loaded
    img.onload = function () {
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
function showAllImages(imgs) {
    // Go through all grid image
    if (imgs) {
        imgs.forEach(function (img) {
            // Set attribute src to value of data-src
            img.setAttribute("src", img.getAttribute("data-src"));
        });
    }
}
