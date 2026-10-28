# Prod account — todo and manual steps

Things prod needs that dev did by hand or that are not in Terraform yet.
Record each manual step here, with the exact command, as it is done in dev.

## 1. Network to X-Road (TGW)

Dev reference: account `640538430394`, VPC `vpc-0014be8651be6f7e6` (`10.74.48.0/20`).

- [ ] Attach the prod VPC to TGW `tgw-0a48062cd589a359f` (shared from `405032865706`), private subnets only.
      Dev: `tgw-attach-010458dfb209c7e3f`, done by hand / by network owner.
- [ ] TGW side (`405032865706`): accept the attachment and associate/propagate it in the right TGW route table.
- [ ] Prod private route table: send the X-Road VPC ranges to the TGW.
      Dev: `10.67.0.0/26`, `10.67.0.64/26`, `10.67.0.128/26` in `Dev-vpc-private`.
- [ ] Security server SG: allow the prod VPC CIDR on the client port.
- [ ] DNS, X-Road side: add the prod VPC id to `associated_ingress_vpc_ids` in
      `infrastructure/xroad/config/prod.yml` and apply. Dev: `xroad/config/dev.yml` (JM-13).
- [ ] DNS, our side: set `xroad.internal_zone_id` in `infrastructure/judicial/config/prod.yml`,
      add `judicial/prod/xroad_hosted_zone_association/terragrunt.hcl` (copy of dev) and apply.
- [ ] Verify from a prod backend task: SS name resolves to a private IP and the client port answers.
- [ ] DNS, other way (SS -> our APIs): add the prod judicial `dmr.local` zone id to
      `internal_zone_ids_for_associations` in `infrastructure/xroad/config/prod.yml`, and the prod
      VPC CIDR to `associated_internal_cidr_blocks`. Dev: `xroad/config/dev.yml` (JM-13),
      zone `Z04274842LO8GBFISDS4J`, CIDR `10.74.48.0/20`.
- [ ] SG, SS -> our APIs: allow the prod X-Road VPC private subnets on 3333 on the xrd-api and
      digital-mailbox-api SGs only. Dev: `terraform/dev/judicial_xroad_apis.tf`, `xroad_ss_private_cidrs`.

## 2. X-Road client update (backend)

Dev points at `ss.xroad.dev.dmr-dev.cloud` (`terraform/dev/judicial_backend.tf`).

Dev status, cutover and IPs: `docs/dmr/xroad.md`.

- [ ] Pick the prod member code (island.is prod used `5804170510`, not `10014`). Instance path `/r1/IS`.
- [ ] Register the `Judicial-Client` subsystem on the prod SS. Backend uses `XROAD_CLIENT_ID=IS/GOV/<member>/Judicial-Client` (dev: `IS-DEV/GOV/10014/Judicial-Client`).
- [ ] Register the `Judicial-Protected` subsystem on the prod SS. It publishes xrd-api (`judicial-system-v2`) and digital-mailbox-api (dev: `IS-DEV:GOV:10014:Judicial-Protected`).
- [ ] Prod xroad config: courts egress on 5500/5577 (PR #88), internal NLB 5500 listener for sakaskra self-call (PR #89),
      prod RLS IPs `194.105.255.131`, `194.105.255.132`.
- [ ] Client TLS cert / key, if the SS requires mTLS, stored in Secrets Manager.
- [ ] Access rights on the providers' side for the new client: courts (`10019`, `JusticePortal-v1`),
      police (`10005`, `rettarvarsla-v1`), DMR criminal record (`10014`, `sakaskra`).
- [ ] Update `XROAD_BASE_PATH`, `XROAD_BASE_PATH_WITH_ENV`, `XROAD_TLS_BASE_PATH`,
      `XROAD_TLS_BASE_PATH_WITH_ENV`, `XROAD_CLIENT_ID` to the DMR prod SS.
- [ ] Provider side for xrd-api and digital-mailbox-api: publish them as services under `Judicial-Protected` on the SS.
      island.is had: mailbox = `Rettarvorslugatt-Private/judicial-system-mailbox-api`
      (prod member `5804170510`, not `10014`) -> `judicial-system-digital-mailbox-api-xrd.internal.island.is`;
      xrd-api -> `judicial-system-xrd-api.internal.island.is`. Ours: `judicial-system-<svc>.dmr.local:3333`.
- [ ] Smoke test one court and one police call; check the message-handler DLQ is empty.

## 3. IDS cutover (login)

Open question: does DMR keep using island.is IDS? Confirm before prod.

- [ ] Confirm IDS owner and that prod clients stay on `innskra.island.is`.
- [ ] Register / move the prod client `@rettarvorslugatt.island.is/web`:
      redirect URI `https://<prod host>/api/auth/callback/identity-server`, logout URI `https://<prod host>`.
- [ ] Client secret into Secrets Manager.
- [ ] `IDENTITY_SERVER_ISSUER_URL` -> prod IDS (api and digital-mailbox-api).
- [ ] `ALLOW_AUTH_BYPASS` must be `false` (or unset) in prod. Dev has it `true`.
- [ ] Test login and logout end to end.
