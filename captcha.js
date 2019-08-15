/**
 * Function to perform captcha
 */
(function () {
    let picFetcher = new XMLHttpRequest(); // Http request object
    let clientId = '264ed3d893c2f75c634a5a3bd6c5f4a6cec65f25e3647682bdc4f7a23918e365'; // Unsplash api client id
    let serviceCall = '/photos/random/'; // Unsplash service
    let currentImages = []; // Used to store images to be displayed for captcha
    let selectedImg = null; // Image selected for captcha to be successful

    /**
     * Select 4 images from a set of downloaded images and perform captcha using them
     */
    let showImages = function () {
        currentImages = []; // Resetting images to be displayed

        // Selecting 4 random images form the fetched urls
        let randomizer = [];
        while (currentImages.length < 4) {
            let randomNum = Math.floor(Math.random() * images.length - 1) + 1;
            if (randomizer.find((num) => { return randomNum === num; }) === undefined) {
                randomizer.push(randomNum);
                currentImages.push(images[randomNum]);
            }
        }

        // Adding the selected images to the document body
        currentImages.forEach((image, index) => {
            const img = document.getElementById(index);
            img.src = image.urls.thumb;
            img.addEventListener('click', checkCaptcha);
        });

        selectedImg = Math.round(Math.random() * 3); // Selecting the image for captcha success

        // Adding the success img hint to the document body
        if (currentImages[selectedImg].alt_description) {
            document.getElementById('captcha-q').innerHTML = currentImages[selectedImg].alt_description;
            document.getElementsByClassName('captcha-text')[0].style.display = 'initial';
            document.getElementsByClassName('loader')[0].style.display = 'none';
            document.getElementsByClassName('captcha')[0].style.display = 'initial';
        } else {
            document.getElementsByClassName('captcha')[0].style.display = 'none';
            showImages();
        }
    }

    /**
     * Use fetched image urls and preload them for captcha
     */
    let storeImages = function () {
        if (picFetcher.readyState === XMLHttpRequest.DONE) {
            if (picFetcher.status === 200) {
                images = JSON.parse(picFetcher.response);
                preloadImages(0);
            } else {
                alert('error');
            }
        }
    }

    /**
     * Preload fetched urls
     * @param  {Number} index count to keep track of the images to preload
     */
    let preloadImages = function (index) {
        if (index < images.length) {
            let img = new Image();
            img.onload = () => { preloadImages(index + 1) };
            img.onerror = () => { preloadImages(index + 1) };
            img.src = images[index].urls.thumb;
        } else {
            showImages();
        }
    }

    /**
     * Call api service to fetch images urls required for captcha
     */
    let performSearch = function () {
        picFetcher.onreadystatechange = storeImages;
        picFetcher.open('GET', `https://api.unsplash.com${serviceCall}?client_id=${clientId}&orientation=squarish&count=30`);
        picFetcher.send();
        document.getElementsByClassName('captcha')[0].style.display = 'none';
        document.getElementsByClassName('loader')[0].style.display = 'initial';
    }

    /**
     * Validating if the correct image was selected
     * @param  {event} num1 mouse click event used to access the element id
     */
    let checkCaptcha = function (event) {
        if (event.target.id === selectedImg.toString()) {
            alert('success');
        }
        document.getElementsByClassName('captcha-text')[0].style.display = 'none';
        showImages();
    }

    // Initial Call to start the captcha function
    performSearch();

    // Refreshing the images for a fresh set every 5 minutes
    setInterval(() => {
        performSearch();
    }, 300000);
})();
