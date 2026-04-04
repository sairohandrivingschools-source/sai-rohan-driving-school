# Sai Rohan Driving School — Complete Client Handover Guide

---

## 1. YOUR ACCOUNTS & LOGIN CREDENTIALS

Fill in the passwords below before handing over this document.

| Service | Login Method | Account | Link |
|---------|-------------|---------|------|
| **Gmail** | — | `[CLIENT GMAIL]` | gmail.com |
| **GitHub** | Login with Gmail | `[CLIENT GMAIL]` | github.com |
| **Vercel** | Login with GitHub | same as GitHub | vercel.com |
| **Firebase** | Login with Gmail | `[CLIENT GMAIL]` | console.firebase.google.com |
| **GoDaddy** | Login with Gmail / email+password | `[CLIENT GMAIL or GODADDY EMAIL]` | godaddy.com |

> **Important:** Always use the same Gmail account to log in everywhere. Do NOT create separate accounts.

---

## 2. YOUR WEBSITE

- **Live URL:** https://www.sairohandrivingschool.com
- **Admin Panel:** https://www.sairohandrivingschool.com/admin-sairohan
- **Source Code:** https://github.com/sairohandrivingschools-source/sai-rohan-driving-school

### How the website works
- Code lives on **GitHub**
- **Vercel** automatically deploys the website every time code is pushed to GitHub
- Content (courses, reviews, gallery, etc.) is stored in **Firebase Firestore** database
- The admin panel lets you change all content without touching any code

---

## 3. ADMIN PANEL — HOW TO USE

### Accessing the Admin Panel
1. Go to: **https://www.sairohandrivingschool.com/admin-sairohan**
2. Enter your admin email and password (set in Firebase Authentication)
3. Click **Sign In**

> To change your admin password: Go to Firebase Console → Authentication → Users → click the 3 dots next to your email → Reset password

---

### Admin Panel Sections

#### 📚 Courses
- **Add a course:** Click "+ Add Course" → fill in name, duration, sessions, features (one per line), price, tag → Save
- **Set a price:** Enter price in the "PRICE (₹)" field. If you want to hide it from the website, toggle "Hide price from website"
- **Hide a course:** Click "🙈 Hide" button — the course disappears from the website but stays in your database
- **Edit a course:** Click "✏️ Edit"
- **Delete a course:** Click "🗑 Delete"
- **First time only:** Click "Load Defaults" to populate with the original 3 courses

#### ⭐ Reviews
- **Add a review:** Click "+ Add Review" → enter student name, review text, star rating → Save
- **Hide a review:** Click "🙈 Hide" — removed from website but not deleted
- **First time only:** Click "Load Defaults" to populate with original 8 reviews

#### 📸 Gallery
- **Add a photo:** Click "+ Add Photo" → paste an image URL → add caption → Save
- **Tip:** Upload photos to Google Drive or ImgBB (imgbb.com) to get a URL
- **Hide a photo:** Click "🙈 Hide"
- **First time only:** Click "Load Defaults" for original photos

#### 💪 Why Us
- Edit the 6 benefit cards shown on the website
- Change the emoji icon, title, and description for each card
- **First time only:** Click "Load Defaults"

#### ❓ FAQs
- Add, edit, delete or hide any frequently asked questions
- **First time only:** Click "Load Defaults"

#### 🏠 Hero Section
- Edit the main headline, sub-text, badge text, and stats
- Stats: change "1000+" students, "4.8 ★" rating, "98%" pass rate
- Change the "Since 2015" year badge

#### 📞 Contact Info
- Update phone numbers, WhatsApp number, address, Google Maps link
- **WhatsApp number format:** Country code + number, no spaces or + sign (e.g. `919133999282`)

#### 🔍 SEO Settings
- **Page Title:** Text shown in Google search results and browser tab
- **Meta Description:** Short description shown under your website name in Google (keep under 160 characters)
- **Keywords:** Comma-separated words people might search for
- **OG Image:** Image shown when someone shares your link on WhatsApp/Facebook (1200×630 pixels recommended)

#### 📢 Announcement Banner
- Show/hide a colored banner at the top of the website
- Use for special offers, holidays, or announcements
- Choose banner color and type your message

#### 📋 Enquiry Submissions
- View all enquiries submitted through the website contact form
- Shows name, phone, course selected, timing preference, and submission date
- Click on a phone number to call directly

---

### First-Time Setup Checklist
After logging in for the first time, go to each section and click **"Load Defaults"** to populate:
- [ ] Courses
- [ ] Reviews
- [ ] Gallery
- [ ] Why Us
- [ ] FAQs

---

## 4. HOW TO UPDATE YOUR WEBSITE (No Coding Needed)

For **content changes** (courses, prices, reviews, gallery, FAQs, contact info):
→ Use the **Admin Panel** — changes go live instantly

For **design/layout changes** (colors, fonts, major redesign):
→ You will need a developer to edit the code on GitHub and push changes

---

## 5. TRANSFERRING THE GODADDY DOMAIN TO CLIENT'S ACCOUNT

Since the domain was purchased on your personal GoDaddy account, you need to transfer it to the client's GoDaddy account. Follow these steps:

### Step 1 — Client creates a GoDaddy account
1. Client goes to **godaddy.com** → Click **Sign In** → **Create Account**
2. Register with the **client's Gmail** address
3. Note down the GoDaddy username (shown after signup)

### Step 2 — Push the domain to client's account (no downtime)
1. Log in to **your** GoDaddy account (the one where the domain was bought)
2. Go to **My Products** → find `sairohandrivingschool.com`
3. Click **Manage** on the domain
4. Look for **Domain Settings** or the **⋮ More** menu
5. Select **Transfer Domain** → **Transfer to another GoDaddy account**
6. Enter the client's GoDaddy **username or email**
7. Confirm the transfer

> The domain moves instantly with zero downtime. No DNS changes needed.

### Alternative: Change Account Contact Email
If a full account transfer is preferred:
1. Log in to GoDaddy → **Account Settings** → **Contact Information**
2. Change the email address to the client's Gmail
3. Verify the new email when prompted

---

## 6. HOW DEPLOYMENTS WORK

```
You make a change in code
        ↓
Push to GitHub (git push)
        ↓
Vercel automatically detects the push
        ↓
Vercel builds and deploys in ~1 minute
        ↓
Live on sairohandrivingschool.com ✅
```

You can monitor deployments at: **vercel.com/dashboard**

---

## 7. FIREBASE FREE PLAN LIMITS (Spark Plan)

Your Firebase is on the free Spark plan. These are the daily limits:

| Resource | Free Limit | Expected Usage |
|----------|-----------|---------------|
| Reads | 50,000/day | Very low (website visits) |
| Writes | 20,000/day | Very low (enquiry submissions) |
| Storage | 1 GB | Very low (text only) |

You will likely **never hit these limits** for a driving school website. No payment needed.

---

## 8. IMPORTANT CONTACTS & LINKS

| What | Link |
|------|------|
| Live Website | https://www.sairohandrivingschool.com |
| Admin Panel | https://www.sairohandrivingschool.com/admin-sairohan |
| Source Code | https://github.com/sairohandrivingschools-source/sai-rohan-driving-school |
| Vercel Dashboard | https://vercel.com/dashboard |
| Firebase Console | https://console.firebase.google.com/project/sai-rohan-driving-schools |
| GoDaddy Domains | https://dcc.godaddy.com/manage |

---

## 9. TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Admin panel not loading | Check internet connection; try hard refresh Ctrl+Shift+R |
| Can't log in to admin | Go to Firebase → Authentication → Reset password |
| Content not updating on website | Clear browser cache; wait 30 seconds for Firestore sync |
| Website is down | Check Vercel dashboard for deployment errors |
| Domain not working | Check GoDaddy → DNS settings; contact GoDaddy support |

---

*Document prepared for handover — Sai Rohan Motor Driving School*
