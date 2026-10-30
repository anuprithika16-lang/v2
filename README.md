# Aarthi Travels Website

Static website (HTML5, CSS3, vanilla JavaScript) for Aarthi Travels, Sankarankovil, Tamil Nadu. No build step.

## Structure
```
index.html, about.html, vehicles.html, tour-packages.html, contact.html   (all five pages in the root folder)
css/                  style.css, responsive.css, animations.css
js/                   main, navigation, vehicle-booking, contact-form, animations
images/               logo/ hero/ vehicles/ destinations/ icons/
assets/fonts/         (optional) self-hosted fonts
robots.txt, sitemap.xml
```

## Open locally
Double-click `index.html`, or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000.
(Google Fonts load online; the site falls back to Georgia / Segoe UI offline.)

## IMPORTANT: placeholder images
All files in `images/hero`, `images/vehicles` and `images/destinations` are **generated placeholders** (each shows a "Placeholder image" label). Replace them with real photographs before launch. Keep the same file names, or update the `src` in the HTML.
Only the logo is the client's real artwork (whitespace around the original screenshot was trimmed; the artwork itself is unchanged).

## Home hero slider
The hero is a full-width 5-image slider (Kodaikanal, Munnar, Rameswaram, Ooty, Alleppey). Each change slides the new photo in from the side while cross-fading and settling with a gentle Ken Burns zoom (1.05 to 1), about 1 second, `cubic-bezier(0.22, 1, 0.36, 1)`. It auto-advances every 5.5 seconds, pauses on keyboard focus, touch and the Pause button, supports swipe, arrows and dots, and preloads the next image. Visitors who prefer reduced motion get a simple cross-fade (no sliding or zoom). Mobile uses a bottom-only gradient instead of a solid panel.
Images: `images/hero/hero-*.jpg` (generated placeholders: replace with real photos, same names). Slides are listed in `index.html` (`data-hero-slider`); timing constants (`SLIDE_MS`, `TRANSITION_MS`, `SHIFT`) are at the top of the slider code in `js/animations.js`; slider styles are in the "Hero slider" section of `css/style.css`. If you change `TRANSITION_MS`, change the transition durations there too. `hero-urbania.jpg` and `athirappilly.jpg` are spares.

## Typography
Headings use Playfair Display, everything else Poppins. All sizes are fluid tokens (`--fs-hero`, `--fs-h2`, `--fs-sub`, `--fs-card`, `--fs-body`, `--fs-nav`, `--fs-btn`, `--fs-small`) at the top of `css/style.css`: use these instead of fixed sizes.

## Header
One shared header on every page: logo, navigation, phone and email (`tel:` / `mailto:`) and an Enquire Now button. Below 1100px it becomes a two-row header (logo + hamburger, then Call Us / Email). If a contact detail changes, update the `.header-contact` block on each page (and `js/main.js` for WhatsApp messages).

## Page copy and keywords
Each page has 1,000+ words of copy built around its focus keyword and secondary keywords (see the `<title>`, description and `keywords` meta in each page). Edit the text freely, but keep claims you can stand behind: no prices, ratings or years unless confirmed.

## Replace the logo
Overwrite `images/logo/aarthi-travels-logo.png` (keep it a black logo on white/transparent). If the aspect ratio changes, update the `width`/`height` attributes on the logo `<img>` tags in every page.

## Replace vehicle images
Replace the six files in `images/vehicles/` (4:3 landscape, about 900x675 px, JPG under 150 KB). The hero vehicle is `images/hero/hero-urbania.jpg`.

## Replace destination images
Replace files in `images/destinations/` (4:3, about 900x675 px). Hero backgrounds are the five `images/hero/hero-*.jpg` files, about 1920x1080.
`athirappilly.jpg` and `hero-urbania.jpg` are spares.

## Update contact information
Search all `.html` files for: `917845501000`, `+91 78455 01000`, `aarthicarsandvans@gmail.com`, `AarthiTravelsSnkl1000`, and the address text. In JavaScript, update `phone` and `email` at the top of `js/main.js`. The LocalBusiness JSON-LD is in the `<head>` of every page.

## Vehicles
Vehicle names are in the HTML cards and in `js/main.js` (`vehicles` list, also used for seat-capacity checks). Keep names identical in both places.

## Enquiry form (no backend)
The site has no server. "Send Enquiry on WhatsApp" opens WhatsApp with a prepared message, and "Send by Email" opens the customer's email app. Nothing is sent until the customer presses Send, and the site never shows a booking confirmation.

## SEO before launch
Replace `YOUR-DOMAIN` in `sitemap.xml`, `robots.txt` and the breadcrumb JSON-LD. Add `<link rel="canonical">`, `og:url` and `og:image` (absolute URLs) to each page once the domain is known.

## Deploy to GitHub Pages
1. Create a GitHub repository and upload the contents of this folder (so `index.html` is in the repo root).
2. Repository **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. After a minute the site is live at `https://<username>.github.io/<repository>/`. All paths are relative, so it works in a sub-folder.


## Destination images (16 destinations)
Existing 8 keep their filenames. The 8 added destinations use these files in `images/destinations/`:
`thanjavur-temple.jpg`, `trichy-rockfort-temple.jpg`, `palani-hill-temple.jpg`, `courtallam-waterfalls.jpg`, `valparai-tea-estates.jpg`, `yercaud-lake.jpg`, `pondicherry-french-quarter.jpg`, `tirupati-tirumala-temple.jpg`.
These are currently branded placeholder tiles (1448x1086, 4:3). Replace each with a real, licensed photograph of the same name and size ratio; no code changes needed.
