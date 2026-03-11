# Air Discount Scheme (ADS) - Documentation

The Air Discount Scheme (Loftbrú) provides flight discounts for residents of remote areas in Iceland. The system consists of three applications (backend, api, web) and shared libraries.

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐     ┌───────┐
│   Web App   │────▶│  API (GQL)  │────▶│  Backend (REST)  │────▶│ Redis │
│  (Next.js)  │     │  (NestJS)   │     │    (NestJS)      │     │ Cache │
└─────────────┘     └─────────────┘     └─────────────────┘     └───────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  PostgreSQL  │
                                        └─────────────┘
```

- **Web** (`apps/air-discount-scheme/web/`): Next.js frontend for users and admins
- **API** (`apps/air-discount-scheme/api/`): NestJS GraphQL gateway
- **Backend** (`apps/air-discount-scheme/backend/`): NestJS REST API with business logic, runs on port 4248

---

## Backend

### Modules

#### 1. Discount Module (`backend/src/app/modules/discount/`)

Manages discount code creation, caching, and usage.

**Discount Code Generation:**
- Codes are 8-character alphanumeric strings
- Character set: digits 1-9, letters A-N, P-Z (excludes 0 and O to avoid user confusion)
- Normal flight codes end with digit 0-4
- Connecting flight codes end with digit 5-9
- Codes are stored in Redis with a 24-hour TTL by default

**Key Methods (DiscountService):**
- `createDiscountCode(user, nationalId, connectableFlights, ...)` — Generates a main discount code and one connection discount code per connectable flight
- `createExplicitDiscountCode(auth, nationalId, ...)` — Admin-created discount for special cases. Records in ExplicitCode DB table with audit trail
- `createManualDiscountCode(body, auth, isExplicit)` — Creates explicit codes via admin form
- `getDiscountByNationalId(nationalId)` — Retrieves cached discount by national ID
- `getDiscountByDiscountCode(code)` — Looks up discount by code (checks normal codes first, then connection codes)
- `useDiscount(code, nationalId, flightId, isConnectionDiscount)` — Marks a discount as used; removes from cache
- `reactivateDiscount(flightId)` — Re-enables discount if flight is cancelled before TTL expires

**Cache Keys:**
| Key Pattern | Purpose |
|---|---|
| `discount_user_lookup_{nationalId}` | Points user to their discount cache |
| `discount_id_{uuid}` | Stores the CachedDiscount object |
| `discount_code_lookup_{code}` | Maps normal code → cache ID |
| `connection_discount_{code}` | Maps connection code → cache ID |
| `discount_flight_lookup_{flightId}` | Maps used flight → cache ID (for reactivation) |
| `explicit_code_lookup_{code}` | Flags a code as admin-created |

**Models:**
- `Discount` — Value object: user, discountCode, connectionDiscountCodes[], nationalId, expiresIn
- `ExplicitCode` — DB model: id, code, customerId, employeeId, comment, flightId
- `ConnectionDiscountCode` — Value object: code, flightId, flightDesc, validUntil

#### 2. Flight Module (`backend/src/app/modules/flight/`)

Manages flight registration, validation, and financial state tracking.

**DB Models:**
- `Flight` — id, nationalId, userInfo (JSONB), bookingDate, connectable (boolean), flightLegs[]
- `FlightLeg` — id, flightId, airline, cooperation, origin, destination, originalPrice, discountPrice, date, isConnectingFlight, financialState, financialStateUpdated

**Financial State Machine:**
```
awaitingDebit ──(send)──▶ sentDebit ──(revoke)──▶ awaitingCredit ──(send)──▶ sentCredit [final]
awaitingDebit ──(revoke)──▶ cancelled [final]
```

**Connecting Flight Logic:**
A connecting flight is valid when ALL conditions are met:
1. One flight touches Reykjavik (RKV/REK)
2. One flight touches Akureyri (AEY) — Akureyri must be the common point
3. Both flights use allowed airports: VPN (Vopnafjörður), GRY (Grímsey), THO (Þórshöfn), AEY (Akureyri)
4. Flights are within 48 hours of each other

**Grace Period:**
- Flights departing FROM Reykjavik: connection code valid for 48 hours after flight date
- Flights arriving TO Reykjavik: connection code valid until flight date

**Constants:**
- `CONNECTING_FLIGHT_GRACE_PERIOD`: 48 hours (ms)
- `REYKJAVIK_FLIGHT_CODES`: ['RKV', 'REK']
- `AKUREYRI_FLIGHT_CODES`: ['AEY']
- `ALLOWED_CONNECTING_FLIGHT_CODES`: ['VPN', 'GRY', 'THO']

#### 3. User Module (`backend/src/app/modules/user/`)

Manages user eligibility and fund calculations.

**Eligibility (ADS Postal Codes):**
- 380 (Reykhólahreppur)
- 471–510 (Þingeyri to Hólmavík)
- 530–785 (Hvammstangi to Öræfi) — excludes 530, 531 (Hvammstangi)
- 900 (Vestmannaeyjar)

**Fund Calculation:**
- 6 flight legs per year (default since 2021; 2 in 2020)
- Fund = { credit: remaining legs, used: booked legs, total: year allocation }
- Eligible if: lives in ADS postal code, OR is a minor with eligible parent/custodian, OR isManual flag

#### 4. National Registry Module (`backend/src/app/modules/nationalRegistry/`)

Integrates with Iceland's National Registry (Þjóðskrá) API.
- `getUser(nationalId)` — Fetches individual data (address, name, gender)
- `getCustodians(nationalId)` — Gets custody parents for a child
- `getRelations(nationalId, auth)` — Gets user's dependent children
- Uses test data in non-production environments

#### 5. Cache Module (`backend/src/app/modules/cache/`)

Redis-based distributed caching.
- Production: Redis Cluster with SSL (ioredis)
- Test: In-memory cache

#### 6. Common Module (`backend/src/app/modules/common/`)

Authentication guard that validates Bearer token API keys from environment config. Maps API keys to airline names.

### REST API Endpoints

**Public (Airline Partners):**
| Method | Path | Description |
|---|---|---|
| GET | `/api/public/discounts/:code/user` | Get masked user info by discount code |
| POST | `/api/public/discounts/:code/flights` | Register flight with discount code |
| POST | `/api/public/discounts/:code/isValidConnectionFlight` | Validate connection flight eligibility |
| GET | `/api/public/flights/:id` | Get flight details |
| DELETE | `/api/public/flights/:id` | Cancel flight |
| DELETE | `/api/public/flights/:id/flightLegs/:legId` | Cancel single flight leg |

**Private (Internal/Admin):**
| Method | Path | Description |
|---|---|---|
| POST | `/api/private/users/:nationalId/discounts` | Generate discount code |
| GET | `/api/private/users/:nationalId/discounts/current` | Get current discount |
| POST | `/api/private/users/createExplicitDiscountCode` | Admin manual code creation |
| POST | `/api/private/users/createSuperExplicitDiscountCode` | Super explicit code |
| GET | `/api/private/users/:nationalId/flights` | List user flights |
| GET | `/api/private/users/userAndRelationsFlights` | User + dependents' flights |
| GET | `/api/private/flights` | List all flights (admin) |
| POST | `/api/private/flightLegs` | Query flight legs with filters |
| POST | `/api/private/flightLegs/confirmInvoice` | Finalize financial states |

---

## API (GraphQL Gateway)

NestJS GraphQL API at `/api/graphql`. Acts as a gateway between the web frontend and the backend REST API.

**Modules:**
- **DiscountResolver** — `discounts` query (fetches/creates discounts for user and relations), `createExplicitDiscountCode` mutation
- **UserResolver** — `user` query, computed `role` and `meetsADSRequirements` fields
- **FlightResolver** — Resolves flight user field
- **FlightLegResolver** — `flightLegs` query (admin filtered), `confirmInvoice` mutation

**Key Resolver Logic (discounts query):**
1. Gets user's relations (dependents)
2. Filters to eligible users (fund.credit === fund.total - fund.used)
3. For each relation: gets existing discount or creates new one if expired (≤2 hours TTL)
4. Returns array of Discount objects with user fund info

**Auth:** IdsUserGuard + ScopesGuard + RolesGuard. Roles: USER, ADMIN, DEVELOPER.

---

## Web Frontend

Next.js application with Apollo Client for GraphQL.

**Pages:**
- `/` — Home (CMS content)
- `/min-rettindi` (is) / `/en/my-benefits` — User benefits/discount page
- `/admin` — Admin dashboard (flight leg management, invoicing)
- `/admin/discount` — Admin manual discount code creation

**Key Screens:**
- **Subsidy/Benefits** — Shows user discount codes (CodeCard components), connection flight codes, usage stats
- **Admin** — Filters, panels, summary, CSV export, invoice confirmation
- **AdminCreateDiscount** — Form for explicit discount code creation

**Auth:** NextAuth with IdentityServer4 (PKCE flow). Stores nationalId, name, accessToken, role.

---

## Shared Libraries

### Types (`libs/air-discount-scheme/types/`)
Shared TypeScript interfaces: FlightLeg, Flight, User, Fund, Discount, ConnectionDiscountCode, ExplicitCode, Gender, Role, etc.

### Constants (`libs/air-discount-scheme/consts/`)
Shared constants: routes, flight constants, cookie configs. Airline enum, States enum, Actions enum.

---

## Discount Code Lifecycle

```
1. User requests discount (web → API → backend)
2. Backend generates 8-char code (last digit: 0-4 normal, 5-9 connecting)
3. Code + connection codes stored in Redis (24h TTL)
4. User provides code to airline
5. Airline registers flight via public API (POST /api/public/discounts/:code/flights)
6. Backend validates code, checks eligibility, creates flight record
7. Discount marked as used (removed from cache)
8. If flight cancelled before TTL: discount reactivated
9. Financial state tracked: awaitingDebit → sentDebit → awaitingCredit → sentCredit
10. Admin confirms invoices monthly
```
