# AWS Secrets

## Prerequisites

- You will need [AWS command line](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed.
- You have [jq](https://stedolan.github.io/jq/) installed.
  - `brew install jq`
- You will also need access to the AWS account. Ask someone from DevOps to send you an invitation.

## Getting started

### Using AWS SSO

Using SSO is the most straight forward solution. You won't need to go by yourself on your AWS account and it will open the needed url for you.

- Run the sso command for the first time

```bash
aws configure sso

SSO start URL [None]: https://island-is.awsapps.com/start
SSO Region [None]: eu-west-1
```

Then choose the environment of your choice. Likely to be `island-is-development01`. You will be prompted for the following:

```md
CLI default client Region [eu-west-1]: <Press Enter>
CLI default output format [json]: <Press Enter>
CLI profile name [AWSPowerUserAccess-X]: <Custom name (e.g. islandis-dev)> or <Press Enter>
```

This step will add the new profile to your `~/.aws/config` file. If you choose `islandis-dev` as profile's name, you will see `[profile islandis-dev]` in there.

- Ready to use

You can now pass your profile to the `get-secrets` script.

```bash
AWS_PROFILE=<profile-name> yarn get-secrets <project-name> # e.g. profile-name -> islandis-dev as seen above
```

{% hint style="info" %}
**Refresh your profile:** The SSO credentials only lasts 8 hours, after which AWS commands start failing. You can run the following command to renew your SSO credentials.

```bash
aws sso login --profile <profile-name> # e.g. profile-name -> islandis-dev as seen above
```

It will open the browser, go to your AWS account to log in and will refresh your credentials and you are ready to use the AWS commands again.
{% endhint %}

{% hint style="info" %}
**Pre-configured AWS profiles:** Feel free to copy and paste these to your `~/.aws/config` file:

```
[profile islandis-dev]
sso_start_url = https://island-is.awsapps.com/start
sso_account_id = 013313053092
sso_role_name = AWSPowerUserAccess
sso_region = eu-west-1
region = eu-west-1

[profile islandis-staging]
sso_start_url = https://island-is.awsapps.com/start
sso_account_id = 261174024191
sso_role_name = Secret_Service
sso_region = eu-west-1
region = eu-west-1

[profile islandis-prod]
sso_start_url = https://island-is.awsapps.com/start
sso_account_id = 251502586493
sso_role_name = Secret_Service
sso_region = eu-west-1
region = eu-west-1
```

{% endhint %}

{% hint style="info" %}
**AWS Vault:** You can use [AWS Vault](https://github.com/99designs/aws-vault) to store and access AWS credentials in your operating system's secure keystore. When requesting credentials from an expired SSO session, it will automatically open a browser window for you to log in again.

Just follow its [installation instructions](https://github.com/99designs/aws-vault#installing) and configure your `~/.aws/credentials` file like this:

```
[islandis-dev]
credential_process = aws-vault exec islandis-dev --json

# ... do the same thing for your other profiles.
```

{% endhint %}

### Using AWS session

This method is more manual where you will need to export environments variables or change a file by yourself.

You will need to go to your [AWS account](https://island-is.awsapps.com/start) and get the required credentials for the account you need.

- Option 1: Set environment variables

You can copy/paste these environment variables to your terminal:

```bash
export AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID_EXAMPLE
export AWS_SECRET_ACCESS_KEY=AWS_SECRET_ACCESS_KEY_EXAMPLE
export AWS_SESSION_TOKEN=AWS_SESSION_TOKEN_EXAMPLE
```

- Option 2: Edit `~/.aws/credentials`

Copy/paste the values in the `~/.aws/credentials` file.

```bash
[default]
aws_access_key_id = <KEY_ID>
aws_secret_access_key = <ACCESS_KEY>
aws_session_token = <SESSION_TOKEN>
```

- Ready to use

In this case you won't need to pass a profile name as opposed to the SSO method.

```bash
yarn get-secrets <project-name>
```

{% hint style="info" %}
**Refresh your profile:** The session token only lasts 1 hour, after which AWS commands start failing. You will need to log in to your AWS account and get new credentials, with one of the above methods.
{% endhint %}

## Usage to fetch secrets

You should now be able to fetch secrets for the project you need.

**With SSO**

```bash
AWS_PROFILE=<profile-name> yarn get-secrets <project> [options]
```

**Without SSO**

```bash
yarn get-secrets <project> [options]
```

**Example**:

```bash
yarn get-secrets api
```

You can verify it by opening the `.env.secret` file at the root, or inside your code using for example:

```typescript
const { MY_SECRET_KEY } = process.env
```

You can also add the `--reset` argument to the command, that will reset the .env.secret file.

### Troubleshoot

If you get the following error message, you will need to refresh your credentials as explained above.

```bash
An error occurred (ExpiredTokenException) when calling the GetParametersByPath operation: The security token included in the request is expired
```

## Usage to create secrets

You can run the following command and will be prompted for input.

**With SSO**

```bash
AWS_PROFILE=<profile-name> create-secret
```

**Without SSO**

```bash
yarn create-secret
```

{% hint style="warning" %}
Only alphanumeric characters, `/` and `-` are allowed. The length of the _secret name_ should be from 6-128 characters long.
{% endhint %}

You will be asked for a _secret name_ that will be added to the `/k8s/` secrets namespace, a _secret value_ and the _secret type_ (`SecureString` or `String`).

### Example

```bash
➜ yarn create-secret

Secret name: /k8s/my-app/MY_APP_KEY
# Name: Ok!
# Length: Ok!

Secret value: a-very-secure-secret
# Length: Ok!

SecureString [Y/n]? # [enter] for SecureString
# SecureString selected

Add tags? [y/N]? # [enter] to skip creating tags

Example: Key=Foo,Value=Bar Key=Another,Value=Tag: # note: Key and Value are case sensitive! Create multiple tags by separating with whitespace.

Are you sure [Y/n]? # [enter] to confirm
# Creating secret....
```

{% hint style="info" %}
It's recommended to use `SecureString` in most cases. However, if you need to add an email address, or an email sender's name to the secrets, you can just use a `String`.
{% endhint %}

{% hint style="info" %}
Note that this command only creates the secret in one AWS account at a time (eg `island-is-development01`). To create a secret in all environments, you need to run it with each corresponding AWS account configured, by going through the steps in [Using AWS session](#using-aws-session) multiple times.

To make this easier we recommend configuring SSO for each AWS account using a different AWS profile (islandis-dev, islandis-staging, islandis-prod). Then you can create a secret in all environments like this:

```bash
# If your SSO session is expired and you're not using AWS Vault, you can log into any one profile since they all share the same SSO session.
AWS_PROFILE=islandis-dev aws sso login

AWS_PROFILE=islandis-dev yarn create-secret
AWS_PROFILE=islandis-staging yarn create-secret
AWS_PROFILE=islandis-prod yarn create-secret
```

{% endhint %}

## Making dev secrets available locally

Environment variables that should not be tracked but needed locally should be added to the `.env.secret` file. _(**NOTE:** Each variable must be prefixed with `export ` for direnv to pick them up.)_

Additionally, you can fetch secrets configured in a project's infra DSL from the `island-is-development01` AWS Parameter Store. Just run `yarn get-secrets <project>` and they'll be loaded into your `.env.secret` file.

## Environment variables with static websites

More about it on the root [README](../../README.md#environment-variables-with-static-websites).

## Running proxy against development service

More about it on the root [README](../../README.md#running-proxy-against-development-service)
