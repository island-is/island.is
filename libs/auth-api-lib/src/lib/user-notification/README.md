# User Notification Service

## Key Modifications (File Content Update)

1. **Replication of Components**:
   - Copied essential components from `@island.is/clients/user-notification` directly into this service, focusing solely on system notification functionality relevant to delegations.

2. **Direct Notification Handling**:
   - Created standalone functions and classes to process and send system notifications for newly created delegations, avoiding reliance on the original user-notification client.

3. **Independence from External Client**:
   - Embedded the logic for sending notifications directly within this service, eliminating the need for external dependencies that could cause circular references.

