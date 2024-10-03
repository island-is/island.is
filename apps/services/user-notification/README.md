# User Notification

## About

This service handles queuing, storing, and sending notifications via push and email.

## Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    Institution->>Advania:adds new message to mailbox
    Advania->>User-Notification-Service:xroad:sends message notification
    User-Notification-Service->>AWS SQS:adds processed notification to queue
    loop
    User-Notification-Worker->>AWS SQS:requests 10 notifications
    AWS SQS->>User-Notification-Worker:responds with 0-10 notifications
    end
    User-Notification-Worker->>Database:saves notification
    User-Notification-Worker->>User-Profile-Service:requests notification settings
    User-Profile-Service->>User-Notification-Worker:returns user settings and tokens
    User-Notification-Worker->>Firebase Cloud Messaging:sends notification
    Firebase Cloud Messaging->>island.is app:sends push notification
    User-Notification-Worker->>User email:sends email
```

## Running the Project

### Initial Setup

1. Sign into AWS:

   ```sh
   aws sso login
   ```

2. Retrieve secrets:

   ```sh
   yarn get-secrets user-notification
   ```

3. Initialize dependencies:

   ```sh
   yarn dev-init services-user-notification
   ```

### Start User Notification Service

```sh
yarn dev services-user-notification
```

### User Notification Worker

The worker processes messages, saves them in the database, and sends them via push and email. Start it with:

```sh
yarn nx run services-user-notification:worker
```

### User Notification Cleanup Worker

This worker removes old messages from the database. Start it with:

```sh
yarn nx run services-user-notification:cleanup
```