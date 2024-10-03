# User Notification

## About

This service queues notifications, stores them in a database, and sends push notifications and emails.

## Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    Institution->>Advania: Adds new message in mailbox
    Advania->>User-Notification-Service: Sends message notification via xroad
    User-Notification-Service->>AWS SQS: Queues processed notification
    loop
    User-Notification-Worker->>AWS SQS: Requests 10 notifications
    AWS SQS->>User-Notification-Worker: Responds with 0-10 notifications
    end
    User-Notification-Worker->>Database: Saves notification
    User-Notification-Worker->>User-Profile-Service: Requests notification settings
    User-Profile-Service->>User-Notification-Worker: Returns user settings and tokens
    User-Notification-Worker->>Firebase Cloud Messaging: Sends notification
    Firebase Cloud Messaging->>island.is app: Sends push notification
    User-Notification-Worker->>User email: Sends email
```

## Running the Project

### Initial Setup

Sign into AWS:

```sh
aws sso login
```

Retrieve secrets:

```sh
yarn get-secrets user-notification
```

Initialize dependencies:

```sh
yarn dev-init services-user-notification
```

### Start User Notification Service

```sh
yarn dev services-user-notification
```

### User Notification Worker

Processes queue messages, saves to the database, and sends via push and email. Start a worker:

```sh
yarn nx run services-user-notification:worker
```

### User Notification Cleanup Worker

Deletes old messages from the database. Start a cleanup worker:

```sh
yarn nx run services-user-notification:cleanup
```
