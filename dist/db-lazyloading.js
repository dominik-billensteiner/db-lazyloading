"use strict";
// Set console log debuging to true/false
var lazyDebuging = true;
/**
 * Enable lazy loading after DOM has been loaded.
 * URLs must be set as data-src attribute on images.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Get all imgs from DOM
    var imgs = document.querySelectorAll(".db-lazy");
    if (imgs.length) {
        try {
            // Check if IntersectionObserver is available, else fallback
            if ("IntersectionObserver" in window) {
                // Debugging
                loadingWithObserver(imgs);
            }
            else {
                // Debugging
                if (lazyDebuging === true)
                    console.log("%c LazyLoading: Scrolling Alternative", "color: lightblue; font-weight: bold;");
                showAllImages(imgs);
                /*document.addEventListener("scroll", lazyloadAlternative);
                window.addEventListener("resize", lazyloadAlternative);
                window.addEventListener("orientationChange", lazyloadAlternative);*/
            }
        }
        catch (e) {
            // IntersectionObserver not available, fallback to simply loading images
            // Debugging
            if (lazyDebuging === true)
                console.log("%c LazyLoading: Fallback", "color: lightblue; font-weight: bold;");
            // Catch exception if IntersectionObserver causes referencenotfound error e.g. in older safari browsers
            showAllImages(imgs);
        }
    }
});
/**
 *
 * @param imgs Images
 */
function loadingWithObserver(imgs) {
    if (lazyDebuging === true)
        console.log("%c LazyLoading: IntersectinObserver in window", "color: lightblue; font-weight: bold;");
    var onIntersection = function (entries) {
        // Call function, when any image entity is in the intersection
        entries.forEach(function (entry) {
            // intersectionRatio covers Browsers which do not suppport isIntersecting
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
                var img = entry.target;
                // Stop observing the intersecting image
                observer.unobserve(img);
                // Display image instead of loading icon
                loadImage(img);
            }
        });
    };
    // Prepare observer options
    var options = {
        root: null,
        rootMargin: "0px 0px 500px 0px",
        treshhold: 0.01,
    };
    // Instanciate observer
    var observer = new IntersectionObserver(onIntersection, options);
    // Register IntersectionObserver on images
    imgs.forEach(function (img) {
        observer.observe(img);
    });
}
function loadingWithEvents(imgs) {
    var lazyloadThrottleTimeout;
    //let imgs: any = document.querySelectorAll(".db-lazy");
    console.log("alternative: " + imgs);
    if (lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
    }
    lazyloadThrottleTimeout = setTimeout(function () {
        var scrollTop = window.pageYOffset;
        for (var i = 0; i <= imgs.length; i++) {
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
/**
 * Displays a lazy loaded image.
 *
 * @param {any} img - Image.
 */
function loadImage(img) {
    //console.log(`${img.dataset.src} is intersecting`);
    // Display image by setting src attribute
    img.src = img.dataset.src;
    // Cleanup
    img.removeAttribute("data-src");
    if (img.dataset.srcset != null) {
        // Set srcset for responsive images if available
        img.srcset = img.dataset.srcset;
        img.removeAttribute("data-srcset");
    }
    img.onload = function () {
        onImageLoad(img);
        //img.style.removeProperty("object-fit");
        /* Set loaded status to true if image has completlety loaded
        img.setAttribute("data-loaded", "true");
        // Add styles for appearing imgs
        img.classList.add("db-lazy--loaded");*/
    };
}
function onImageLoad(img) {
    // Remove style used for placeholder
    img.style.removeProperty("width");
    img.style.removeProperty("height");
    // Enable lightbox overlay when image is loaded
    var lightboxOverlay = document.getElementById("lightbox-overlay-" + img.getAttribute("data-id"));
    lightboxOverlay.className =
        "lightbox__parent-overlay lightbox__parent-overlay--active";
    // Remove styles used for placeholder lightbox image
    var lightboxImg = document.getElementById("lightbox-img-" + img.getAttribute("data-id"));
    lightboxImg.style.removeProperty("width");
    lightboxImg.style.removeProperty("height");
}
/**
 * Shows all images by setting src attribute.
 *
 * @param  {any} imgs - NodeList of all images, which are loading lazy.
 */
function showAllImages(imgs) {
    console.log(imgs.length);
    console.log("Lazy show all images");
    if (imgs) {
        var _loop_1 = function (i) {
            imgs[i].setAttribute("src", imgs[i].getAttribute("data-src"));
            imgs[i].onload = function () {
                onImageLoad(imgs[i]);
            };
        };
        for (var i = 0; i < imgs.length; i++) {
            _loop_1(i);
        }
    }
}
