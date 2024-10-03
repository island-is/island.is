# Subpages

Guidelines for setting up and adding new subpages to a web project.

## Layouts and Layout Components

Use `SubpageLayout` (`@island.is/web/screens/Layouts/Layouts`) for subpage layouts. It requires a `main` prop and optionally a `details` prop, both of which are customizable ReactNodes. Typically, main content should introduce the details content. For landing pages, use with an empty details prop. Reference [here](subpages.md#examples).

Main content generally includes a navigation sidebar, implemented with `SidebarLayout` (`@island.is/web/screens/Layouts/SidebarLayout`). Both `SubpageLayout` and `SidebarLayout` allow customizable top/bottom padding; `SidebarLayout` has default values.

### Layout Components

Utilize `SubpageMainContent` and `SubpageDetailsContent` components for consistency based on design standards.

#### Main Subpage Content

Wrap main content in `SubpageMainContent` (`@island.is/web/components/SubpageMainContent`). It supports `main` and optional `image` props. The `image` is hidden on smaller screens.

#### Details Subpage Content

Wrap details content in `SubpageDetailsContent` (`@island.is/web/components/SubpageDetailsContent`). It requires `header` and `content` props, ensuring structure and responsiveness.

## Components

Important non-layout subpage components include:

### Navigation Sidebar

Implemented using the `Navigation` component from `island-ui/core`, added as a `sidebarContent` prop to `SidebarLayout`.

### Filter

A list filter is built with `Filter`, `FilterInput`, and `FilterMultiChoice` components from `island-ui/core`. See `@island.is/web/components/ApiCatalogueFilter` for an example.

## Contentful

Store static content in the island.is Contentful space.

### Content Types

Use [Subpage Header](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types?searchTerm=Subpage%20Header) for subpage introductions, typically for the main prop. Display Rich Text using the `RichText` component from `island-ui/core`. The [UI Configuration](https://app.contentful.com/spaces/8k0h54kbe6bj/content_types?searchTerm=UI%20configuration) type is for short text snippets.

If content doesn't fit `SubpageHeader`, create a new content type in Contentful and link it via Elasticsearch.

### Adding New Content Types

To add a new content type:

1. Create and publish it in Contentful.
2. Run `yarn nx run api:contentful-types` in the project root.
3. Execute `yarn nx run api:contentType --id=<contentTypeId>`, ensuring `CONTENT_MANAGEMENT_ACCESS_TOKEN` is set.
4. Generate GraphQL schemas and clients:

   1. `yarn nx run api:contentful-types`
   
   2. `yarn nx run api-schema:codegen/frontend-client --skip-nx-cache`
   
   3. `yarn nx run web:codegen/frontend-client --skip-nx-cache`

5. If types are missing, try `yarn codegen`.

## Examples

### Subpage With Main and Details Content

Layout uses `SubpageLayout`. The main prop (white portion) contains `SidebarLayout` with `SubpageMainContent`. The details prop (light blue) holds `SubpageDetailsContent` with a `SidebarLayout`.

### Landing Subpage

Layout with `SubpageLayout` using the main prop (white portion) and `SidebarLayout`, featuring `SubpageMainContent`. The light blue area is the footer.

![Subpage With Main and Details Content][main_details_layout]

![Landing Subpage][landing_layout]

[main_details_layout]: ./assets/subpages_main_details_layout.png
[landing_layout]: ./assets/subpages_landing_layout.png