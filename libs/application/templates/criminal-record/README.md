# Criminal record application

This library was generated with [Nx](https://nx.dev).

## Setup

Run these two proxy clients for Þjóðskrá connection.

Proxy the X-Road socat service (v2):

First you need to enter the AWS environment variables (get from https://island-is.awsapps.com/start)

`export AWS_ACCESS_KEY_ID="<access_key_id>"`

`export AWS_SECRET_ACCESS_KEY="<secret_access_key>"`

`export AWS_SESSION_TOKEN="<session_token>"`

Then:

`./scripts/run-xroad-proxy.sh`

Proxy the X-Road socat service (v1):

First you need to run this (maybe only once?):

`aws eks update-kubeconfig --name dev-cluster01 --profile <profile-name> --region eu-west-1`

Then:

`kubectl port-forward svc/socat-soffia 8443:443 -n socat`

Fetch secrets:

AWS_PROFILE=<profile-name> yarn get-secrets application-system-form

AWS_PROFILE=<profile-name> yarn get-secrets application-system-api

AWS_PROFILE=<profile-name> yarn get-secrets api

AWS_PROFILE=<profile-name> yarn get-secrets service-portal

AWS_PROFILE=<profile-name> yarn get-secrets k8s

## Running unit tests

Run `nx test application-templates-criminal-record` to execute the unit tests via [Jest](https://jestjs.io).

## Code owners and maintainers

- [Unnur Sól - @unnursol](https://github.com/unnursolingimars)
- [Jón Bjarni]()
- [Jóhanna Agnes]()
