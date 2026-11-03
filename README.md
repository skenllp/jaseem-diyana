# Noor Al Qamar – Jaseem Paramban & Diyana M.

Static wedding invitation (HTML, CSS, vanilla JS, GSAP via CDN). No build step.

## Structure
index.html · css/style.css · js/script.js · assets/ (intro.mp4, poster.jpg, courtyard/invitation/arch/venue/garden .png, og.jpg)

## Deploy to Hostinger
Upload the whole folder contents to `public_html/` (File Manager or FTP). Open the domain; done.

## Notes
- **Dress code palette** is built in HTML/CSS from the colour values in the brief. The reference image `dress-code.jpeg` was not among the uploaded files; when you add it, sample the swatch colours and edit the `COLOURS` array in `js/script.js`.
- `assets/poster.jpg` is the first frame of the intro video (loading poster). `assets/og.jpg` (1200x630) is cropped from the venue image for WhatsApp previews.
- WhatsApp preview image is `assets/og.jpg` (1200x675), linked as `https://diyana-jaseem.vercel.app/assets/og.jpg`. If the domain changes, update `og:url`, `og:image`, `twitter:image` and `canonical` in `index.html`.
- The opening screen shows on every load. With reduced-motion enabled, tapping "Open Invitation" goes straight into the site.
- Images are large (2.5 MB each PNG). For faster WhatsApp loading, convert them to WebP/JPEG at ~1600px and update the paths.
- Calendar file uses Asia/Kolkata (IST), 5:00–9:00 PM.

- **Song:** add your music as `assets/song.mp3`. It starts when the guest taps "Open Invitation" and a small mute button appears. Without the file, nothing plays and no button shows.
