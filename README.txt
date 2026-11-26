Design Opttions website
Open index.html in a browser (or deploy the folder to Vercel/Netlify). Keep the assets folder next to index.html.

Contact set-up (all in the <body> tag of index.html):
 data-wa="919133195019"   WhatsApp/phone number shown on the studio's Instagram posts (+91 91331 95019). Check it is the right one.
 data-email="designoption06@gmail.com"   email shown on the Instagram posts.
 data-endpoint=""         optional form service URL (for example a Formspree endpoint) so enquiries arrive by email without opening any app
How the contact form sends: 1) data-endpoint if set, else 2) WhatsApp (number above), else 3) the email app, else 4) an Instagram DM to @designopttions.

Name: the profile and logo spell it "Design Opttions" (handle @designopttions), while some posts and the email say "Design Options". The site uses "Design Opttions". Change it in index.html if the client prefers the other spelling.

Numbers: About section uses the Instagram profile (75 posts, 127 followers) and the bio line "1100+ spaces designed". Update data-n in index.html when they change. No other statistics are used.

Check: service and project descriptions were written from the Instagram photos and bio (Design | Décor | Renovation, Pune). Replace with the client's real project names and details if wanted.

Theme: royal blue from the logo, red and copper accents, deep navy text and footer.

Logo: Instagram profile picture, used as favicon and as the mark beside the name (assets/img/logo.png, favicon-*.png). Replace with the original file when available.

Photos: cropped from Instagram screenshots (low resolution, so the full-screen hero and contact images look soft). Replace files in assets/img/ with originals using the same file names, especially hero.jpg and contact.jpg.

Behaviour: the glass navbar slides away when you scroll down and returns when you scroll up. Scroll reveals and number counters play once and stay; they do not replay in reverse.
Fonts (Inter Tight, Allura) load from Google Fonts; offline they fall back to Helvetica/Arial.
