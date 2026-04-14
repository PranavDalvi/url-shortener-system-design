# Functional Requirements
## Core URL Features

- Users should be able to **convert a long URL into a short** URL.
- System should generate a **unique short key** for each URL.
- Visiting a short URL should **redirect to the original URL**.
- Users should be able to create a **custom aliases** (back half).
- Users should be able to set **expiration time** for links.
- System should allow users to delete their own short URLS.
- System should allow users to update destination URL.

## User Management

- Users should be able to register and login.
- Authenticated users should be able to view all links they created.
- System should support free and paid user tiers. `(Free users -> 10 links per month, cannot edit/change the redirect URL | paid users -> unlimited and can edit)`.

## Analytics

- System should track number of click per short URL.
- System should record basic analytics:
  - timestamp
  - referrer
  - country
  - device type
- User should be able to **view analytics dashboard**.

## Abuse & Safety

- Users should be able to **report malicious URLs**.
- System should detect **duplicate links** (for same user only).
- System should prevent spam link generation via rate limiting (5 URLs per 15 mins).

## Optional Features

- Generate QR code for shorten URL.
- Provide previews page before redirects to prevent phishing.
- Allow password-protected links.
- Allow temporary links
