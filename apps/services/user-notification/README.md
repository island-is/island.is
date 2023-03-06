# User Notification

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
    loop if worker throws an unexpected error, it will try 2 more times with 10 minute interval
    User-Notification-Worker->>User-Profile-Service:requests notification settings
    User-Profile-Service->>User-Notification-Worker:returns user settings and tokens
    end
    User-Notification-Worker->>Firebase Cloud Messaging: sends notification
    Firebase Cloud Messaging->>island.is app:sends notification
```

## About

This service manages queueing up messages to send push notifications / sms / emails.

## running the project:

### Dev setup & running:

```sh
yarn dev-services services-user-notification
yarn start services-user-notification
```

### Starting a worker

```sh
yarn nx run services-user-notification:worker
```
