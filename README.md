## I. Mission Brief
This is the 4th project of my Front End Web Developer Nanodegree at Udacity. The objective is to optimize the sample website provided by Cameron, course instructor.

Performance will be measured primarily by results from PageSpeed Insights and Dev Tools. Pre-optimization score for the website is 27/100 from pagespeed insights and red flags are found on the dev tools as indicators of jank, primarily on animations.

The website is subdivided into 5 sections. The first and main section is the home page, where links to the other 4 sections can be found as ff:
- Build your Own 20248!
- Website Performance Optimization
- Mobile Web Development
- Cam's Pizzeria

The first 3 sub-sections are fairly basic. while Cam's Pizzeria sub-section is where the bulk of the animation improvement is needed.

## II. Getting Started

### Setting up a test environment
When developing the website, I use WAMP server to host my files on my local computer server. Hosting it locally will make certain performance fast such as HTTP GET requests, which is not ideal when experimenting on performance. To address this concern, we have to create a environment that will mimic a live hosting server that will also work on Page Speed Insight. I chose to use NGROK to do just that.

To use NGROK for the project, follow the instructions below:
1. Download the [ngrok.exec](https://ngrok.com/) file and save it on your project folder.
2. Double click on the ngrok.exe and a cmd prompt-like interface will pop up.
3. Enter the following command:
    ```sh
    ngrok http 80
    ```
4. The _command_ will then execute and provide you with forwarded http/https link that will serve as your domain for the test environment.

### File Organization
There is always some time to do some housekeeping.
- Placed all css, js, images in their respective folders.
- All sub-section HTMLs are placed under _views_ folder.
- Added _alt_ on all images.
- Placed all cacheable files on _public_ folder.

## III. Optimization Actions
#### Increasing Page Speed Score
The following is the documented actions that where taken to improve the website and optimize its performance according to PageSpeed Insights Results and Dev Tools Animation Performance.

###### WebFonts
Removed Google Fonts API and settled for default fonts available on the system.

###### CSS
Inlined all CSS scripts. HTTP request for CSS files are too time-consuming. Added async to lines that can be loaded asynchronously to prevent scripts from render-blocking. Google analytics and js/perfmatters. Added media="print" attribute to lines where links are to be loaded for css print styles.

###### Javascript
Inlined and minified all JS scripts.

###### Optimized Images
Reduced filesize of images to optimal sizes using [Kraken](https://kraken.io/web-interface) compression tool.

###### Gzip compression
Configured Apache serve httpd.conf to enable module_deflate and [compress my files with gzip.](https://www.devside.net/guides/config/compression)

###### Leverage Browsing Cache
Added cache timing to certain files of my site that are cacheble. I made sure that the mod_headers on my Apache Server httpd.conf is activated by removing the `#` on my WAMP folder. [Cache Control] (https://varvy.com/pagespeed/cache-control.html#basics)

```sh
  # One year for image files
  <FilesMatch ".(jpg|jpeg|png|gif|ico)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>

  # One month for css and js
  <FilesMatch ".(css|js)$">
    Header set Cache-Control "max-age=2628000, public"
  </FilesMatch>
```
## IV. Animation Optimization
###### Reduced Pizzas Loaded
Some of the pizzas being loaded in the background are in excess. Reduced loop iteration from 200 to 24.

```
document.addEventListener('DOMContentLoaded', function() {
  var cols = 8;
  var s = 256;
  for (var i = 0; i < 25; i++) {
    var elem = document.createElement('img');
    elem.className = 'mover';
    elem.src = "../public/images/pizza.png";
    elem.style.height = "100px";
    elem.style.width = "73.333px";
    elem.basicLeft = (i % cols) * s;
    elem.style.top = (Math.floor(i / cols) * s) + 'px';
    document.querySelector("#movingPizzas1").appendChild(elem);
  }
  updatePositions();
});
```

####### Optmized the updatePositions FSL
Batched processed the `updatePositions` function by creating `scrollY` variable and removing it from the loop.

```
function updatePositions() {
  frame++;
  window.performance.mark("mark_start_frame");

  var items = document.querySelectorAll('.mover');
  var scrollY = (document.body.scrollTop / 1250);
  for (var i = 0; i < items.length; i++) {
    var phase = Math.sin(scrollY + (i % 5));
    items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
  }

  // User Timing API to the rescue again. Seriously, it's worth learning.
  // Super easy to create custom metrics.
  window.performance.mark("mark_end_frame");
  window.performance.measure("measure_frame_duration", "mark_start_frame", "mark_end_frame");
  if (frame % 10 === 0) {
    var timesToUpdatePosition = window.performance.getEntriesByName("measure_frame_duration");
    logAverageFrame(timesToUpdatePosition);
  }
}
```

###### Query Selectors
Replaced querySelectorAll() with getElementsByClassName().

```
