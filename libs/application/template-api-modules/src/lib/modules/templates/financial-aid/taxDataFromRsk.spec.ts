import { ApplicationWithAttachments } from '@island.is/application/types'
import { PersonalTaxReturnApi as RskPersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'
import { AttachmentS3Service } from '../../shared/services'
import {
  fetchDirectTaxPaymentsFromRsk,
  fetchPersonalTaxReturnFromRsk,
  shouldFetchTaxDataFromRsk,
} from './taxDataFromRsk'

const NATIONAL_ID = '0101303019'
const APPLICATION_ID = 'application-id'
const ATTACHMENT_KEY = 'uuid-Framtal.pdf'

describe('taxDataFromRsk', () => {
  describe('shouldFetchTaxDataFromRsk', () => {
    it('returns true for municipality codes in the allowlist', () => {
      expect(shouldFetchTaxDataFromRsk('0000')).toBe(true)
      expect(shouldFetchTaxDataFromRsk('1400')).toBe(true)
    })

    it('returns false for other municipality codes', () => {
      expect(shouldFetchTaxDataFromRsk('0001')).toBe(false)
      expect(shouldFetchTaxDataFromRsk(undefined)).toBe(false)
      expect(shouldFetchTaxDataFromRsk(null)).toBe(false)
    })
  })

  describe('fetchDirectTaxPaymentsFromRsk', () => {
    it('maps salary breakdown like the financial-aid backend', async () => {
      const directTaxPayments = jest.fn().mockResolvedValueOnce({
        salaryBreakdown: [
          {
            salaryTotal: 1,
            payerNationalId: 2,
            personalAllowance: 3,
            salaryWithheldAtSource: 4,
            period: 5,
            year: 2022,
          },
          {
            salaryTotal: 7,
            payerNationalId: 8,
            personalAllowance: 9,
            salaryWithheldAtSource: 10,
            period: 11,
            year: 2022,
          },
        ],
        success: true,
      })

      const result = await fetchDirectTaxPaymentsFromRsk(
        { directTaxPayments } as unknown as RskPersonalTaxReturnApi,
        NATIONAL_ID,
      )

      const today = new Date()
      const threeMonthsAgoPeriod = new Date()
      threeMonthsAgoPeriod.setMonth(today.getMonth() - 3)
      const lastMonthPeriod = new Date()
      lastMonthPeriod.setMonth(today.getMonth() - 1)

      expect(directTaxPayments).toHaveBeenCalledWith(
        NATIONAL_ID,
        {
          year: threeMonthsAgoPeriod.getFullYear(),
          month: threeMonthsAgoPeriod.getMonth() + 1,
        },
        {
          year: lastMonthPeriod.getFullYear(),
          month: lastMonthPeriod.getMonth() + 1,
        },
      )
      expect(result).toEqual({
        directTaxPayments: [
          {
            totalSalary: 1,
            payerNationalId: '2',
            personalAllowance: 3,
            withheldAtSource: 4,
            month: 5,
            year: 2022,
          },
          {
            totalSalary: 7,
            payerNationalId: '8',
            personalAllowance: 9,
            withheldAtSource: 10,
            month: 11,
            year: 2022,
          },
        ],
        success: true,
      })
    })

    it('returns empty payments with success false when RSK throws', async () => {
      const result = await fetchDirectTaxPaymentsFromRsk(
        {
          directTaxPayments: jest.fn().mockRejectedValueOnce({}),
        } as unknown as RskPersonalTaxReturnApi,
        NATIONAL_ID,
      )

      expect(result).toEqual({
        directTaxPayments: [],
        success: false,
      })
    })
  })

  describe('fetchPersonalTaxReturnFromRsk', () => {
    const lastYear = new Date().getFullYear() - 1
    const twoYearsAgo = lastYear - 1
    const pdfContent = Buffer.from('tax-pdf').toString('base64')
    const expectedSize = Buffer.from(pdfContent, 'base64').length
    const application = { id: APPLICATION_ID } as ApplicationWithAttachments

    it('uploads last-year PDF and returns key, name and size', async () => {
      const personalTaxReturnInPdf = jest.fn().mockResolvedValueOnce({
        success: true,
        errorText: '',
        content: pdfContent,
      })
      const addAttachment = jest.fn().mockResolvedValue(ATTACHMENT_KEY)

      const result = await fetchPersonalTaxReturnFromRsk(
        { personalTaxReturnInPdf } as unknown as RskPersonalTaxReturnApi,
        { addAttachment } as unknown as AttachmentS3Service,
        application,
        NATIONAL_ID,
      )

      expect(personalTaxReturnInPdf).toHaveBeenCalledTimes(1)
      expect(personalTaxReturnInPdf).toHaveBeenCalledWith(NATIONAL_ID, lastYear)
      expect(addAttachment).toHaveBeenCalledWith(
        application,
        `Framtal_${NATIONAL_ID}_${lastYear}.pdf`,
        Buffer.from(pdfContent, 'base64'),
        { ContentType: 'application/pdf' },
      )
      expect(result).toEqual({
        personalTaxReturn: {
          key: ATTACHMENT_KEY,
          name: `Framtal_${NATIONAL_ID}_${lastYear}.pdf`,
          size: expectedSize,
        },
      })
    })

    it('falls back to the previous year when the last-year tax return fails', async () => {
      const personalTaxReturnInPdf = jest
        .fn()
        .mockRejectedValueOnce({})
        .mockResolvedValueOnce({
          success: true,
          errorText: '',
          content: pdfContent,
        })
      const addAttachment = jest.fn().mockResolvedValue(ATTACHMENT_KEY)

      const result = await fetchPersonalTaxReturnFromRsk(
        { personalTaxReturnInPdf } as unknown as RskPersonalTaxReturnApi,
        { addAttachment } as unknown as AttachmentS3Service,
        application,
        NATIONAL_ID,
      )

      expect(personalTaxReturnInPdf).toHaveBeenCalledTimes(2)
      expect(personalTaxReturnInPdf).toHaveBeenNthCalledWith(
        1,
        NATIONAL_ID,
        lastYear,
      )
      expect(personalTaxReturnInPdf).toHaveBeenNthCalledWith(
        2,
        NATIONAL_ID,
        twoYearsAgo,
      )
      expect(addAttachment).toHaveBeenCalledWith(
        application,
        `Framtal_${NATIONAL_ID}_${twoYearsAgo}.pdf`,
        expect.any(Buffer),
        { ContentType: 'application/pdf' },
      )
      expect(result.personalTaxReturn).toEqual({
        key: ATTACHMENT_KEY,
        name: `Framtal_${NATIONAL_ID}_${twoYearsAgo}.pdf`,
        size: expectedSize,
      })
    })

    it('returns undefined personalTaxReturn when both years fail', async () => {
      const addAttachment = jest.fn()

      const result = await fetchPersonalTaxReturnFromRsk(
        {
          personalTaxReturnInPdf: jest.fn().mockRejectedValue({}),
        } as unknown as RskPersonalTaxReturnApi,
        { addAttachment } as unknown as AttachmentS3Service,
        application,
        NATIONAL_ID,
      )

      expect(addAttachment).not.toHaveBeenCalled()
      expect(result.personalTaxReturn).toBeUndefined()
    })
  })
})
