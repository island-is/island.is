# User Notification

## About

This service is responsible for queuing notifications, storing them in a database, and sending push notifications and emails.

## Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    Institution->>Advania: Adds new message in mailbox
    Advania->>User-Notification-Service: xroad: Sends message notification
    User-Notification-Service->>AWS SQS: Adds processed notification to queue
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

1. Sign into AWS:

   ```sh
   aws sso login
   ```

2. Get secrets:

   ```sh
   yarn get-secrets user-notification
   ```

3. Initialize dependencies:

   ```sh
   yarn dev-init services-user-notification
   ```

### Start User Notification Service

Start the service with the following command:

```sh
yarn dev services-user-notification
```

### User Notification Worker

The worker retrieves messages from the queue, saves them to the database, and sends notifications via push and email. Start a worker with this command:

```sh
yarn nx run services-user-notification:worker
```

### User Notification Cleanup Worker

The cleanup worker deletes old messages from the database. Start a cleanup worker with this command:

```sh
yarn nx run services-user-notification:cleanup
```