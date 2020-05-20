"use strict";
/**
 * Enable lazy loading after DOM has been loaded.
 * URLs must be set as data-src attribute on images.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Get all imgs from DOM
    var imgs = document.querySelectorAll("img");
    // Add lazy loading class to imgs
    imgs.forEach(function (img) {
        img.classList.add("db-lazy");
    });
    if (imgs.length) {
        try {
            // Check if IntersectionObserver is available, else fallback
            if ("IntersectionObserver" in window) {
                var options = {
                    root: null,
                    rootMargin: "0px",
                    //root: document.querySelector(".center"), // Any container
                    //rootMargin: "0px 0px 200px 0px", // Defines margin for intersection, image is loaded 200px before images comes in the screen
                    treshhold: 0.01
                };
                var onIntersection = function (imageEntites) {
                    // Call function, when any image entity is in the intersection
                    imageEntites.forEach(function (img) {
                        // intersectionRatio covers Browsers which do not suppport isIntersecting
                        if (img.isIntersecting || img.intersectionRatio > 0) {
                            // Stop observing the intersecting image
                            observer_1.unobserve(img.target);
                            // Display image instead of loading icon
                            img.target.src = img.target.dataset.src;
                            img.target.removeAttribute("data-src");
                            if (img.target.dataset.srcset != null) {
                                img.target.srcset = img.target.dataset.srcset;
                                img.target.removeAttribute("data-srcset");
                            }
                            // Set loaded status to true if image has completlety loaded
                            img.target.onload = function () {
                                img.target.setAttribute("data-loaded", "true");
                                // Add styles for appearing imgs
                                img.target.classList.add("lazy-load--is-loaded");
                            };
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
            else
                showAllImages(imgs); // IntersectionObserver not available, fallback to simply loading images
        }
        catch (e) {
            // Catch exception if IntersectionObserver causes referencenotfound error e.g. in older safari browsers
            showAllImages(imgs);
        }
    }
});
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
