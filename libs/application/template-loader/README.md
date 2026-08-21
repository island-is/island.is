# Application Template Loader

The sole purpose of this library is to lazily load application templates, data providers, forms, and fields. This ensures that bundle sizes are small, and only the currently viewed application template, form, and fields are part of the js bundle.

## Adding a new template

If you are building a new application template from scratch, add its type and import loader into `src/lib/templateLoaders.ts`. Then it can be used in the backend and frontend apps.

## Translation Workspace (admin) and `CUSTOM` fields

The admin **Translation Workspace** builds its string list from **form introspection** only: it walks each role’s `form` definition (sections, `CUSTOM` fields, etc.) and collects `MessageDescriptor` values it finds there. It does **not** parse React components.

- **Strings declared only inside JSX** (or only inside a subcomponent without going through the form) **will not appear** in the workspace until they are represented as discoverable data.
- Prefer putting user-facing copy on the **`CUSTOM` field itself** (`title`, `description`) and in **`props`**: any `MessageDescriptor` nested under `props` is picked up automatically by introspection (recursive walk with a depth limit).
- For copy that cannot live in `props`, export **`getCustomFieldMessageDescriptors`** from the same template library module as `getFields`. It must return a map from **`CustomField.component`** string to an array of `{ id, defaultMessage?, description? }`. Those entries are merged into introspection for matching custom screens.

## Running unit tests

Run `ng test application-template-loader` to execute the unit tests via [Jest](https://jestjs.io).
