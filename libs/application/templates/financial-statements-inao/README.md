# Application Template Financial Statements

This library was generated with [Nx](https://nx.dev).

## Setup

To upload documents while running locally, you need to set the AWS environment variables. Retrieve these from [AWS IAM Identity Center](https://island-is.awsapps.com/start).

- Set the AWS Access Key ID:
  ```bash
  export AWS_ACCESS_KEY_ID="<access_key_id>"
  ```

- Set the AWS Secret Access Key:
  ```bash
  export AWS_SECRET_ACCESS_KEY="<secret_access_key>"
  ```

- Set the AWS Session Token:
  ```bash
  export AWS_SESSION_TOKEN="<session_token>"
  ```

## Running Locally

1. Start development services:
   ```bash
   yarn nx run application-system-api:dev-services
   yarn nx run application-system-api:migrate
   ```

2. Start both proxies by running:
   ```bash
   kubectl -n socat port-forward svc/socat-xroad 8081:80
   ```

3. Launch the application system:
   ```bash
   yarn start application-system-form
   yarn start api
   yarn start application-system-api
   ```

4. Access the application at [http://localhost:4242/umsoknir/skilarsreikninga](http://localhost:4242/umsoknir/skilarsreikninga).

## Test Users

- **Gervimaður Færeyjar**: `01012399`

### Company Representation

- Acting as a political party: **65°ARCTIC ehf.**
- Acting as a Cemetery: **Blámi-fjárfestingafélag ehf.**

### Registering Board Members and Examiners

For local and development environments, use Gervimenn such as:

- **0101302989 Gervimaður Ameríka**
- **0101302129 Gervimaður Noregur**