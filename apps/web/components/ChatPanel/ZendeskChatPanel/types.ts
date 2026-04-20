/* Types from: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d68871c8233e6aab90afe005833268639fc962e0/types/zendesk-web-widget/index.d.ts */

/**
 * Interface representing an error that occurs during the Zendesk Messenger login process.
 */
interface LoginFailedError {
  /** A descriptive message that explains the error */
  message: string
  /** Provides additional details on the cause of the login failure */
  reason: string
  /** Identifies the error type as `LoginFailedError` */
  type: string
}

/**
 * Interface representing a field and its value to be set on a conversation.
 */
interface ConversationField {
  id: string
  value: boolean | number | string
}

/**
 * Type definitions for the Zendesk Messenger Web Widget global function zE().
 *
 * It is a callable object with multiple overloads based on the scope and method arguments.
 * @see https://developer.zendesk.com/api-reference/widget-messaging/introduction/
 */
export type ZendeskMessengerAPI = {
  // --- Authentication Methods (messenger scope) ---

  /**
   * Associate users with your own user directory by issuing a `JWT` credential during the login flow.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/authentication/#login
   */
  (
    scope: 'messenger',
    method: 'loginUser',
    jwtCallback: (callback: (newJwtForUser: string) => void) => void,
    loginCallback?: (error: LoginFailedError | null) => void,
  ): void

  /**
   * Revert the messaging Web Widget to a pre-login state.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/authentication/#logout
   */
  (scope: 'messenger', method: 'logoutUser'): void

  // --- Core Methods (messenger scope) ---

  /**
   * Displays the widget on the host page in the state it was in before it was hidden.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#show
   */
  (scope: 'messenger', method: 'show'): void

  /**
   * Hides all parts of the widget from the page.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#hide
   */
  (scope: 'messenger', method: 'hide'): void

  /**
   * Opens the messaging Web Widget.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#open
   */
  (scope: 'messenger', method: 'open'): void

  /**
   * Closes the messaging Web Widget.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#close
   */
  (scope: 'messenger', method: 'close'): void

  /**
   * Clears all widget local state, including user data, conversations, and connections.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#reset-widget
   */
  (scope: 'messenger', method: 'resetWidget', callback: () => void): void

  // --- Event Methods (messenger:on scope) ---

  /**
   * Executes a callback when the messaging Web Widget opens.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#on-open
   */
  (scope: 'messenger:on', method: 'open', callback: () => void): void

  /**
   * Executes a callback when the messaging Web Widget closes.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#on-close
   */
  (scope: 'messenger:on', method: 'close', callback: () => void): void

  /**
   * Executes a callback when the number of unread messages changes.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#unread-messages
   */
  (
    scope: 'messenger:on',
    method: 'unreadMessages',
    callback: (count: number) => void,
  ): void

  // --- Setting Methods (messenger:set scope) ---

  /**
   * Sets the locale of the messaging Web Widget.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#set-locale
   */
  (scope: 'messenger:set', method: 'locale', newLocale: string): void

  /**
   * Sets the CSS property z-index on all the iframes for the messaging Web Widget.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#set-zindex
   */
  (scope: 'messenger:set', method: 'zIndex', newZIndex: number): void

  /**
   * Lets the messaging Web Widget know that it is unable to use cookies, local or session storage.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#set-cookies
   */
  (
    scope: 'messenger:set',
    method: 'cookies',
    range: 'all' | 'functional' | 'none',
  ): void

  /**
   * @deprecated Use the string literal overload ('all' | 'functional' | 'none') instead.
   */
  (scope: 'messenger:set', method: 'cookies', isEnabled: boolean): void

  /**
   * Allows values for conversation fields to be set in the client to add contextual data about the conversation.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#set-conversation-fields
   */
  (
    scope: 'messenger:set',
    method: 'conversationFields',
    value: ConversationField[],
    callback?: () => void,
  ): void

  /**
   * Allows custom conversation tags to be set in the client to add contextual data about the conversation.
   * @see https://developer.zendesk.com/api-reference/widget-messaging/web/core/#set-conversation-tags
   */
  (scope: 'messenger:set', method: 'conversationTags', value: string[]): void
}
