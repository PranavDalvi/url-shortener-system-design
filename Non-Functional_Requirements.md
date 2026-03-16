# Non-Functional Requirements

_These matter more than functional ones in system design._

## Performance

- URL rediirect latency should be <100 ms
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
  - prevent phisihing domains
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
