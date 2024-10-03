```markdown
# Subpages

This document provides an overview and general guidelines for setting up and adding a new subpage to the web project.

## Layouts and Layout Components

A `SubpageLayout` (`@island.is/web/screens/Layouts/Layouts`) is available in the web app. This layout has a required `main` prop and an optional `details` prop. It is primarily used to organize content if needed. Both props accept ReactNodes, making the main and details sections fully customizable.

Typically, the main content section should introduce the content displayed in the details section. 

For landing pages, this layout should be used with an empty `details` prop.

Example layouts can be found [here](subpages.md#examples).

Main content should generally include a navigation sidebar, which can be implemented using the `SidebarLayout` (`@island.is/web/screens/Layouts/SidebarLayout`) in the web app.

Both `SubpageLayout` and `SidebarLayout` have top/bottom padding props so that developers can adjust them during development. `SidebarLayout` padding has default values and can be left unchanged.

### Layout Components

Two layout components are available in the web app: `SubpageMainContent` and `SubpageDetailsContent`. These components are based on Figma designs and ensure UX consistency across subpages.

#### Main Subpage Content

The `SubpageMainContent` (`@island.is/web/components/SubpageMainContent`) layout component is recommended for wrapping the main content. It provides structure and responsiveness to the main content and includes a required `main` prop and an optional `image` prop. The `image` prop is hidden on smaller screens.

#### Details Subpage Content

The `SubpageDetailsContent` (`@island.is/web/components/SubpageDetailsContent`) layout component is recommended for wrapping the details content. This component requires both a `header` and a `content` prop, offering a well-structured, responsive design.

## Components

Overview of essential non-layout subpage components:

_If these components do not fit your subpage's intended look, you are free to create new ones._

### Navigation Sidebar

The navigation sidebar can be implemented using the `Navigation` component from the `island-ui/core` library, added as a `sidebarContent` prop to the `SidebarLayout`.

### Filter

A list filter can be implemented by combining general filter components from the `island-ui/core` library. These components include `Filter`, `FilterInput`, and `FilterMultiChoice`.

For an example of a combined list filter, see `@island.is/web/components/ApiCatalogueFilter`.

## Contentful

All static content should be stored in the island.is Contentful space.

### Content Types

A content type, [Subpage Header](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types?searchTerm=Subpage%20Header), exists in Contentful. This content type is intended for displaying an introduction to the subpage's content and should generally be used in the main prop. The body is a Rich Text element and can be displayed using the `RichText` component from the `island-ui/core` library.

The content type, [UI Configuration](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types?searchTerm=UI%20configuration), is a key-value content type, useful for storing short text snippets needed on a subpage.

If content for the main part of the subpage does not fit into the `SubpageHeader` content type, you can create a new content type in Contentful and connect it to the web via Elasticsearch.

### Adding New Content Types

To add a new content type to the web project:

1. Create your content type in the island.is Contentful space and publish it.

2. Run `yarn nx run api:contentful-types` in the root of the island.is project to ensure type safety between Contentful and the API.

3. Run `yarn nx run api:contentType --id=<contentTypeId>`, replacing `<contentTypeId>` with your content type's ID. _Ensure that the CONTENT_MANAGEMENT_ACCESS_TOKEN environment variable is set to your content management token, which can be generated at <https://app.contentful.com/account/profile/cma_tokens>_.

4. Generate the GraphQL schemas and clients using the following commands in the island.is project root:

   1. `yarn nx run api:contentful-types` Generates Contentful types in the API.

   2. `yarn nx run api-schema:codegen/frontend-client --skip-nx-cache` Generates types in API based on models.

   3. `yarn nx run web:codegen/frontend-client --skip-nx-cache` Generates types in the web project based on queries.

5. If schemas do not update properly and types are missing, try running `yarn codegen`.

## Examples

### Subpage With Main and Details Content

![Subpage With Main and Details Content][main_details_layout]

This layout comprises the `SubpageLayout`. The `main` prop (white area) contains a `SidebarLayout` which, in turn, includes a `SubpageMainContent`. The `details` prop (light blue area) contains a `SubpageDetailsContent` that incorporates a `SidebarLayout`.

### Landing Subpage

![Landing Subpage][landing_layout]

This layout also utilizes the `SubpageLayout`. Here, only the `main` prop (white area) contains a `SidebarLayout` with a `SubpageMainContent` component. The light blue area represents the page footer.

[main_details_layout]: ./assets/subpages_main_details_layout.png
[landing_layout]: ./assets/subpages_landing_layout.png
```