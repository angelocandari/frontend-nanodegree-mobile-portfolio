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
Added .htaccess file to project folder and, in it, added the script below to enable mod_deflate that compresses the files.

###### Leverage Browsing Cache
Added cache timing to certain files of my site that are cacheble. I made sure that the mod_headers on my Apache Server httpd.conf is activated by removing the `#` on my WAMP folder. 

###### Full .htaccess

```sh
<IfModule mod_deflate.c>
  <FilesMatch "\.(ico|jpg|jpeg|png|gif|js|css|html|php|txt|xml)$">
    SetOutputFilter DEFLATE
  </FilesMatch>

  # One year for image files
  <FilesMatch ".(jpg|jpeg|png|gif|ico)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>

  # One month for css and js
  <FilesMatch ".(css|js)$">
    Header set Cache-Control "max-age=2628000, public"
  </FilesMatch>

</IfModule>
```
