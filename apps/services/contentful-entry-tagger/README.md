```markdown
# Contentful Entry Tagger

## Overview

The Contentful Entry Tagger service automatically assigns a tag to newly created entries. This occurs if the entry is created by a user with a space role whose name begins with the prefix "Owner-". This functionality facilitates user permission management in Contentful using tags and roles.

## Getting Started

To launch the service, execute the following command:
```

yarn start services-contentful-entry-tagger

```

This command initializes a server hosted at `localhost:3333`.

### Available API Endpoints

- **POST `/api/entry-created`**: This endpoint is triggered by Contentful when a new entry is created.

## Code Owners and Maintainers

- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
```
