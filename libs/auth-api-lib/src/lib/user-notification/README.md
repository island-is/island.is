## Improved Documentation

### Context

To circumvent a circular dependency, we replicate necessary components of the `@island.is/clients/user-notification` system notification client.

### Issue

The user-notification service employs the delegation API to incorporate Hnipp support for delegations, requiring a lookup in the delegation index. A circular dependency arises with the delegation API now issuing notifications for newly created delegations, as both services utilize the user-notification client.

### Solution

We replicate the essential parts of the user-notification client necessary for creating system notifications within this service. This approach resolves the circular dependency while maintaining required functionality.

### Key Modifications (File Content Update)

- Replicated specific components of `@island.is/clients/user-notification`.
- Implemented mechanisms to directly handle system notifications for delegations.
- Ensured that notifications can be sent independently of the user-notification client.
