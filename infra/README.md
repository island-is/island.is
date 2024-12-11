# Infra Tool Documentation

This CLI tool simplifies the management and setup of local environments for development. It provides commands to render environment variables, secrets, and URLs that are essential for configuring services during development.

## Key Features

- **Environment Setup**: Easily render environment variables and secrets needed for your services in various environments.
- **Ingress URL Management**: Generate and render ingress URLs for your services.
- **Service Configuration**: Ensure all necessary secrets and environment variables are loaded to correctly configure services.

## Available Commands

For a full list of available commands and options, run:

```bash
yarn infra --help
```

### `run-local-env` Command

The `run-local-env` command is a key tool for developers working in local environments. It not only renders the required environment variables but also runs the local environment, managing service dependencies and configurations.

#### Example Usage

```bash
yarn infra run-local-env <services> [options]
```

This command automates the configuration setup, ensuring that the correct environment variables and dependencies are loaded for your local development environment.

#### Common Options for `run-local-env`

- `--dependencies`: Specify dependencies to load.
- `--json`: Output results in JSON format.
- `--dry`: Run a dry preview without applying changes.
- `--no-secrets`: Skip updating secrets.
- `--proxies`: Enable proxies if required for local development.
