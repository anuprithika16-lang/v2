# BizHopers website

Five-page static website (plain HTML, CSS and JavaScript, no build step, no dependencies).

| Page | File |
|---|---|
| Home | `index.html` |
| About Us | `about.html` |
| Products | `products.html` |
| Services | `services.html` |
| Contact Us | `contact.html` |

Shared files: `css/style.css` (all styling and brand colours as CSS variables at the top), `js/main.js` (mobile menu, footer year, contact form), `images/`.

## Run locally
Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000      # then visit http://localhost:8000

## Deploy
Upload the folder contents to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or ordinary web hosting). Keep `index.html` at the site root.
Fonts (Manrope, Sora) load from Google Fonts; the site falls back to system fonts if they are unavailable.

## Contact form
The original project had no backend, so the form is **not connected to any delivery service**.
It validates the fields (name, email, subject and message are required; email format and phone digits are checked) and, until an endpoint is set, tells the visitor plainly that nothing was sent and shows the two phone numbers.

To go live, open `contact.html` and set the `data-endpoint` attribute on `<form id="enquiry-form">` to a URL that accepts a POST of form fields (for example a Formspree, Getform or Web3Forms endpoint, or your own API). No JavaScript changes are needed. On success the form shows a confirmation; on failure it shows an error and keeps what the visitor typed.

## Editing content
- Product feature and benefit lists for Billing, POS and Inventory are marked **Draft**: replace them with confirmed details in `products.html`.
- Illustrations (`images/billing.svg`, `pos.svg`, `inventory.svg`, `website.svg`, `marketing.svg`) are original illustrations, not product screenshots. Replace with real screenshots when available (keep roughly 16:10).
- The About page mission and vision are draft wording and are labelled as such.

## Information still needed
- Email address (none was in the project, so none is shown)
- Opening hours
- Verified company background for the About page (founding, team, projects), if you want it shown
- Confirmed features, benefits and real screenshots for Billing, POS and Inventory software
- Social media links, if wanted (none shown)
- Higher-resolution photos of the barcode hardware (the supplied product images are 460 px wide)
- The form delivery endpoint (see above)

## Motion and 3D layer
`css/fx.css` and `js/fx.js` add the premium effects (3D hero scene, card tilt, scroll reveal, progress bar). They are loaded after the original files on every page. To remove all effects, delete the two `fx` lines from each HTML file. Users with "reduce motion" turned on see the site without animation.
