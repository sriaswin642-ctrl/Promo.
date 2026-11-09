# Promo - free launch version (no payment, with uploads)

Files: index.html, styles.css, app.js, ads.json, logo.png

## Put it online (no GitHub needed)
1. On a computer, go to app.netlify.com/drop.
2. Drag this whole folder onto the page. Your site is live in seconds.
   (GitHub + Vercel also works: upload all 5 files to your repository.)

## Turn on uploads (free Cloudinary account, about 5 minutes)
1. Create a free account at cloudinary.com. On the dashboard, copy your Cloud name.
2. Settings > Upload > Upload presets > Add upload preset.
3. Set Signing mode to Unsigned. Under the preset's options, limit the allowed formats (jpg, png, webp, mp4) and set a folder such as promo.
4. Save, and copy the preset name.
5. Open app.js and fill in the top lines:
   var CLOUD_NAME = 'your-cloud-name';
   var UPLOAD_PRESET = 'your-preset-name';
6. Also fill OWNER_WHATSAPP (digits only, with country code, e.g. 919876543210) or OWNER_EMAIL, so businesses can send you their ad.
7. Upload the folder again.
Until step 5 is done, the upload button says uploads are not switched on, and businesses can paste an image link instead.
Note: an unsigned preset can be used by anyone who reads your page code, so keep the format limits on and watch your Cloudinary free quota.

## How an ad goes live
1. A business taps Post your ad, uploads a poster image or video (or uses the Promo poster), fills the form and taps Submit my ad.
2. You get a WhatsApp message or email with the ad details.
3. Check that the ad is genuine, then paste the details inside the [ ] in ads.json (put a comma between ads) and upload ads.json again.

## Limits of this version
- Ads appear only after you add them to ads.json (this is also your review step).
- Views and clicks are not counted, and the poster studio uses templates, not AI.
- For automatic publishing, a shared database and click counts, use the promo-pro version (its payment can be removed on request).
