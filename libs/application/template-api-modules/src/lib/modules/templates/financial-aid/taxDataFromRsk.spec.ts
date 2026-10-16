import { mock } from 'jest-mock-extended'
import { ApplicationWithAttachments } from '@island.is/application/types'
import type { Logger } from '@island.is/logging'
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
  const logger = mock<Logger>()

  beforeEach(() => jest.clearAllMocks())

  describe('shouldFetchTaxDataFromRsk', () => {
    it('returns true for a stored Veita route', () => {
      expect(
        shouldFetchTaxDataFromRsk({
          municipality: {
            data: { backend: 'veita', veitaTenant: 'hafnarfjordur' },
            date: new Date(),
            status: 'success',
          },
        }),
      ).toBe(true)
    })

    it.each([{}, { backend: 'municipalities' }])(
      'uses the primary backend when routing is %j',
      (data) => {
        expect(
          shouldFetchTaxDataFromRsk({
            municipality: { data, date: new Date(), status: 'success' },
          }),
        ).toBe(false)
      },
    )

    it('uses the primary backend when municipality data is missing', () => {
      expect(shouldFetchTaxDataFromRsk({})).toBe(false)
    })
  })

  describe('fetchDirectTaxPaymentsFromRsk', () => {
    afterEach(() => jest.useRealTimers())

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
        logger,
        APPLICATION_ID,
      )

      expect(directTaxPayments).toHaveBeenCalledWith(
        NATIONAL_ID,
        expect.any(Object),
        expect.any(Object),
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

    it.each([
      ['mid-month', new Date(2026, 9, 15, 12), [2026, 7], [2026, 9]],
      [
        'end of a 31-day month',
        new Date(2026, 9, 31, 12),
        [2026, 7],
        [2026, 9],
      ],
      ['end of March', new Date(2026, 2, 31, 12), [2025, 12], [2026, 2]],
      ['January', new Date(2026, 0, 31, 12), [2025, 10], [2025, 12]],
    ])(
      'requests the last three full months (%s)',
      async (_, now, [fromYear, fromMonth], [toYear, toMonth]) => {
        jest.useFakeTimers({ now })
        const directTaxPayments = jest
          .fn()
          .mockResolvedValue({ salaryBreakdown: [], success: true })

        await fetchDirectTaxPaymentsFromRsk(
          { directTaxPayments } as unknown as RskPersonalTaxReturnApi,
          NATIONAL_ID,
          logger,
          APPLICATION_ID,
        )

        expect(directTaxPayments).toHaveBeenCalledWith(
          NATIONAL_ID,
          { year: fromYear, month: fromMonth },
          { year: toYear, month: toMonth },
        )
      },
    )

    it('returns empty payments with success false when RSK throws', async () => {
      const result = await fetchDirectTaxPaymentsFromRsk(
        {
          directTaxPayments: jest.fn().mockRejectedValueOnce({}),
        } as unknown as RskPersonalTaxReturnApi,
        NATIONAL_ID,
        logger,
        APPLICATION_ID,
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
    const application = {
      id: APPLICATION_ID,
      applicant: NATIONAL_ID,
    } as ApplicationWithAttachments

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
        logger,
      )

      expect(personalTaxReturnInPdf).toHaveBeenCalledTimes(1)
      expect(personalTaxReturnInPdf).toHaveBeenCalledWith(NATIONAL_ID, lastYear)
      expect(addAttachment).toHaveBeenCalledWith(
        application,
        `Framtal_${lastYear}.pdf`,
        Buffer.from(pdfContent, 'base64'),
        { ContentType: 'application/pdf' },
      )
      expect(result).toEqual({
        personalTaxReturn: {
          key: ATTACHMENT_KEY,
          name: `Framtal_${lastYear}.pdf`,
          size: expectedSize,
        },
      })
    })

    it('names the spouse tax return distinctly without a national id', async () => {
      const spouseNationalId = '0101307789'
      const addAttachment = jest.fn().mockResolvedValue(ATTACHMENT_KEY)

      const result = await fetchPersonalTaxReturnFromRsk(
        {
          personalTaxReturnInPdf: jest.fn().mockResolvedValue({
            success: true,
            errorText: '',
            content: pdfContent,
          }),
        } as unknown as RskPersonalTaxReturnApi,
        { addAttachment } as unknown as AttachmentS3Service,
        application,
        spouseNationalId,
        logger,
      )

      const fileName = `Framtal_maki_${lastYear}.pdf`
      expect(addAttachment).toHaveBeenCalledWith(
        application,
        fileName,
        expect.any(Buffer),
        { ContentType: 'application/pdf' },
      )
      expect(result.personalTaxReturn?.name).toBe(fileName)
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
        logger,
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
        `Framtal_${twoYearsAgo}.pdf`,
        expect.any(Buffer),
        { ContentType: 'application/pdf' },
      )
      expect(result.personalTaxReturn).toEqual({
        key: ATTACHMENT_KEY,
        name: `Framtal_${twoYearsAgo}.pdf`,
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
        logger,
      )

      expect(addAttachment).not.toHaveBeenCalled()
      expect(result.personalTaxReturn).toBeUndefined()
    })
  })

  describe('logging', () => {
    const SECRET_AGENT_ID = 'secret-agent-id'
    const lastYear = new Date().getFullYear() - 1
    const application = {
      id: APPLICATION_ID,
      applicant: NATIONAL_ID,
    } as ApplicationWithAttachments

    // Mimics an axios error, whose config carries the SOAP body.
    const axiosError = () =>
      Object.assign(new Error('Request failed with status code 401'), {
        code: 'ERR_BAD_REQUEST',
        response: { status: 401 },
        config: {
          data: `<AudkenniUmbodsmanns>${SECRET_AGENT_ID}</AudkenniUmbodsmanns>`,
        },
      })

    const expectNoSecretsLogged = () => {
      const logged = JSON.stringify([
        ...logger.warn.mock.calls,
        ...logger.info.mock.calls,
      ])
      expect(logged).not.toContain(SECRET_AGENT_ID)
    }

    it('warns with a safe summary when direct tax payments fail', async () => {
      await fetchDirectTaxPaymentsFromRsk(
        {
          directTaxPayments: jest.fn().mockRejectedValue(axiosError()),
        } as unknown as RskPersonalTaxReturnApi,
        NATIONAL_ID,
        logger,
        APPLICATION_ID,
      )

      expect(logger.warn).toHaveBeenCalledWith(
        'Could not fetch direct tax payments from RSK',
        {
          applicationId: APPLICATION_ID,
          error: {
            name: 'Error',
            message: 'Request failed with status code 401',
            code: 'ERR_BAD_REQUEST',
            status: 401,
          },
        },
      )
      expectNoSecretsLogged()
    })

    it('logs RSK error text when direct tax payments are unsuccessful', async () => {
      await fetchDirectTaxPaymentsFromRsk(
        {
          directTaxPayments: jest
            .fn()
            .mockResolvedValue({ success: false, errorText: 'Engin gögn' }),
        } as unknown as RskPersonalTaxReturnApi,
        NATIONAL_ID,
        logger,
        APPLICATION_ID,
      )

      expect(logger.info).toHaveBeenCalledWith(
        'RSK returned no direct tax payments',
        { applicationId: APPLICATION_ID, errorText: 'Engin gögn' },
      )
      expect(logger.warn).not.toHaveBeenCalled()
    })

    it('warns for each tax return request that fails', async () => {
      await fetchPersonalTaxReturnFromRsk(
        {
          personalTaxReturnInPdf: jest.fn().mockRejectedValue(axiosError()),
        } as unknown as RskPersonalTaxReturnApi,
        { addAttachment: jest.fn() } as unknown as AttachmentS3Service,
        application,
        NATIONAL_ID,
        logger,
      )

      expect(logger.warn).toHaveBeenCalledTimes(2)
      expect(logger.warn).toHaveBeenNthCalledWith(
        1,
        'Could not fetch tax return from RSK',
        expect.objectContaining({
          applicationId: APPLICATION_ID,
          year: lastYear,
        }),
      )
      expect(logger.warn).toHaveBeenNthCalledWith(
        2,
        'Could not fetch tax return from RSK',
        expect.objectContaining({ year: lastYear - 1 }),
      )
      expectNoSecretsLogged()
    })

    it('logs RSK error text when no tax return exists for a year', async () => {
      await fetchPersonalTaxReturnFromRsk(
        {
          personalTaxReturnInPdf: jest.fn().mockResolvedValue({
            success: false,
            errorText: 'Framtal fannst ekki',
            content: '',
          }),
        } as unknown as RskPersonalTaxReturnApi,
        { addAttachment: jest.fn() } as unknown as AttachmentS3Service,
        application,
        NATIONAL_ID,
        logger,
      )

      expect(logger.info).toHaveBeenCalledWith(
        'RSK returned no tax return for year',
        {
          applicationId: APPLICATION_ID,
          year: lastYear,
          errorText: 'Framtal fannst ekki',
        },
      )
      expect(logger.warn).not.toHaveBeenCalled()
    })

    it('warns and returns no tax return when storing it fails', async () => {
      const result = await fetchPersonalTaxReturnFromRsk(
        {
          personalTaxReturnInPdf: jest.fn().mockResolvedValue({
            success: true,
            errorText: '',
            content: Buffer.from('tax-pdf').toString('base64'),
          }),
        } as unknown as RskPersonalTaxReturnApi,
        {
          addAttachment: jest.fn().mockRejectedValue(
            Object.assign(new Error('Access Denied'), {
              name: 'AccessDenied',
              $metadata: { httpStatusCode: 403 },
            }),
          ),
        } as unknown as AttachmentS3Service,
        application,
        NATIONAL_ID,
        logger,
      )

      expect(result.personalTaxReturn).toBeUndefined()
      expect(logger.warn).toHaveBeenCalledWith(
        'Could not store RSK tax return',
        {
          applicationId: APPLICATION_ID,
          year: lastYear,
          error: {
            name: 'AccessDenied',
            message: 'Access Denied',
            code: undefined,
            status: 403,
          },
        },
      )
    })
  })
})
