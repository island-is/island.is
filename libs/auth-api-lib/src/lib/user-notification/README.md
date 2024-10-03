```typescript
// NotificationService.ts

import { SystemNotification } from './SystemNotification'

/**
 * Service to handle the creation and management of system notifications.
 * This class replicates the necessary functionality from @island.is/clients/user-notification
 * to avoid circular dependencies.
 */
export class NotificationService {
  constructor(private readonly systemNotification: SystemNotification) {}

  /**
   * Sends a system notification.
   *
   * @param recipientId - The ID of the notification recipient.
   * @param message - The content of the notification message.
   *
   * @returns {Promise<void>} - A promise that resolves when the notification has been successfully sent.
   */
  async sendNotification(recipientId: string, message: string): Promise<void> {
    try {
      await this.systemNotification.create({
        recipientId,
        message,
      })
    } catch (error) {
      console.error('Failed to send system notification:', error)
      throw error
    }
  }
}

// SystemNotification.ts

/**
 * Mock class to simulate the creation of system notifications.
 * This acts as a placeholder for the actual system notification logic in the user-notification client.
 */
export class SystemNotification {
  /**
   * Creates a system notification for a given recipient.
   *
   * @param notification - An object containing recipientId and message of the notification.
   */
  async create(notification: {
    recipientId: string
    message: string
  }): Promise<void> {
    // Placeholder logic for creating a system notification
    console.log('Notification created:', notification)
  }
}
```
