import {
  FAApplication,
  TaxData,
} from '@island.is/application/templates/financial-aid'
import { ApplicationWithAttachments } from '@island.is/application/types'
import type { FilesApi } from '@island.is/clients/municipalities-financial-aid'
import type { Logger } from '@island.is/logging'
import { AttachmentS3Service } from '../../shared/services'
import {
  copyTaxReturnToApplicationAttachments,
  padPayerNationalIds,
} from './veitaTaxData'

const APPLICANT_ID = '0101302399'
const SPOUSE_ID = '0202302399'
const APPLICATION_ID = 'application-id'

const application = {
  id: APPLICATION_ID,
  applicant: APPLICANT_ID,
} as unknown as FAApplication & ApplicationWithAttachments

const backendTaxReturn = (nationalId: string) =>
  ({
    personalTaxReturn: {
      key: `${APPLICATION_ID}/Framtal_${nationalId}_2025.pdf`,
      name: `Framtal_${nationalId}_2025.pdf`,
      size: 10,
    },
  } as TaxData['municipalitiesPersonalTaxReturn'])

describe('padPayerNationalIds', () => {
  it('pads a payer national id that lost its leading zero', () => {
    const result = padPayerNationalIds({
      success: true,
      directTaxPayments: [
        { payerNationalId: '501234567' },
        { payerNationalId: '5012345678' },
      ],
    } as TaxData['municipalitiesDirectTaxPayments'])

    expect(
      result.directTaxPayments.map((payment) => payment.payerNationalId),
    ).toEqual(['0501234567', '5012345678'])
    expect(result.success).toBe(true)
  })

  it('returns an empty list when there are no payments', () => {
    const result = padPayerNationalIds({
      success: false,
    } as TaxData['municipalitiesDirectTaxPayments'])

    expect(result.directTaxPayments).toEqual([])
  })
})

describe('copyTaxReturnToApplicationAttachments', () => {
  const fileControllerCreateSignedUrl = jest.fn()
  const addAttachment = jest.fn()
  const warn = jest.fn()
  const fetchSpy = jest.spyOn(global, 'fetch')

  const copy = (
    taxReturn: TaxData['municipalitiesPersonalTaxReturn'],
    nationalId: string,
  ) =>
    copyTaxReturnToApplicationAttachments({
      taxReturn,
      filesApi: { fileControllerCreateSignedUrl } as unknown as FilesApi,
      attachmentService: { addAttachment } as unknown as AttachmentS3Service,
      application,
      nationalId,
      logger: { warn } as unknown as Logger,
    })

  beforeEach(() => {
    jest.clearAllMocks()
    fileControllerCreateSignedUrl.mockResolvedValue({
      url: 'https://files.example/signed',
      key: 'unused',
    })
    addAttachment.mockResolvedValue('attachment-key')
    fetchSpy.mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('pdf').buffer,
    } as Response)
  })

  afterAll(() => fetchSpy.mockRestore())

  it('copies the applicant tax return without the national id in the name', async () => {
    const result = await copy(backendTaxReturn(APPLICANT_ID), APPLICANT_ID)

    expect(fileControllerCreateSignedUrl).toHaveBeenCalledWith({
      getSignedUrlDto: {
        folder: APPLICATION_ID,
        fileName: `Framtal_${APPLICANT_ID}_2025.pdf`,
      },
    })
    expect(addAttachment).toHaveBeenCalledWith(
      application,
      'Framtal_2025.pdf',
      Buffer.from('pdf'),
      { ContentType: 'application/pdf' },
    )
    expect(result).toEqual({
      personalTaxReturn: {
        key: 'attachment-key',
        name: 'Framtal_2025.pdf',
        size: 3,
      },
    })
  })

  it('names the spouse tax return differently from the applicant', async () => {
    const result = await copy(backendTaxReturn(SPOUSE_ID), SPOUSE_ID)

    expect(result.personalTaxReturn?.name).toBe('Framtal_maki_2025.pdf')
  })

  it('returns no tax return when the backend has none', async () => {
    const result = await copy(
      {} as TaxData['municipalitiesPersonalTaxReturn'],
      APPLICANT_ID,
    )

    expect(result.personalTaxReturn).toBeNull()
    expect(fileControllerCreateSignedUrl).not.toHaveBeenCalled()
  })

  it('returns no tax return and logs when the download fails', async () => {
    fetchSpy.mockResolvedValue({ ok: false, status: 403 } as Response)

    const result = await copy(backendTaxReturn(APPLICANT_ID), APPLICANT_ID)

    expect(result.personalTaxReturn).toBeNull()
    expect(addAttachment).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith(
      'Could not copy tax return to application attachments',
      {
        applicationId: APPLICATION_ID,
        error: 'Download failed with status 403',
      },
    )
  })
})
