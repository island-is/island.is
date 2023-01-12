# User Notification

## Quickstart

```sh
yarn dev-init services-user-notification
yarn dev services-user-notification
```

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

TODO: Needs to actually start a worker
```sh
yarn nx run services-user-notification:worker
```

## Interacting

You can `POST` to the notification service at `localhost:3333/notifications` with the required parameters, e.g.

```sh
curl -X POST http://localhost:3333/notifications --json '{"type": "newDocumentMessage", "recipient": "1111111111", "organization": "My Cool Org", "documentId": "my-invalid-document-id"}'
```

Check `src/app/modules/notifications/dto/createNotification.dto.ts` for data required and other message types.
