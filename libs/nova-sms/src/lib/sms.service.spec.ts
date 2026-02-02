import { Test, TestingModule } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import { smsModuleConfig } from './sms.config'
import { NovaError, SmsService } from './sms.service'
import type { DeliveryStatus, NovaV1Response } from './sms.types'

// Mock EnhancedFetch
const mockFetch = jest.fn()

jest.mock('@island.is/clients/middlewares', () => ({
  createEnhancedFetch: jest.fn(() => mockFetch),
}))

const testNumber = '3547801512'
const testNumber2 = '3548325548'
const testMessage = 'Test Message'
const testUuid = '72be348f-7ac8-4751-a0b7-2c9ac47b68cd'
const testUuid2 = 'fc606b53-d246-4899-821d-993a500155c8'

// Helper to create v1 API response
const createV1Response = (
  messages: Array<{
    to: string
    uuid?: string
    status?: string
    error?: boolean
    errorDetails?: string
  }>,
): NovaV1Response => ({
  error: false,
  messages: messages.map((msg) => ({
    delivery_status: (msg.status as DeliveryStatus) || 'queued',
    delivery_status_details: 'message queued and awaiting delivery',
    error: msg.error || false,
    error_details: msg.errorDetails,
    from: 'Island.is',
    to: msg.to,
    uuid: msg.uuid || testUuid,
    segments_queued: 1,
    segments_total: 1,
    timestamp_queued: '2021-01-12T14:52:22.430700946Z',
    timestamp_request: '2021-01-12T14:52:22.299003626Z',
  })),
  messages_queued: messages.length,
  messages_total: messages.length,
  segments_queued: messages.length,
  segments_total: messages.length,
  timestamp: '2021-01-12T14:52:22.447190927Z',
})

describe('SmsService', () => {
  let smsService: SmsService

  beforeEach(async () => {
    mockFetch.mockClear()

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [smsModuleConfig],
        }),
        LoggingModule,
      ],
      providers: [SmsService],
    }).compile()

    smsService = module.get<SmsService>(SmsService)
  })

  describe('sendSms', () => {
    it('should send SMS to single recipient', async () => {
      const mockResponse = createV1Response([{ to: testNumber }])
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockResponse,
      })

      const result = await smsService.sendSms(testNumber, testMessage)

      // Verify result structure
      expect(result.success).toBe(true)
      expect(result.messagesTotal).toBe(1)
      expect(result.messages).toHaveLength(1)
      expect(result.messages[0]).toMatchObject({
        uuid: testUuid,
        to: testNumber,
        status: 'queued',
        error: false,
      })

      // Verify fetch was called correctly
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://smsapi.devnova.is/v1/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: expect.stringContaining('Basic '),
          }),
        }),
      )

      // Verify request body
      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      expect(body).toEqual({
        from: 'Island.is',
        to: [testNumber],
        body: testMessage,
        wait: 'queue',
      })
    })

    it('should send SMS to multiple recipients', async () => {
      const recipients = [testNumber, testNumber2]
      const mockResponse = createV1Response([
        { to: testNumber, uuid: testUuid },
        { to: testNumber2, uuid: testUuid2 },
      ])
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockResponse,
      })

      const result = await smsService.sendSms(recipients, testMessage)

      expect(result.success).toBe(true)
      expect(result.messagesTotal).toBe(2)
      expect(result.messages).toHaveLength(2)
      expect(result.messages[0].to).toBe(testNumber)
      expect(result.messages[1].to).toBe(testNumber2)

      // Verify request body has multiple recipients
      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      expect(body.to).toEqual(recipients)
    })

    it('should support custom wait strategy', async () => {
      const mockResponse = createV1Response([
        { to: testNumber, status: 'delivered' },
      ])
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockResponse,
      })

      await smsService.sendSms(testNumber, testMessage, { wait: 'delivery' })

      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      expect(body.wait).toBe('delivery')
    })

    it('should support custom sender name', async () => {
      const mockResponse = createV1Response([{ to: testNumber }])
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockResponse,
      })

      await smsService.sendSms(testNumber, testMessage, { from: 'CustomName' })

      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      expect(body.from).toBe('CustomName')
    })

    it('should throw on API-level error', async () => {
      const errorResponse: NovaV1Response = {
        error: true,
        error_details: 'invalid username or password',
        messages: [],
        messages_total: 0,
        timestamp: '2021-01-12T14:52:22.447190927Z',
      }

      mockFetch.mockResolvedValueOnce({
        status: 401,
        json: async () => errorResponse,
      })

      try {
        await smsService.sendSms(testNumber, testMessage)
        fail('Should have thrown NovaError')
      } catch (error) {
        expect(error).toBeInstanceOf(NovaError)
        expect((error as NovaError).apiError).toBe(true)
        expect((error as NovaError).details).toEqual(
          errorResponse.error_details,
        )
      }
    })

    it('should return message-level errors without throwing', async () => {
      const mockResponse = createV1Response([
        {
          to: '354780152', // Invalid number
          status: 'failed',
          error: true,
          errorDetails: 'invalid sender or recipient address',
        },
      ])
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockResponse,
      })

      const result = await smsService.sendSms('354780152', testMessage)

      expect(result.success).toBe(true) // No API error
      expect(result.messages[0].error).toBe(true) // But message has error
      expect(result.messages[0].errorDetails).toContain('invalid')
    })

    it('should validate recipient count', async () => {
      await expect(smsService.sendSms([], testMessage)).rejects.toThrow(
        'At least one recipient is required',
      )

      const tooManyRecipients = Array(101).fill('1234567')
      await expect(
        smsService.sendSms(tooManyRecipients, testMessage),
      ).rejects.toThrow('Maximum 100 recipients per request')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(smsService.sendSms(testNumber, testMessage)).rejects.toThrow(
        NovaError,
      )
    })
  })

  describe('querySms', () => {
    it('should query single message by UUID', async () => {
      const mockResponse = createV1Response([
        {
          to: testNumber,
          uuid: testUuid,
          status: 'delivered',
        },
      ])
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockResponse,
      })

      const result = await smsService.querySms(testUuid)

      expect(result.success).toBe(true)
      expect(result.messagesTotal).toBe(1)
      expect(result.messages[0]).toMatchObject({
        uuid: testUuid,
        status: 'delivered',
      })

      // Verify request body
      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      expect(body).toEqual({
        uuid: [testUuid],
      })
    })

    it('should query multiple messages by UUID', async () => {
      const uuids = [testUuid, testUuid2]
      const mockResponse = createV1Response([
        { to: testNumber, uuid: testUuid },
        { to: testNumber2, uuid: testUuid2 },
      ])
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockResponse,
      })

      const result = await smsService.querySms(uuids)

      expect(result.success).toBe(true)
      expect(result.messagesTotal).toBe(2)
      expect(result.messages).toHaveLength(2)

      // Verify request body
      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      expect(body.uuid).toEqual(uuids)
    })

    it('should handle unknown UUID', async () => {
      const unknownUuid = 'unknown-uuid-123'
      const mockResponse: NovaV1Response = {
        error: false,
        messages: [
          {
            delivery_status: 'unknown',
            delivery_status_details: 'message delivery status is unknown',
            error: true,
            error_details: 'no such uuid or unauthorized attempt',
            from: '',
            to: '',
            uuid: unknownUuid,
            timestamp_request: '0001-01-01T00:00:00Z',
          },
        ],
        messages_total: 1,
        messages_unknown: 1,
        timestamp: '2021-01-13T13:01:41.077244391Z',
      }

      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockResponse,
      })

      const result = await smsService.querySms(unknownUuid)

      expect(result.success).toBe(true)
      expect(result.messages[0].error).toBe(true)
      expect(result.messages[0].status).toBe('unknown')
    })

    it('should validate UUID count', async () => {
      await expect(smsService.querySms([])).rejects.toThrow(
        'At least one UUID is required',
      )

      const tooManyUuids = Array(101).fill('uuid-123')
      await expect(smsService.querySms(tooManyUuids)).rejects.toThrow(
        'Maximum 100 UUIDs per request',
      )
    })
  })

  describe('HTTP Basic Authentication', () => {
    it('should include Basic Auth header', async () => {
      const mockResponse = createV1Response([{ to: testNumber }])
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockResponse,
      })

      await smsService.sendSms(testNumber, testMessage)

      const callArgs = mockFetch.mock.calls[0]
      const authHeader = callArgs[1].headers.Authorization
      expect(authHeader).toMatch(/^Basic /)

      // Decode and verify credentials
      const base64Creds = authHeader.replace('Basic ', '')
      const decoded = Buffer.from(base64Creds, 'base64').toString()
      expect(decoded).toContain('IslandIs_User_Development')
    })
  })
})
