// Nova SMS API v1 Type Definitions

/**
 * Wait strategy for message sending.
 * - 'no': Return immediately after getting UUID (fastest)
 * - 'queue': Wait until message is queued on SMSC (default, same as v0)
 * - 'delivery': Wait for delivery confirmation (slowest but most reliable)
 */
export type WaitStrategy = 'no' | 'queue' | 'delivery'

/**
 * Delivery status of a message
 */
export type DeliveryStatus =
  | 'accepted'
  | 'delivered'
  | 'failed'
  | 'queued'
  | 'queueing'
  | 'rejected'
  | 'timeout'
  | 'unknown'

/**
 * Nova v1 API Request - Send SMS
 */
export interface NovaV1SendRequest {
  user?: string // Omitted when using HTTP Basic Auth
  pass?: string // Omitted when using HTTP Basic Auth
  from: string
  to: string[] // 1-100 recipients
  body: string
  wait?: WaitStrategy
  callback?: string
  pretty?: boolean
}

/**
 * Nova v1 API Request - Query SMS
 */
export interface NovaV1QueryRequest {
  user?: string // Omitted when using HTTP Basic Auth
  pass?: string // Omitted when using HTTP Basic Auth
  uuid: string[] // 1-100 UUIDs
  pretty?: boolean
}

/**
 * Individual message in Nova v1 response
 */
export interface NovaV1Message {
  delivery_status: DeliveryStatus
  delivery_status_details: string
  error: boolean
  error_details?: string
  from: string
  original_from?: string
  original_to?: string
  to: string
  uuid: string
  segments_accepted?: number
  segments_delivered?: number
  segments_failed?: number
  segments_queued?: number
  segments_total?: number
  timestamp_accepted?: string
  timestamp_delivered?: string
  timestamp_failed?: string
  timestamp_queued?: string
  timestamp_request: string
}

/**
 * Nova v1 API Response - Send or Query
 */
export interface NovaV1Response {
  error: boolean
  error_details?: string
  messages: NovaV1Message[]
  messages_accepted?: number
  messages_delivered?: number
  messages_failed?: number
  messages_queued?: number
  messages_total: number
  messages_transient?: number
  messages_unknown?: number
  segments_accepted?: number
  segments_delivered?: number
  segments_failed?: number
  segments_queued?: number
  segments_total?: number
  timestamp: string
}

// ============================================================================
// Simplified Public API Types
// ============================================================================

/**
 * Simplified message result for public API
 */
export interface SmsMessageResult {
  uuid: string
  to: string
  status: DeliveryStatus
  error: boolean
  errorDetails?: string
  segmentsTotal?: number
  timestampRequest: string
  timestampQueued?: string
  timestampDelivered?: string
}

/**
 * Simplified send result returned by sendSms()
 */
export interface SmsSendResult {
  success: boolean // true if no API-level error
  messages: SmsMessageResult[]
  messagesTotal: number
}

/**
 * Simplified query result returned by querySms()
 */
export interface SmsQueryResult {
  success: boolean
  messages: SmsMessageResult[]
  messagesTotal: number
}

/**
 * Options for sendSms method
 */
export interface SendSmsOptions {
  /**
   * Wait strategy for message sending
   * @default 'queue'
   */
  wait?: WaitStrategy
  /**
   * Sender name/number (alphanumeric up to 11 chars)
   * @default 'Island.is'
   */
  from?: string
}
