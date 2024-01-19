# User Notification

## About

This service manages queueing and storing messages as well a sending push notifications and emails.

## Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    Institution->>Advania:adds new message in mailbox
    Advania->>User-Notification-Service:xroad:sends message notification
    User-Notification-Service->>AWS SQS:adds processed notification to queue
    loop
    User-Notification-Worker->>AWS SQS:requests 10 notifications
    AWS SQS->>User-Notification-Worker:responds with 0-10 notifications
    end
    User-Notification-Worker->>Database: saves notification
    User-Notification-Worker->>User-Profile-Service:requests notification settings
    User-Profile-Service->>User-Notification-Worker:returns user settings and tokens
    User-Notification-Worker->>Firebase Cloud Messaging: sends notification
    Firebase Cloud Messaging->>island.is app:sends push notification
    User-Notification-Worker->>User email: sends e-mail
```

## Running the project:

### Initial Setup

Sign into AWS:

```sh
aws sso login
```

Get secrets:
```sh
yarn get-secrets user-notification
```

Initalize dependencies:

```sh
yarn dev-init services-user-notification
```

### Start User Notification Service
```sh
yarn dev services-user-notification
```

### User Notification Worker

This worker gets messages from the queue and saves to database and sends via push and email.
Start a worker with this command:

```sh
yarn nx run services-user-notification:worker
```

### User Notification Cleanup Worker

This worker deletes old messages from the database
Start a cleanup worker with this command:

```sh
yarn nx run services-user-notification:cleanup
```
