# Promo - direct upload version (no server needed)

Files: index.html, styles.css, app.js, ads.json, logo.png
Payments use your Razorpay link: https://razorpay.me/@sriaswinr

## Put it online (no GitHub needed)
1. Go to app.netlify.com/drop on a computer.
2. Drag this whole folder onto the page. Your site is live in seconds.
   (GitHub + Vercel also works: upload all 5 files to your repository.)

## Before you share it: edit 4 lines at the top of app.js
- PAY_URL  your Razorpay link (already set)
- PRICE    99
- OWNER_WHATSAPP  your number with country code, digits only, e.g. 919876543210
- OWNER_EMAIL     e.g. hello@yourdomain.com
Fill in at least one of the last two. Businesses use it to send you their ad after paying.

## How an ad goes live
1. A business taps Post your ad, fills the form, taps "1. Pay" (opens your Razorpay page), then "2. Send my ad".
2. You receive a WhatsApp message or email with the ad details.
3. Check the payment in the Razorpay app or dashboard (right amount, right payer).
4. Open ads.json, paste the ad details inside the [ ] brackets (put a comma between ads), and upload ads.json again.
   Example of one ad in ads.json:
[{"id":"a1b2c3d4","ts":1,"biz":"Sri Textiles","title":"Silk sale","cat":"Fashion","type":"poster","link":"https://example.com","phone":"+91 98765 43210","email":"hello@example.com","fx":"shine","prices":[["Sri Textiles",2499],["Mall Store",2899]],"poster":{"c1":"#c2185b","c2":"#6a1b9a","em":"🥻","head":"Silk sale","sub":"Sri Textiles","cta":"Shop now"}}]

## Limits of this version
- Payments are NOT checked automatically. You must confirm each one in Razorpay before adding the ad.
- Views and clicks are not counted, and there is no AI poster. The poster studio uses templates.
- For automatic payment checking, a shared database, AI posters and click analytics, use the promo-pro version.
