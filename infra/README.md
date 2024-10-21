# CLI Tool Documentation

This CLI tool simplifies the management and setup of local environments for development. It provides commands to render environment variables, secrets, and URLs that are essential for configuring services during development.

## Key Features

- **Environment Setup**: Easily render environment variables and secrets needed for your services in various environments.
- **Ingress URL Management**: Generate and render ingress URLs for your services.
- **Service Configuration**: Ensure all necessary secrets and environment variables are loaded to correctly configure services.

### Available Commands

While the CLI offers various commands, one of the most powerful and useful for developers is the `run-local-env` command. This command allows developers to render the required environment and start a local development environment with the necessary configuration.

Here is a summary of all available commands in the CLI:

```text
yarn cli <command>

Commands:
  yarn cli render-env        Render a chart for environment
  yarn cli render-urls       Render urls from ingress for environment
  yarn cli render-secrets    Render secrets secrets needed by service
  yarn cli render-env-vars   Render environment variables needed by service.
                             This is to be used when developing locally and
                             loading of the environment variables for "dev"
                             environment is needed.
  yarn cli render-local-env  Render environment variables needed by service.
                             This is to be used when developing locally and
                             loading of the environment variables for "dev"
                             environment is needed.
  yarn cli run-local-env     Render environment and run the local environment.
                             This is to be used when developing locally and
                             loading of the environment variables for "dev"
                             environment is needed.

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

### `run-local-env` Command

The `run-local-env` command is a key tool for developers working in local environments. It not only renders the required environment variables but also runs the local environment, managing service dependencies and configurations.

#### Example Usage

```bash
yarn cli run-local-env <services> [options]
```

This command automates the configuration setup, ensuring that the correct environment variables and dependencies are loaded for your local development environment.

#### Common Options for `run-local-env`

- `--dependencies`: Specify dependencies to load.
- `--json`: Output results in JSON format.
- `--dry`: Run a dry preview without applying changes.
- `--no-secrets`: Skip updating secrets.
- `--proxies`: Enable proxies if required for local development.
