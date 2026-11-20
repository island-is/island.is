# portals-form-system-ui-components

This library was generated with [Nx](https://nx.dev).

## Family fields

The FAMILY / CHILD dropdown uses `showBiologicalChildren` and
`showChildrenInCustody` settings to select National Registry `biologicalChildren`
(legal parentage) and `childCustody` (custody) results. Both settings default to
true when unset, preserving existing fields. When both are enabled, children
present in both lists appear once, matched by national ID. Disabling both
produces an empty list. The selected list is cached on the field for subsequent
renders.

## Running unit tests

Run `yarn nx test portals-form-system-ui` to execute the unit tests via [Jest](https://jestjs.io).
