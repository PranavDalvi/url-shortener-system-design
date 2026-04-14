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
