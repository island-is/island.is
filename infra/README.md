# CLI Tool Documentation

This CLI tool simplifies the management and setup of local environments for development. It provides commands to efficiently manage environment variables, secrets, and URLs essential for configuring services during development.

## Key Features

- **Environment Setup**: Quickly render necessary environment variables and secrets across different environments.
- **Ingress URL Management**: Generate and display ingress URLs for your services.
- **Service Configuration**: Load all required secrets and environment variables for proper service configuration.

### Available Commands

One of the most powerful and useful commands for developers is `run-local-env`, which renders the required environment and starts a local development environment with the needed configuration.

Summary of all available commands:

```text
yarn cli <command>

Commands:
  yarn cli render-env        Render a chart for environment.
  yarn cli render-urls       Render ingress URLs for environment.
  yarn cli render-secrets    Render secrets needed by a service.
  yarn cli render-env-vars   Render environment variables needed by a service.
                             Useful for local "dev" environments.
  yarn cli render-local-env  Render environment variables for local use. 
                             Intended for "dev" environments.
  yarn cli run-local-env     Render environment and run the local environment.
                             For local "dev" environments.

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

### `run-local-env` Command

The `run-local-env` command is essential for developers working in local environments. It renders necessary environment variables and manages service dependencies and configurations.

#### Example Usage

```bash
yarn cli run-local-env <services> [options]
```

This command streamlines the configuration setup, ensuring the correct environment variables and dependencies are loaded for local development.

#### Common Options for `run-local-env`

- `--dependencies`: Specify dependencies to load.
- `--json`: Output results in JSON format.
- `--dry`: Preview run without applying changes.
- `--no-secrets`: Skip updating secrets.
- `--proxies`: Enable proxies if needed for local development.