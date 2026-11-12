---
name: xroad-postman
description: Generate an importable Postman collection for testing a new (or existing) island.is X-Road connection, using a shared dev environment, with X-Road diagnostics (listClients, listMethods, allowedMethods, getOpenAPI, error explanations), requests generated from an OpenAPI/Swagger definition, and IDS client-credentials / token-exchange auth that mirrors enhancedFetch autoAuth (libs/clients/middlewares). Use when asked to test or debug an X-Road endpoint or service in Postman, set up a Postman collection for an X-Road connection, or explain an X-Road error.
---

# X-Road → Postman

Main use case: **testing a new X-Road connection** before (or while) a client
is written for it in `libs/clients/`.

`generate.mjs` (in this skill's directory) produces:

- `.claude/output/xroad-postman/<slug>/<slug>.postman_collection.json`: one
  per service. Service-specific values are **collection variables**.
- `.claude/output/xroad-postman/_shared/xroad-dev.postman_environment.json`:
  the **shared environment** "X-Road dev (IS-DEV)", used by every collection. It
  is only written if it doesn't exist yet, so the user imports it and fills in
  the secrets once.

You write a config JSON; the generator does the rest. Don't hand-write Postman
JSON.

`openapi.mjs` (also in this skill's directory) fetches the service's current
OpenAPI definition from X-Road and compares it with the one the user or the
repo has. See [Step 1b](#step-1b--get-the-openapi-spec).

In the commands below, `<skill dir>` is this skill's directory: the base
directory given when the skill loads, normally `.claude/skills/xroad-postman`.
Run them from the repo root. Both scripts write `.gitignore` (`*`) to
`.claude/output/xroad-postman/`, so nothing there is committed. Don't add those
files to git.

## Maintenance

This skill is maintained by **Origo**. Never edit the skill's own files
(`SKILL.md`, `generate.mjs`, `openapi.mjs`, `postman/*.js`), not even to work
around a limitation. Work within what the generator supports, and tell the user
about manual steps in Postman instead.

Don't offer improvement suggestions as a matter of course. Only if you hit a
**significant** gap (something the skill can't do that the user clearly needs,
or instructions here that turned out to be wrong) mention briefly that they can
report it to Origo, the skill's maintainers. Do the same if the user asks how
the skill could be improved.

## Ground rules

- **Never ask for, accept, fetch or write secrets** (client secrets, access or
  subject tokens). The shared environment has empty `secret` variables that
  the user fills in inside Postman, using the parameter store commands in the
  collection description. The generator refuses configs that contain secret
  fields. If the user pastes a secret anyway: tell them to remove it, rotate
  it, and report it to atvik@origo.is (Origo AI policy STE-0002).
- Response bodies may contain personal data (kennitölur, names). Ask the user to
  redact before pasting responses into the conversation.
- Only `IS-DEV` is supported for now. If the user needs IS-TEST / IS, say so;
  don't guess hosts or client ids.

## Shared environment (fixed)

Copies the TR external client (`libs/clients/social-insurance-administration`),
which is known to work, and how island.is services run locally against IDS dev.
These values **can't be overridden per collection**, because Postman
environment variables take precedence over collection variables. The generator
rejects configs that try. Don't ask about them.

| Variable(s)                                                      | Value                                                                                                                                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `xroad_base`                                                     | `http://localhost:8081` (port-forwarded dev security server, instance `IS-DEV`)                                                                                    |
| `xroad_client`                                                   | `IS-DEV/GOV/10000/island-is-client`                                                                                                                                |
| `ids_issuer`                                                     | `https://identity-server.dev01.devland.is`                                                                                                                         |
| `ids_client_id`, `ids_client_secret`, `ids_client_secret_ssm`    | Token exchange / client credentials: `@island.is/clients/dev`, secret in `/k8s/local-dev/IDENTITY_SERVER_CLIENT_SECRET`                                            |
| `pkce_client_id`, `pkce_client_secret`, `pkce_client_secret_ssm` | User login: `@island.is/web`, secret in `/k8s/services-bff/portals-my-pages/IDENTITY_SERVER_CLIENT_SECRET`                                                         |
| `pkce_redirect_uri`                                              | `http://localhost:3010/bff/callbacks/login` (registered on `@island.is/web`). Postman's built-in auth window intercepts the redirect, so nothing has to run there. |
| `pkce_scope`                                                     | `openid profile`                                                                                                                                                   |
| `subject_token`                                                  | Fallback only, for runners that can't see the collection login (e.g. newman).                                                                                      |

Per-collection defaults: auth mode `tokenExchange` (as in TR), and request
URLs `{{xroad_base}}/r1/{{service_path}}` + the OpenAPI path (same as the
generated clients' `basePath`).

## Step 1 – Interview

Infer from the user's message whether this is a new connection or an existing
client in `libs/clients/` (see the last section). Only ask if it's unclear.

### Start by explaining what helps

Many users don't know what the parts of an X-Road URL mean, so this is where
they need the most help. Before asking anything, tell them briefly what
information makes this easiest, and that **any example of how the provider
expects the service to be called** is the most useful thing they can share:
a curl command, a Postman request, provider documentation, or an email with
the service details. Explain the URL anatomy below if their message suggests
they're unsure, or if what they share mixes up the parts.

**Anatomy of an X-Road request:**

```
GET http://localhost:8081/r1/IS-DEV/MUN/10025/rvik-veita-protected/veita-v1/islandis/settings?municipalityCode=0000
X-Road-Client: IS-DEV/GOV/10000/island-is-client
```

The **service id** is the part from the instance to the service code:
`IS-DEV/MUN/10025/rvik-veita-protected/veita-v1`.

| Part                   | Example                             | Meaning                                                                                                                                         |
| ---------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Security server        | `http://localhost:8081`             | **Our** security server (dev, port-forwarded). Always the same here; not part of what the provider tells you.                                   |
| `r1`                   | `r1`                                | X-Road REST protocol version. Always `r1`.                                                                                                      |
| Instance               | `IS-DEV`                            | The X-Road environment: `IS-DEV` (dev), `IS-TEST` (test), `IS` (production). Must match the security server, so `IS-DEV` here.                  |
| Member class           | `GOV`, `MUN`, `COM`                 | Type of organisation: government, municipality, company.                                                                                        |
| Member code            | `10025`                             | The provider's id in X-Road. Often their kennitala, but in `IS-DEV` it can be a different number. `listClients` shows what's registered.        |
| Subsystem              | `rvik-veita-protected`              | The **provider's** subsystem that publishes the service. A common mistake is to put a client subsystem here (e.g. one ending in `-client`).     |
| Service code           | `veita-v1`                          | The service (API) on that subsystem. `listMethods` shows what's published.                                                                      |
| Path in the API        | `/islandis/settings`                | The endpoint, as in the provider's OpenAPI spec.                                                                                                |
| `X-Road-Client` header | `IS-DEV/GOV/10000/island-is-client` | **Who is calling**, i.e. us. Always the same here. A provider's example often has _their own_ test client in this header; replace it with ours. |

**Reading an example call:** take the service id (instance → service code)
and the path from it, plus anything else it shows:

- query or path values → `values` in the config;
- extra headers → `headers` (never credentials, see Ground rules);
- whether it sends an `Authorization` header → a hint about the auth mode.

If the example uses another instance or security server (e.g. the provider's
own, like `xrd-rvk-test01.rvk.is` with `IS-TEST`), point out that it was made
from their side. The service must also be registered in `IS-DEV`, which you can
check with `listClients` once the collection exists.

### Then ask for what's still missing

Use AskUserQuestion (max 4 questions per call, max 4 options per question),
and only ask for what the user's message and example didn't already give:

1. **Provider service id**: `IS-DEV/CLASS/MEMBERCODE/SUBSYSTEM/SERVICECODE`.
2. **Auth mode.** Use exactly these options:
   - _Token exchange (Recommended)_: the user logs in, and their token is exchanged for one with the service's scopes. Same as the TR client.
   - _No auth_: no Authorization header. Common when first testing a new connection.
   - _Client credentials_: a machine token with no user.
   - _Other_: `forward` (send the user token as-is) or `auto`. The user describes which in the free-text answer.
3. **Scopes** the service expects in the token (e.g. `@tr.is/umsoknir:read`),
   unless the mode is no auth. If they differ per part of the API, ask which
   OpenAPI tags need which scopes (`auth.scopesByTag`) and whether any part is
   called without auth (`auth.modeByTag: { "<Tag>": "none" }`). If the user
   doesn't know, the endpoint owner decides (see Missing scopes).
4. **OpenAPI spec**: a local file or URL, if the user has one. If not, offer
   _Fetch it from the service (Recommended)_ (the `getOpenAPI` metaservice, see
   [Step 1b](#step-1b--get-the-openapi-spec)). If neither works, ask for a list
   of paths to call.

Once you have the spec (the version the user chose in Step 1b), check it before
generating:

- **Header parameters** (`in: header`): list the required ones and ask whether
  the user knows their values now (`headers` in the config). If not, they set
  them later on the collection's Variables tab. Without a spec, ask whether the
  service needs any headers. Headers that carry credentials (API keys, tokens)
  must never go in the config; the generator refuses names that look like it.
  Tell the user to set those as the variable's current value in Postman.
- **Auth the spec declares** (`components.securitySchemes`, or
  `securityDefinitions` in Swagger 2): if it's anything other than the island.is
  identity server (e.g. Microsoft Entra ID or an API key), tell the user. This
  collection can't provide it. They should ask the provider whether it applies
  to calls over X-Road, and which island.is scope, if any, the provider
  expects. The generator also writes this into the collection description.

| Mode            | Behaviour (as in libs/clients/middlewares)                                 |
| --------------- | -------------------------------------------------------------------------- |
| `none`          | No Authorization header.                                                   |
| `forward`       | Sends the logged-in user's token as-is (`withAuth`).                       |
| `token`         | Client credentials token (`autoAuth` mode `token`).                        |
| `tokenExchange` | Exchanges the user token for one with `scope`. Fails without a user token. |
| `auto`          | Exchange if there is a user token, otherwise client credentials.           |

## Step 1b – Get the OpenAPI spec

A spec the user has, or one in the repo, may be older than what the service
serves now. So once you know the service id, fetch the current one, unless
the user declined it in Step 1:

| Situation                       | What to do                                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| New connection, user has a spec | Save it as `openapi.provided.json` (or `.yaml`) in the collection folder. Fetch the live one and compare.        |
| New connection, no spec         | Fetch the live one if the user accepted the offer in Step 1. Nothing to compare.                                 |
| Existing client                 | Fetch the live one and compare it with the repo spec (see [Existing clients](#existing-clients-in-libsclients)). |

```bash
node <skill dir>/openapi.mjs fetch <service id> .claude/output/xroad-postman/<slug>/openapi.live.json
```

If your commands run in a sandbox, it may block connections to `localhost`.
The fetch then fails at once, e.g. with `EPERM` or a refused connection,
depending on the sandbox. That doesn't mean the port-forward is down. If it
fails, see [When the fetch fails](#when-the-fetch-fails).

### Compare

```bash
node <skill dir>/openapi.mjs compare <provided or repo spec> .claude/output/xroad-postman/<slug>/openapi.live.json --labels <provided|repo>,live --out .claude/output/xroad-postman/<slug>/openapi-diff.md
```

The report lists every difference, grouped as operations, request, response,
schemas, security, naming (`operationId`, tags), documentation (descriptions,
examples) and metadata (`servers`, `info`). Report them all to the user,
including schema and documentation differences. Summarise in the conversation
and link the report for the details. For each group, give your opinion on the
impact, e.g.:

- An operation only in one version: requests for it are missing from, or added
  to, the collection.
- A changed type, a new required property or parameter: calls built from the
  other version may be rejected, or responses may not match.
- A renamed schema or `operationId` with the same shape: changes names only,
  in the collection and in a client generated from the spec.
- Descriptions and examples: no effect on calls.

For an **existing client**, also read the `project.json` targets that write the
spec file (the name varies, e.g. `schemas` or `update-openapi-document`). Their
commands often patch the spec after fetching it, e.g. a `jq` that sets
`ProblemDetails.additionalProperties = false`. Mark each difference that a
target's commands explain, and say which command. If there is no target that
fetches the spec, say so: the repo spec was then added or edited by hand, or
fetched from somewhere else (a `servers` URL outside X-Road is a hint).
Differences that nothing explains usually mean the repo spec is out of date.
Tell the user, but updating the client isn't part of this skill.

The live spec is what **IS-DEV** serves. Test and production may serve an
older version, so a difference doesn't always mean the provided or repo spec is
wrong.

Then ask the user which version to build the collection from
(AskUserQuestion: live or provided/repo). For each option, say what it means
for the collection, based on the differences.

- **New connection:** don't recommend either. Which one is right depends on
  whether the provided spec or the one the service serves is correct, and only
  the user or the provider knows that.
- **Existing client:** you may recommend one, e.g. the repo spec to test what
  the client sends, or the live spec to test what the service accepts now.

Set `openapi` in the config to the chosen file. If there are no differences,
say so and use the live spec without asking.

### When the fetch fails

Tell the user what failed (the script's first line) and the likely reasons:

| Output                                        | Likely reasons                                                                                                                  | Next step                                                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `NETWORK EPERM` (or another permission error) | Something blocked the connection on this machine, typically a sandbox around your commands.                                     | Run the command outside the sandbox if your environment allows it. Otherwise give the user the `curl` command (see below).               |
| `NETWORK ECONNREFUSED`                        | Nothing listens on `localhost:8081`: the port-forward isn't running. Some sandboxes also report a blocked connection like this. | Ask the user whether the port-forward is running. If not, they start it and you run the command again. If it is, handle it like `EPERM`. |
| `NETWORK TimeoutError` / `ETIMEDOUT`          | The security server or the provider is slow or down.                                                                            | Try again once. If it persists, see `ServiceFailed` in [Debugging X-Road errors](#debugging-x-road-errors).                              |
| `X-Road error: …`                             | See [Debugging X-Road errors](#debugging-x-road-errors). Most often a wrong subsystem or service code.                          | As in that table. Run `listMethods` from the collection to see what the provider publishes.                                              |
| `NOT_OPENAPI`                                 | The service answered, but not with a spec. The provider may not have uploaded one.                                              | Ask the provider for the spec. Continue with the provided spec, if any, or ask for a list of paths.                                      |

Consider whether it's less work for the user to run the fetch themselves.
The script prints an equivalent `curl` command that writes to the same file.

- Give it to the user when the blocker is on your side, e.g. a sandbox blocks
  `localhost` and you can't run the command outside it. They paste one
  command, and then you run the comparison.
- Don't give it when the error comes from X-Road or the provider (`X-Road error`, `NOT_OPENAPI`, timeouts). Their `curl` would fail the same way.
- For a port-forward that isn't running, the user has to start it either way,
  and it's less work if you then run the command again.

## Step 2 – Write the config

Write `.claude/output/xroad-postman/<slug>/config.json`. Omit any keys that
keep the default:

```json
{
  "name": "Reykjavík Veita",
  "xroad": {
    "servicePath": "IS-DEV/MUN/5302697609/rvik-veita-protected/veita-v1"
  },
  "auth": {
    "mode": "tokenExchange",
    "scope": ["@rvk.is/veita"],
    "scopesByTag": { "Programs": ["@rvk.is/veita:read"] },
    "modeByTag": { "Public": "none" },
    "audience": null,
    "headerName": null,
    "tokenEndpoint": null,
    "tokenRequestHeaders": null,
    "alwaysTokenExchange": false,
    "requestActorToken": false
  },
  "headers": { "X-Tenant-Identifier": "<value, if known>" },
  "values": { "municipalityCode": "0000" },
  "openapi": "openapi.live.json",
  "openapiStripPrefix": "",
  "requests": [
    {
      "name": "Settings",
      "method": "GET",
      "path": "/islandis/settings",
      "query": { "municipalityCode": "0000" }
    }
  ]
}
```

- `openapi` is relative to the config file: the version the user chose in Step
  1b, i.e. `openapi.live.json`, `openapi.provided.*`, or a copy of the repo
  spec saved as `openapi.repo.*`. If a provided spec is a URL and a sandbox
  blocks the download, ask the user to download it. Only set
  `openapiStripPrefix` if the spec's paths include a prefix that the X-Road
  service mapping already adds.
- `requests` is only used when there is no `openapi`.
- `headers`: every header parameter in the spec becomes a collection variable
  `header_<name>` (e.g. `header_x_tenant_identifier`), used by all requests.
  Required headers are enabled, optional ones disabled. Values in `headers`
  fill in the variables. Headers in `headers` that the spec doesn't declare
  (or all of them, without a spec) are added to every request.
- `values`: path and query parameter values by name, e.g. from an example call.
  They replace the generated placeholders, and give optional query parameters
  a value and enable them. The generator lists any that match no parameter in
  the spec, which usually means a typo.
- `tokenRequestHeaders` values may use Postman variables, e.g. `{{xroad_client}}`.

## Step 3 – Generate and verify

```bash
node <skill dir>/generate.mjs .claude/output/xroad-postman/<slug>/config.json
```

Check that the collection parses as JSON and that the request count matches
the spec. The output says whether the shared environment was created, already
existed, or is missing variables that a newer version of the skill added. If
variables are missing, pass that on to the user. It also lists required
headers without a value and any spec auth the collection doesn't support.
Pass those on too.

## Step 4 – Hand over

Give the user the `file://` path(s) and these steps.

**First time only** (the generator reported the shared environment as
`created`, or the user says they haven't set it up). Walk the user through
these steps, pasting the commands exactly as below. Never run them yourself:
the user runs them in their own terminal, not with `!`, so the secrets stay out
of the conversation.

1. Import `_shared/xroad-dev.postman_environment.json` into Postman.
2. Log in to AWS (dev account):
   ```bash
   aws sso login
   ```
3. Copy the token exchange client secret (`@island.is/clients/dev`) and paste
   it into the **current value** of `ids_client_secret`:
   ```bash
   aws ssm get-parameter --name /k8s/local-dev/IDENTITY_SERVER_CLIENT_SECRET --with-decryption --query Parameter.Value --output text | pbcopy
   ```
4. Copy the login client secret (`@island.is/web`) and paste it into the
   **current value** of `pkce_client_secret`:
   ```bash
   aws ssm get-parameter --name /k8s/services-bff/portals-my-pages/IDENTITY_SERVER_CLIENT_SECRET --with-decryption --query Parameter.Value --output text | pbcopy
   ```

Tell the user:

- Run the commands one at a time and paste in between, because each one
  overwrites the clipboard.
- Add `--profile <name>` if they use a named AWS profile.
- Use the **current value**, not the initial value. Postman syncs the initial
  value to the cloud and to anyone the environment is shared with.

These parameter paths must match `SHARED_SECRET_SSM` in `generate.mjs`. If one
changes, update both.

**Every collection:**

1. Import the collection and select the "X-Road dev (IS-DEV)" environment.
2. User token modes: on the collection's **Authorization** tab, _Get New Access
   Token_ → log in with a test user in Postman's window → _Use Token_. Service
   requests then exchange that token automatically. The Postman console shows
   one `auth: …` line per request saying what was used (never the token).
   Auth that the user sets themselves on a request's or folder's Authorization
   tab (e.g. to try out a provider's own OAuth2) is left alone by the script.
   Point this out if the spec declares auth the collection doesn't support.
3. Make sure the dev security server port-forward is running on `localhost:8081`.
4. Fill in path variables and query parameters. Generated placeholders such as
   `string` will be rejected by the service. Set missing header values on the
   collection's **Variables** tab (`header_…`).
5. If a call fails, read the **Test Results** tab (diagnosis) and run the
   **Diagnostics** folder, starting with `listClients`.

## Debugging X-Road errors

The collection's test script recognises the errors below. Use the same table
when the user pastes an error into the conversation.

| Error text                                                                                                      | Meaning                                                                                                                                                                      | Next step                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `Shared params for instance identifier X not found`                                                             | The security server doesn't belong to instance X.                                                                                                                            | Use the security server's instance (dev forward = `IS-DEV`) in both the URL and `X-Road-Client`, or use a security server in X.           |
| `Could not find addresses for service provider "SERVICE:…"`                                                     | The provider subsystem isn't registered (or has no security server) in this instance.                                                                                        | `listClients`. If missing: the provider must register it in this instance, or test in the instance where it exists.                       |
| `Client … not found`                                                                                            | The `X-Road-Client` isn't registered on this security server.                                                                                                                | Check the client id against the security server.                                                                                          |
| `AccessDenied`                                                                                                  | The client lacks access rights on the service.                                                                                                                               | `allowedMethods`. The provider must grant access. Another org's client being able to call it says nothing about ours.                     |
| `UnknownService`                                                                                                | The service code isn't published.                                                                                                                                            | `listMethods`.                                                                                                                            |
| `Service not found: SERVICE:…` (`Server.ServerProxy.InternalError`)                                             | The provider subsystem exists, but doesn't publish this service code. Also happens when the path has a client subsystem (e.g. `island-is-client`) instead of the provider's. | `listMethods` on the provider subsystem. Check the service code's spelling.                                                               |
| `ServiceFailed` / `NetworkError` / timeouts                                                                     | Provider side (their security server or backend).                                                                                                                            | Raise it with the provider.                                                                                                               |
| `invalid_client`                                                                                                | IDS rejected the client id/secret pair.                                                                                                                                      | Re-copy the secret from the parameter path in the shared environment.                                                                     |
| `invalid_scope`                                                                                                 | The IDS client isn't allowed one of the scopes.                                                                                                                              | During development this usually means the scope hasn't been added to `@island.is/clients/dev` yet. See [Missing scopes](#missing-scopes). |
| `invalid_grant`                                                                                                 | The user token has expired or is invalid.                                                                                                                                    | Log in again on the collection Authorization tab.                                                                                         |
| `Invalid protocol for auth URL. Only HTTP and HTTPS protocol are allowed.` (Postman, on _Get New Access Token_) | `{{ids_issuer}}` isn't resolved, almost always because the shared environment isn't the active one (e.g. the previously selected environment was deleted).                   | Select "X-Road dev (IS-DEV)" in the environment dropdown. Hovering `{{ids_issuer}}` in the Auth URL field should show the URL.            |
| `Header(s) without a value` (collection test)                                                                   | A required header's `header_…` collection variable is empty.                                                                                                                 | Set it on the collection Variables tab. Ask the provider for the value.                                                                   |
| `Possibly wrong value(s)` (collection test, failed requests only)                                               | A path variable, query parameter or header still holds a generated placeholder (`string`, the zero UUID, `2026-01-01`).                                                      | Fill in a real value. In existing clients, look for the constant the client passes.                                                       |
| `no user token` (from the auth script)                                                                          | No login on the collection, or the runner can't see it.                                                                                                                      | Log in on the collection Authorization tab, or set `subject_token`.                                                                       |

Common mistakes: putting a client subsystem in the `/r1/` path instead of the
provider's subsystem, and mixing instances between the URL and `X-Road-Client`.
Note that the response body may JSON-escape characters (e.g. `'` for `'`).

## Missing scopes

Endpoints are usually guarded by a scope that the **owner of the endpoint**
decides. Every token the collection sends is requested by the shared IDS
client `@island.is/clients/dev` (`ids_client_id`), with client credentials or
token exchange, so a token can only carry scopes that client is allowed to
request. Developers add scopes to a client in Stjórnborð → Innskráningarkerfi
(https://beta.dev01.devland.is/stjornbord/innskraningarkerfi).

Signs that a scope is missing:

- `invalid_scope` from IDS: the client isn't allowed to request the scope.
- 403 (or, from some services, 401) without an X-Road error: the token is
  missing the scope the endpoint expects.

Walk the user through these steps:

1. **Ask the endpoint owner** (the provider's team) which scope the endpoint
   requires. Don't guess scopes.
2. Add the scope to `@island.is/clients/dev` in Stjórnborð.
3. Back in Postman, update `auth_scope` (or the per-tag scope header) if
   needed, clear the `_auth_cache` collection variable, and send the request
   again.

## 401 Unauthorized

A 401 without an X-Road error means the service didn't accept the token at
all. A missing scope is only one possible cause:

| Cause                        | How to check / fix                                                                                                                                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No token was sent            | The `auth:` line in the Postman console shows what the request used. `auth_mode` `none` or a failed token request sends no token.                                                                                       |
| Expired token                | Log in again on the collection Authorization tab and clear `_auth_cache`.                                                                                                                                               |
| Wrong audience or issuer     | Check `auth_audience`, and whether the provider trusts a different IDS environment than the shared one.                                                                                                                 |
| Wrong header or non-IDS auth | The provider may expect the token in another header (`auth_header_name`) or use its own auth (API key, basic auth). Ask the provider. Auth set on a request's Authorization tab is left alone by the collection script. |
| Missing scope                | Some services answer 401 instead of 403. See [Missing scopes](#missing-scopes).                                                                                                                                         |

## Existing clients in `libs/clients/`

To build a collection for a client that already exists, read each file below
for that client (don't infer from sibling clients), summarise what you found,
and confirm before generating:

| What           | Where to look                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Service path   | `src/lib/**/*.config.ts` → `env.required('XROAD_..._PATH', '<default>')`. Some clients have several configs (v1/v2); ask which one. If the default is empty, grep `charts/` for the variable (read only) and use the dev value. It may be split into several variables (e.g. member code and path).                                                                                                                                                                                            |
| OpenAPI        | `src/lib/**/clientConfig*.json` (or `.yaml`). The `project.json` target that writes it (the name varies, e.g. `schemas` or `update-openapi-document`) shows how it was fetched, often a `getOpenAPI` curl followed by patches. Some clients have no such target. Compare it with the live spec as in [Step 1b](#step-1b--get-the-openapi-spec).                                                                                                                                                |
| Auth           | The provider/api factory calling `createEnhancedFetch({ autoAuth: … })`, e.g. `apiProvider.ts`, `*.provider.ts`, `*.module.ts`. Map `mode`, `scope`, `audience`, `headerName`, `tokenEndpoint`, `tokenRequestHeaders`, `tokenExchange.alwaysTokenExchange` and `tokenExchange.requestActorToken`. No `autoAuth` but auth passed to fetch → `forward`. No auth at all → `none`. If the client uses a different IDS client than the shared environment, tell the user; that isn't supported yet. |
| Per-API scopes | If generated API classes use different scopes (e.g. an `apiCollection` array), map each to the OpenAPI **tag** it was generated from (`auth.scopesByTag`). If several classes share a tag with different scopes (read/write), use the union and tell the user. A class without `autoAuth` → `auth.modeByTag: { "<Tag>": "none" }`.                                                                                                                                                             |
| Path values    | Look for constants the client passes as path parameters (e.g. an application type slug) and tell the user, since the spec usually only says `string`.                                                                                                                                                                                                                                                                                                                                          |
