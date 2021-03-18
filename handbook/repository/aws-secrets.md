# AWS Secrets

## Prerequisites

- You will need [AWS command line](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed.
- You will also need access to the AWS account. Ask someone from DevOps to send you an invitation.

## Getting started

1. Configure AWS with SSO, using the following configuration:

```bash
aws configure sso

SSO start URL [None]: https://island-is.awsapps.com/start
SSO Region [None]: eu-west-1
```

Then choose the environnement of your choice. Likely to be `island-is-development01`. You be prompted for the following:

```md
CLI default client Region [eu-west-1]: <Press Enter>
CLI default output format [json]: <Press Enter>
CLI profile name [AWSPowerUserAccess-X]: <Custom name (e.g. dev)> or <Press Enter>
```

This step will add the new profile to your `~/.aws/config` file.

2. Configure AWS, using the following configuration:

```bash
aws configure

AWS Access Key ID [None]: <KEY_ID>
AWS Secret Access Key [None]: <ACCESS_KEY>
Default region name [eu-west-1]: <Press Enter>
Default output format [json]: <Press Enter>
```

You will be able to find these information on the [AWS account](https://island-is.awsapps.com/start).

Then, you will need to open the file created by AWS at `~/.aws/credentials` and add your session token to it.

```bash
[default]
aws_access_key_id = <KEY_ID>
aws_secret_access_key = <ACCESS_KEY>
aws_session_token = <SESSION_TOKEN>
```

Voilà, you are now ready to fetch and create secrets.

{% hint style="warning" %}
Remember, the session token expires every 8 hours so you will need to update it. You can either do `export AWS_SESSION_TOKEN="SESSION_TOKEN"` or change it manually by going into `~/.aws/credentials` and replacing with the new session token generated from your AWS account.
{% endhint %}

## Usage to fetch secrets

You should now be able to fetch secrets for the project you need.

```bash
yarn get-secrets <project> [options]
```

**Example**:

```bash
yarn get-secrets api --reset
```

You can verify it by opening the `.env.secret` file at the root, or inside your code using for example:

```typescript
const { MY_SECRET_KEY } = process.env
```

If you configured multiples profiles using `aws configure sso` you can choose which profile to run to get the secrets:

```bash
AWS_PROFILE=dev yarn get-secrets api
```

You can find your profile listed in `~/.aws/config`, e.g.

```md
[default]
region = eu-west-1
output = json
[profile dev]
...
[profile staging]
...
```

## Usage to create secrets

You can run the following command and will be prompted for input.

```bash
yarn create-secret
```

You will be asked for a _secret name_ that will be added to the `/k8s/` secrets namespace and a _secret value_. The length of the _secret name_ should be from 6-128 characters long.

{% hint style="warning" %}
Only alphanumeric characters, `/` and `-` are allowed.
{% endhint %}

### Making dev secrets available locally

Environment variables that should not be tracked but needed locally should be added to the `.env.secret` file.

Additionally, if that same variable is also stored in AWS Parameter Store, the secret can be labeled with the `dev` label from `History` -> `Attach labels`.

All secrets labeled with the `dev` label can be fetched using `yarn get-secrets <project>`.

### Environment variables with static websites

More about it on [this page](../../README.md#environment-variables-with-static-websites).
