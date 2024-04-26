# GitHub Actions Cache Using AWS S3

<!--toc:start-->

- [GitHub Actions Cache Using AWS S3](#github-actions-cache-using-aws-s3)
  - [Overview](#overview)
  - [Prerequisites](#prerequisites)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [Authentication](#authentication)
  - [Benefits](#benefits)
  - [Support and Contribution](#support-and-contribution)
  <!--toc:end-->

## Overview

This document provides guidance on using our custom GitHub Actions cache,
leveraging AWS S3 infrastructure. Designed primarily for DevOps engineers, this
system integrates with our existing CI/CD pipelines, offering an efficient
caching mechanism hosted at [https://cache.dev01.devland.is](https://cache.dev01.devland.is).

## Prerequisites

- Familiarity with AWS S3.
- Access to the relevant AWS S3 bucket (`island-is-github-cache-dev` or equivalent).
- Access to the project's GitHub repository and secrets.

## Configuration

1. **Setting Up `ACTIONS_CACHE_URL`**:

   - Ensure that the `ACTIONS_CACHE_URL` environment variable is set to `https://cache.dev01.devland.is`.
   - This variable should be set in the GitHub repository's secrets for security
     and accessibility across workflows.

## Usage

- The cache system is already integrated into all our GitHub Actions workflows.
- No additional steps are required from the user's end to leverage this caching
  mechanism in existing workflows.

## Authentication

- Authentication is managed through GitHub's secrets, ensuring secure and
  seamless access to the cache system within workflows.

## Benefits

- Utilizing our AWS S3 infrastructure optimizes costs and leverages our existing
  resources.
- The custom cache system provides faster and more reliable builds when compared
  to standard GitHub caching mechanisms.

## Support and Contribution

- For any issues or enhancements, please open an issue or a pull request in the repository.
- Contributions to extend or improve the cache system are welcome.
