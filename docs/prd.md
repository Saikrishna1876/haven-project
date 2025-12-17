## Implementation Guide :

# **PHASE 1 — CORE SYSTEM DESIGN (30–45 min)**

Before coding, define these 4 components:

## **1. User Authentication Layer**

- Use **email + password + OTP**
- OR OAuth (Google, GitHub) but don’t _depend_ on it
- Store minimal user profile

---

## **2. Vault Data Model (Encrypted Storage)**

Create tables/collections for:

### **`users`**

- id
- email
- public_key (for encryption)

### **`vault_items`**

Each asset the user adds:

- id
- user_id
- asset_type (cloud, crypto, social, finance…)
- name
- metadata (platform name, account ID)
- encrypted_payload (instructions, keys, recovery codes)
- created_at

### **`trusted_contacts`**

- id
- user_id
- contact_email
- role (viewer/executor)
- verification_status

### **`rules`**

- inactivity_duration
- approval_required
- conditions

### **`audit_logs`**

- user_id
- action
- timestamp

---

## **3. Encryption System**

Use:

### **✔ AES for encrypting vault data**

### **✔ RSA for encrypting AES keys**

### **✔ Web Crypto API (browser) for operations**

Flow:

1. Generate **AES key** when user adds an asset
2. Encrypt asset data with AES
3. Encrypt AES key with user’s RSA public key
4. Store ciphertext + encrypted AES key
5. Only user’s private key (client device) can decrypt

**Note:** This is hackathon-level but correct.

---

# **✅ PHASE 2 — USER FEATURES IMPLEMENTATION**

---

# **STEP 1 — Asset Registration (2–3 hours)**

### **UI Page: _“Add New Asset”_**

### ✔ Detect services from their email inbox

When users connect their email (Gmail API / IMAP), your system can automatically find:

- Subscription receipts
- Login notifications
- Registration emails
- Domain renewals
- Cloud invoices
- Trading updates
- GitHub/Vercel deployment mails
- Crypto exchange statements

Your system then builds an **automatic inventory** of the user’s digital accounts.

### The user only taps “Confirm” for each detected asset → WAY less manual work.

⚠️ You don’t access content, only metadata from emails they allow you to read.

---

# **STEP 2 — Trusted Contacts (1–2 hours)**

### **UI Page: _“Add Trusted Contact”_**

Fields:

- Email

### **Flow:**

1. Add contact
2. Send them verification email
3. Contact clicks link → verification complete
4. Show contact status on dashboard

### Why:

Prevents unauthorized access.

---

# **STEP 3 — Rule Engine (1–1.5 hours)**

You only need **one rule** for MVP:

### **Inactivity Timer Rule**

- Track last login timestamp
- If no login for X days → trigger unlock

---

# ⭐ **ADDED (AS REQUESTED): Email‑Ping Activity Check**

### **Email Ping System (simple, no PRD changes)**

In addition to the inactivity timer:

1. System sends a **“Are you still active?” email** after X days of no login
2. Email contains a **single secure button**: “Yes, I’m active”
3. When user clicks it → backend updates `lastActive`
4. If user **ignores multiple pings** → inactivity rule triggers normally

This **does not modify any existing logic**, it only adds a safe activity‑confirmation step.

---

# **STEP 4 — Vault Unlock + Recovery Package (1.5 hours)**

### When rules + approvals match:

1. Decrypt AES keys using **executor’s key**
2. Generate “Recovery Package”:
   - Asset list
   - Instructions
   - Encrypted credentials
   - Files
   - Service-specific guidance
3. Bundle into:
   - ZIP file
   - Secure link (24–48 hr expiry)

### Send to:

- Verified trusted contacts only

No bypassing any service.  
No auto-login.  
Only secure **transfer of user-stored information**.

---

# **STEP 5 — Audit Log (30 min)**

Log every critical action:

- Vault unlock
- Trusted contact verification
- Asset decryption
- Rule trigger
- Package download

Show logs in dashboard.

---

# **STEP 6 — UI DASHBOARD (1.5–2 hours)**

Pages:

1. Home
   - Total assets
   - Contacts
   - Last activity
2. Assets
   - Add asset
   - List assets
   - Edit/remove
3. Trusted Contacts
   - Add contact
   - Status
4. Rules
   - Set inactivity timer
   - Approvals needed
5. Audit Logs

Make UI clean and minimal.

---

# **PHASE 3 — WHAT TO EXCLUDE (VERY IMPORTANT)**

To be ethical & safe:

### ❌ No bypassing 2FA

### ❌ No auto‑login into other platforms

### ❌ No API integrations that impersonate the user

### ❌ No unauthorized scraping

### ❌ No illegal account transfers

Your system is:

> A Secure Delivery Mechanism for data the user voluntarily stored,  
> not a hacking platform.

---

# **PHASE 4 — DEMO FLOW (1 minute WOW demo)**

### 1. Add asset

- “AWS Account Backup”
- Add instructions
- Add credentials
- Vault encrypts

### 2. Add trusted contact

- Verify email

### 3. Set inactivity rule to 1 minute (for demo)

### 4. Wait for timer

Contact receives email  
Clicks approval link  
Vault unlocks

### 5. Show recovery package

Download → ZIP → contains structured files + instructions

Judges LOVE this clean and emotional flow.

---
