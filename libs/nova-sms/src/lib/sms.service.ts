import { Inject, Injectable } from '@nestjs/common'

import {
  createEnhancedFetch,
  type EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { smsModuleConfig } from './sms.config'
import type {
  DeliveryStatus,
  NovaV1QueryRequest,
  NovaV1Response,
  NovaV1SendRequest,
  SendSmsOptions,
  SmsMessageResult,
  SmsQueryResult,
  SmsSendResult,
} from './sms.types'

/**
 * Nova SMS API error
 * Handles both API-level errors and message-level errors from Nova v1 API
 */
export class NovaError extends Error {
  constructor(
    public readonly apiError: boolean, // true = API error, false = message error
    public readonly details: string,
    public readonly httpStatus?: number,
  ) {
    super(details)
    this.name = 'NovaError'
  }
}

/**
 * SMS Service using Nova SMS API v1
 *
 * Features:
 * - HTTP POST with JSON payloads
 * - HTTP Basic Authentication
 * - Support for up to 100 recipients per request
 * - Message tracking via UUIDs
 * - Rich delivery status information
 * - Message querying by UUID
 */
@Injectable()
export class SmsService {
  private readonly fetch: EnhancedFetchAPI

  constructor(
    @Inject(smsModuleConfig.KEY)
    private readonly config: ConfigType<typeof smsModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    // Create EnhancedFetch instance with HTTP Basic Auth
    this.fetch = createEnhancedFetch({
      name: 'clients-nova-sms',
      logErrorResponseBody: true,
    })
  }

  /**
   * Send SMS to one or multiple recipients
   *
   * @param recipients - Phone number(s) - string for single, array for multiple (max 100)
   * @param message - Message text content
   * @param options - Optional settings (wait strategy, custom sender name)
   * @returns Result with UUIDs and delivery status for each message
   * @throws NovaError on API-level errors (authentication, network, etc.)
   */
  async sendSms(
    recipients: string | string[],
    message: string,
    options?: SendSmsOptions,
  ): Promise<SmsSendResult> {
    const recipientArray = Array.isArray(recipients) ? recipients : [recipients]
    const wait = options?.wait || 'queue'
    const from = options?.from ?? this.config.senderName ?? 'Island.is'

    // Validate recipient count
    if (recipientArray.length === 0) {
      throw new Error('At least one recipient is required')
    }
    if (recipientArray.length > 100) {
      throw new Error('Maximum 100 recipients per request')
    }

    this.logger.debug(`Sending SMS - message: ${message}`, {
      wait,
      from,
      recipients: recipientArray.join(', '),
    })

    // Build v1 API request
    const requestBody: NovaV1SendRequest = {
      from,
      to: recipientArray,
      body: message,
      wait,
    }

    try {
      // Make HTTP POST request with Basic Auth
      const response = await this.fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.buildBasicAuthHeader(),
        },
        body: JSON.stringify(requestBody),
      })

      // Parse JSON response
      const data: NovaV1Response = await response.json()

      // Check for API-level errors
      if (data.error) {
        this.logger.error('Nova SMS API error:', data.error_details)
        throw new NovaError(
          true,
          data.error_details || 'Unknown API error',
          response.status,
        )
      }

      // Map to simplified result
      return this.mapToSendResult(data)
    } catch (error) {
      // If it's already a NovaError, re-throw it
      if (error instanceof NovaError) {
        throw error
      }

      // Handle fetch errors
      this.logger.error('SMS send failed:', error)
      throw new NovaError(
        true,
        error instanceof Error ? error.message : 'Unknown error',
      )
    }
  }

  /**
   * Query status of previously sent messages by UUID
   *
   * @param uuids - UUID(s) to query - string for single, array for multiple (max 100)
   * @returns Current status and delivery information for each message
   * @throws NovaError on API-level errors
   */
  async querySms(uuids: string | string[]): Promise<SmsQueryResult> {
    const uuidArray = Array.isArray(uuids) ? uuids : [uuids]

    // Validate UUID count
    if (uuidArray.length === 0) {
      throw new Error('At least one UUID is required')
    }
    if (uuidArray.length > 100) {
      throw new Error('Maximum 100 UUIDs per request')
    }

    this.logger.debug(`Querying ${uuidArray.length} message(s)`)

    // Build v1 API query request
    const requestBody: NovaV1QueryRequest = {
      uuid: uuidArray,
    }

    try {
      const response = await this.fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.buildBasicAuthHeader(),
        },
        body: JSON.stringify(requestBody),
      })

      const data: NovaV1Response = await response.json()

      // Check for API-level errors
      if (data.error) {
        this.logger.error('Nova SMS API error:', data.error_details)
        throw new NovaError(
          true,
          data.error_details || 'Unknown API error',
          response.status,
        )
      }

      // Map to simplified result
      return this.mapToQueryResult(data)
    } catch (error) {
      if (error instanceof NovaError) {
        throw error
      }

      this.logger.error('SMS query failed:', error)
      throw new NovaError(
        true,
        error instanceof Error ? error.message : 'Unknown error',
      )
    }
  }

  /**
   * Build HTTP Basic Authentication header
   * @private
   */
  private buildBasicAuthHeader(): string {
    const credentials = `${this.config.username}:${this.config.password}`
    const base64Credentials = Buffer.from(credentials).toString('base64')
    return `Basic ${base64Credentials}`
  }

  /**
   * Map Nova v1 response to simplified send result
   * @private
   */
  private mapToSendResult(data: NovaV1Response): SmsSendResult {
    return {
      success: !data.error,
      messages: data.messages.map(this.mapMessage),
      messagesTotal: data.messages_total,
    }
  }

  /**
   * Map Nova v1 response to simplified query result
   * @private
   */
  private mapToQueryResult(data: NovaV1Response): SmsQueryResult {
    return {
      success: !data.error,
      messages: data.messages.map(this.mapMessage),
      messagesTotal: data.messages_total,
    }
  }

  /**
   * Map individual Nova v1 message to simplified format
   * @private
   */
  private mapMessage(message: NovaV1Response['messages'][0]): SmsMessageResult {
    return {
      uuid: message.uuid,
      to: message.to,
      status: message.delivery_status as DeliveryStatus,
      error: message.error,
      errorDetails: message.error_details,
      segmentsTotal: message.segments_total,
      timestampRequest: message.timestamp_request,
      timestampQueued: message.timestamp_queued,
      timestampDelivered: message.timestamp_delivered,
    }
  }
}
