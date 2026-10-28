# X-Road (dev) — status and cutover

Our SS: `ss.xroad.dev.dmr-dev.cloud` (X-Road account `676907492469`, infra repo `xroad/`).
Backend runs as `IS-DEV/GOV/10014/Judicial-Client` since task def `judicial-system-backend:15` (PR #16, 2026-10-28).

## Subsystems

| Subsystem | Job |
|---|---|
| `IS-DEV:GOV:10014:Judicial-Client` | Backend calls out as this. Self-signed client cert on it (HTTPS, mTLS). |
| `IS-DEV:GOV:10014:Judicial-Protected` | Hosts our services: `judicial-system-v2` (xrd-api), `judicial-system-mailbox-api`. |
| `Rettarvorslugatt-*` (old) | Same names also on the island.is SS. Keep until cutover. |

Renamed from `Rettarvorslugatt-*` so the old island.is SS and ours stop advertising the same IDs
(global config would pick either server for inbound calls).

Client cert/key and SS TLS cert are in Secrets Manager `judicial/backend/XROAD_CLIENT_{CERT,KEY,PEM}`.
Backend sets `rejectUnauthorized: false`, so the SS TLS cert name (`ip-10-67-...`) doesn't matter.

## Outbound calls (as Judicial-Client), tested 2026-10-28

| Provider | Service | X-Road access | Network | Result |
|---|---|---|---|---|
| Police `10005` | `Logreglan-Private/rettarvarsla-v1` | Done | Done | Works |
| DMR `10014` | `DMR-Protected/sakaskra-dev` | Done (our SS) | Done | Works |
| Courts `10019` | `Domstolasyslan/JusticePortal-v1` | **Waiting on courts** | Our side open | `AccessDenied` |

Infra that made this work: PR #87 (SS egress 3333), PR #88 (courts IP on 5500/5577 egress, primary uses SS list),
PR #89 (internal NLB 5500 listener for SS self-call to sakaskra). ECS allows max 5 LB configs per service,
so the internal NLB 5577 listener has no targets (unused; remove later, stack needs tofu).

## Firewalls

| Way | Police (RLS `194.105.255.133`) | Courts (`217.171.216.16`) |
|---|---|---|
| Us -> them, our side | Open | Open |
| Us -> them, their side | Open | Asked |
| Them -> us, our side | Open | Not needed (courts never call in) |

Our IPs: out (NAT) `54.228.11.75`; in (public NLB, 5500/5577) `54.171.196.51`, `99.81.252.70`, `54.247.94.108`.

## Third-party requests (sent 2026-10-28)

- Police: done, except calling us on the new path. Waits for cutover.
- Courts: access for `Judicial-Client` + allow `54.228.11.75`. Pending.

## Cutover (do together)

Until then police still call in on `Rettarvorslugatt-Protected`. Don't delete the old subsystems before this.

1. Police switch inbound calls to `IS-DEV/GOV/10014/Judicial-Protected/judicial-system-v2`.
2. island.is mailbox: change `infra/src/dsl/xroad.ts` (`JudicialSystemServicePortal`, ~line 1002) in upstream island.is
   from `Rettarvorslugatt-Private/judicial-system-mailbox-api` to `Judicial-Protected/judicial-system-mailbox-api`.
   Test via "my cases" in the island.is dev service portal (real inbound test).
3. Delete `Rettarvorslugatt-Client` / `-Protected` (and `-Private`) on both the island.is SS and ours.

## Prod notes

- Same subsystem names, other member: island.is prod used `IS/GOV/5804170510/...`.
- Prod instance path `/r1/IS`.
- Prod RLS IPs: `194.105.255.131`, `194.105.255.132`.
- Needs the internal NLB 5500 listener (PR #89) and courts egress (PR #88) in prod config.
