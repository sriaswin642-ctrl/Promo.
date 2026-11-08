# Promo (version 2)

Poster and video ads with price comparison, secure online payment, voice assistant,
AI poster studio, hourly auto colours and an owner-only insights page.

## What is in this folder
- `public/`  the website (index.html, styles.css, app.js, logo.png)
- `api/`     the server functions (payment, database, tracking, AI, stats)
- `lib/`     shared server code
- `vercel.json`, `package.json`, `.env.example`

## Set up (about 20 minutes)
1. Upload ALL files and folders to your GitHub repository (replace the old files). Keep the folder names exactly: `api`, `lib`, `public`.
2. In Vercel, open the project > Settings > Build and Deployment: Framework Preset = Other, leave Build and Install commands empty.
3. Database: Vercel project > Storage > Marketplace > "Upstash for Redis" > create a free database and connect it to the project. This adds the database variables automatically.
4. Payments: create a Razorpay account (razorpay.com). In Test Mode, copy the Key ID and Key Secret.
5. Vercel > Settings > Environment Variables. Add: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, PRICE_INR (99), ADMIN_KEY (your own long password), and optionally ANTHROPIC_API_KEY (for AI posters and AI insights).
6. Redeploy: Deployments > the latest > Redeploy.
7. Test with Razorpay TEST mode: post an ad and pay with the test UPI ID `success@razorpay` (see Razorpay's test-mode docs). The ad should appear on Home.
8. When everything works, finish Razorpay's KYC, switch to Live keys, and replace the two key variables in Vercel.

## Optional: webhook (publishes the ad even if the buyer closes the page after paying)
Razorpay Dashboard > Webhooks > add `https://YOUR-SITE/api/webhook`, event `payment.captured`, and a secret.
Put the same secret in Vercel as RAZORPAY_WEBHOOK_SECRET. If the webhook shows "Bad signature" in Razorpay's logs, remove it. The site still works without it.

## Notes
- Never put secret keys in GitHub or in the `public` folder.
- The price is set on the server (PRICE_INR). Visitors cannot change it.
- The database keeps the newest 1,000 ads.
- Vercel's free Hobby plan is for non-commercial projects. A site that takes payments needs Vercel Pro, or another host.
