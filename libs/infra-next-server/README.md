# Infra Next Server

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test infra-next-server` to execute the unit tests via [Jest](https://jestjs.io).

## Content Security Policy

Next.js custom servers can opt into the shared nonce-based CSP and send violation
reports to Datadog's EU intake:

```ts
const reportUri = buildDatadogCspReportUri({
  // Use the application's canonical CSP reporting service name.
  service: 'web',
  // The token defaults to DD_CSP_REPORT_CLIENT_TOKEN.
  // env defaults to Datadog's injected DD_ENV, then ENVIRONMENT.
  // version defaults to DD_VERSION, APP_VERSION, then GIT_COMMIT_SHA.
})

bootstrap({
  // ...
  csp: (nonce) =>
    buildContentSecurityPolicy(nonce, {
      reportUri,
    }),
})
```

The generated URL includes Datadog's `service`, `env`, and `version` unified
service tags. Configure the client token from Kubernetes like other secrets:

```ts
.secrets({
  DD_CSP_REPORT_CLIENT_TOKEN: '/k8s/DD_CSP_REPORT_CLIENT_TOKEN',
})
```

Despite being provisioned as a Kubernetes secret, a Datadog **client token is
public by design** because the completed URL is sent to the browser in the CSP
response header. Never use a Datadog API key or application key here.
When the token is absent, the helper warns once at startup and omits
`report-uri` without preventing the application from starting. Never log the
generated report URL because it contains the token.

For non-Datadog collectors, pass a URL—or an array of URLs—directly to
`reportUri`. If no endpoint is configured, the policy omits the directive.

### Datadog CSP reporting runbook

1. In the EU Datadog organization, verify that the Content Security Policy
   integration is available and enabled.
2. Under Organization Settings → Client Tokens, create one dedicated client
   token named `island-is-csp-reports`. The operator needs the Datadog
   `client_tokens_write` permission. Client tokens have no configurable read or
   API permissions and are intended only for client telemetry ingestion. Do not
   use an API key or application key.
3. Ask DevOps to store the same token as a `SecureString` named
   `/k8s/DD_CSP_REPORT_CLIENT_TOKEN` in `eu-west-1` in each account:

   | Environment         |        Account |
   | ------------------- | -------------: |
   | Main dev            | `013313053092` |
   | Identity dev        | `324037283794` |
   | Shared staging      | `261174024191` |
   | Main production     | `251502586493` |
   | Identity production | `567113216315` |

4. The operator needs `ssm:PutParameter` and any required KMS permission.
   Application IAM changes are unnecessary because the existing External
   Secrets mechanism resolves the DSL secret mappings.
5. Treat SSM as deployment and rotation hygiene, not confidentiality from
   users: the client token appears in each document's CSP response header by
   design.
6. Provision every environment first, then deploy sequentially through dev,
   staging, and production.
7. After each deployment, confirm that document responses contain the EU
   `report-uri` with the correct service, environment, and image Git SHA. Trigger
   a harmless blocked request in each application, verify it in Datadog with a
   query such as `source:csp-report service:web env:dev`, and check report volume
   and browser-extension noise before promoting. Static assets should continue
   to omit the CSP header.
8. After establishing a baseline, create Datadog log monitors or exclusion
   filters scoped by `source:csp-report`, `service`, and `env`.
