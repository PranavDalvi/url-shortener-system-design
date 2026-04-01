# URL Shortener System Design
## Overview

A scalable URL shortener system designed to handle high read traffic (100K RPS) with low latency redirects (<100ms), featuring caching, analytics, and abuse prevention.

***

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

# Non-Functional Requirements

_These matter more than functional ones in system design._

## Performance

- URL redirect latency should be <100 ms
- Link creation latency should be < 500 ms

## Scalability

- System should support:
  - 10 million monthly active users
  - 100 million URLs stored
  - 100K redirect requests per second

## Availability

- Redirect service should have 99.9% uptime.
- Short links must always resolve reliably.

## Durability

- All URL mappings must be persisted reliably.
- No link should be lost after creation.

## Consistency

- Redirect results should be strongly consistent.
- A short URL should always map to the correct long URL.

## Security

- System should:
  - validate URLs
  - prevent phishing domains
  - rate limit API usage
  - protect user accounts

## Storage Constraints

- Maximum long URL length: `4096 characters (typical browser limit)`
- Short URL length target: `6 - 8 characters`
  - Example `sho.rt/aB3dX9`

## Capacity Estimation

- Example assumption: `100M URLs stored`
- Each record:
  - long URL ~ 3KB
  - metadata ~ 500B
- Storage needed:
  ~350GB total

## System Constraints

- Define these early:
  - Short URL length: 6 - 8 characters
  - Character set: BASE62
  - [a-zA-Z0-9]
  - 62^7 ≈ 3.5 trillion combinations

# API Endpoints Design

## Main resources are:

- URL
- User
- Analytics
- Reports

## URL Management APIs

### Create Short URL

- `POST /api/v1/urls`
- Request

```bash
{
    "longUrl": "https://example.com/some/very/long/url",
    "title":"my first short url",
    "customAlias": "my-link",
    "expiryDate": "2026-12-01T00:00:00Z",
}
```

- Response

```bash
  {
  "id": "url_123",
  "title":"my first short url",
  "shortUrl": "https://sho.rt/my-link",
  "longUrl;": "https://example.com/some/very/long/url",
  "createdAt": "2026-03-08T18:00:00Z",
  "expiryDate": "2026-12-01T00:00:00Z",
  }
```

### Check if custom alias is available

- `GET /api/v1/urls/check-alias?alias=my-link`
- Response

```bash
{
    "available":true
}
```

### Redirect Short URL

_This is a highest traffic endpoint._

- `GET /{shortKey}`
- Request

```bash
https://sho.rt/aB3dX9
```

- Response

```bash
HTTP 302 Redirect
Location: https://example.com/some/very/long/url
```

### Get URL Details

- `GET /api/v1/urls/{shortKey}`

- Request

```bash
/api/v1/urls/{shortKey}
```

- Response

```bash
"id":"url_123",
"title":"my first short url",
"shortUrl": "https://sho.rt/my-link",
"longUrl": "https://example.com/some/very/long/url",
"createdAt": "2026-03-08T18:00:00Z",
"expiryDate": "2026-12-01T00:00:00Z",
```

### List User URLs

- `GET /api/v1/urls`

- Request:
  `GET /api/v1/urls?page=1&limit=20&status=active&search=google&sort=createdAt&order=desc`

- Filters will be:
  - status: ["active", "disabled", "blocked", "deleted"]
  - deleted because when user delete the url it should be in recycle bin for 30 days.
  - search: on longUrls, shortUrls / custom alias.
  - Sort by createdAt, updatedAt, clickCount, expiryDate, title

- Response

```bash
{
  "data": [
    {
      "shortKey": "google",
      "shortUrl": "https://sho.rt/google",
      "longUrl": "https://google.com",
      "clickCount": 245,
      "createdAt": "2026-03-10"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8,
  }
}
```

### Update URL

- `PATCH /api/v1/urls/{shortKey}`

- Request

```bash
{
    "longUrl": "https://newsite.com",
    "expiryDate": "2027-01-01",
}
```

### Delete URL

- `DELETE /api/v1/urls/{shortKey}`

- Response

```bash
{
  "status": "scheduled_for_deletion"
}
```

- add deleted_at field for soft delete

### Authentication APIs

- Register
- `POST /api/v1/auth/register`

```bash
{
    "name":"pranav dalvi",
    "email":"pranav.dalvi@example.com",
    "password":"securePassword*123"
}
```

- Response

```bash
{
  "accessToken": "jwt_access_token",
  "refreshToken": "refresh_token",
}
```

- Login
- `POST /api/v1/auth/login`
- Returns

```bash
{
    "accessToken":"jwt_token",
    "refreshToken":"refresh_token",
}
```

- Refresh Token
- `POST /api/v1/auth/refresh`
- Request

```bash
{
    "refreshToken":"refresh_token",
}
```

- Response

```bash
{
    "accessToken":"new_access_token",
    "refreshToken": "new_refresh_token",
}
```

- Get Current User
- `GET /api/v1/auth/me`

### Analytics APIs

- Get URL Analytics
- `GET /api/v1/urls/{shortKey}/analytics?from=2026-03-01&to=2026-03-07`
- Response

```bash
{
    "totalClicks":1543,
    "dailyClicks": [
        {"date":"2026-03-07", "clicks": 120},
    ],
    "topCountries":[
        {"country":"IN", "clicks":600},
    ]
}
```

### Abuse / Reporting APIs

- Report Malicious URL
- `POST /api/v1/urls/{shortKey}/report`
- Request

```bash
{
    "shortUrl":"https://sho.rt/aB3dX9",
    "reason":"phishing",
}
```

### Advance Features

- Generate QR Code
- `GET /api/v1/urls{id}/qr`

- Preview Redirect Page
- `GET /preview/{shortKey}`

- Bulk Creation
- `POST /api/v1/urls/bulk`
- Request

```bash
{
  "urls": [
    "https://google.com",
    "https://youtube.com",
  ]
}
```

### API Rate Limits

- Example
- Create URL -> 10/month (free user)
- Redirect -> unlimited
- Login -> 10/min

# ER Diagram
![](./Diagrams/ER-diagram-raw.webp)

# HLD Diagram
![](./Diagrams/HLD.webp)

## Tech Stack

- Backend: Node.js (Express)
- Database: PostgreSQL
- Cache: Redis
- Queue: Kafka (planned)

## Architecture Overview

The system uses:
- CDN for edge caching
- Redis for hot key lookup
- PostgreSQL as source of truth
- Asynchronous pipeline for analytics

## Trade-offs

- Used auto-increment + Base62 for simplicity
- At scale, this can become a bottleneck → replace with distributed ID generator
- Redis improves latency but introduces cache invalidation complexity

## Scaling Strategy

- Read-heavy system → cache-first design
- CDN handles global traffic
- Redis reduces DB load
- Database can be sharded by short_key

## Future Improvements

- Distributed ID generation
- Geo-based routing
- Advanced analytics pipeline (Kafka + OLAP DB)
