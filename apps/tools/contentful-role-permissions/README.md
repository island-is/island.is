## Contentful Role Permissions

### Overview

Contentful Role Permissions is a developer tool designed to help manage Contentful role permissions. It provides an interface to manage roles via a website utilizing the Contentful Content Management API.

### Purpose

The tool was developed to enhance user management within Contentful. The native Contentful UI had limitations in managing role policies effectively, especially considering the necessity for a significant number of rules at the time of this tool's development.

### Running the Application

1. You need a Contentful Management API key, which must be exported in your `.env.secret` file like this:
   ```bash
   export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=insert-api-key-here
   ```
2. Run the application using the command:
   ```bash
   yarn start contentful-role-permissions
   ```
3. Access the application through your browser at `http://localhost:4200`.

### Key Information

- **Role and Tag Management**: User management in Contentful is based on roles and tags. Each role corresponds to a specific tag. For organizations, the role name is essentially the same as the tag name—the slugified version of the role name must match a tag name.
  - For example, a role named `Owner-Fiskistofa` is paired with a tag `owner-fiskistofa`.
  - Entries created by users with a particular role are automatically tagged with the corresponding tag, allowing others with the same role to view these entries.

### Permissions per Role

The following permissions can be modified for each role:

- Define which content types an organization can read all instances of.
- Specify which content types an organization can edit instances of using a given tag.
- Determine if an organization can see all assets (while still editing only assets with their tag) or if visibility and editing are confined to assets with a specific tag.

Since Contentful user management revolves around tags, an entry tagging bot is implemented to tag entries upon creation based on the role of the user. The entry tagging bot's code is located in the GitHub monorepo: `apps/services/contentful-entry-tagger`.

### Code Owners and Maintainers

- Maintained by the [Stefna](https://github.com/orgs/island-is/teams/stefna/members) team.