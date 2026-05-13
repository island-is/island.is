# Portals Admin Application System

This library was generated with [Nx](https://nx.dev).

## Translation Workspace

The translation dashboard lists **message keys discovered by server-side form introspection**, not by rendering React. Custom field previews load real field components, but **strings that exist only inside component implementation code** are invisible to the dashboard unless they are also exposed on the form (`CUSTOM` `title` / `description` / `props` as `MessageDescriptor`s) or registered via `getCustomFieldMessageDescriptors` on the template library (see [`application-template-loader`](../../../application/template-loader/README.md)).

## Running unit tests

Run `nx test portals-admin-application-system` to execute the unit tests via [Jest](https://jestjs.io).
