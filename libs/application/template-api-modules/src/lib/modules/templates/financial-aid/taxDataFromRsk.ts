import {
  getFinancialAidRouting,
  TaxData,
} from '@island.is/application/templates/financial-aid'
import {
  ApplicationWithAttachments,
  ExternalData,
} from '@island.is/application/types'
import type { PersonalTaxReturnApi as RskPersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'
import type { Logger } from '@island.is/logging'
import { AttachmentS3Service } from '../../shared/services'

export const shouldFetchTaxDataFromRsk = (externalData: ExternalData) =>
  getFinancialAidRouting(externalData).backend === 'veita'

// RSK errors are axios errors whose config carries the SOAP body, including
// the agent credentials, so only safe fields are logged. National ids are
// masked by the logger.
const describeError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return { message: String(error) }
  }
  const { code, response, $metadata } = error as Error & {
    code?: string
    response?: { status?: number }
    $metadata?: { httpStatusCode?: number }
  }
  return {
    name: error.name,
    message: error.message,
    code,
    status: response?.status ?? $metadata?.httpStatusCode,
  }
}

// RSK responses are parsed with xml2js parseNumbers, so a kennitala starting
// with a zero arrives as a 9 digit number.
const formatPayerNationalId = (payerNationalId: number | string | undefined) =>
  payerNationalId == null ? '' : String(payerNationalId).padStart(10, '0')

const createPeriod = (pastMonth: number) => {
  const date = new Date()
  // Normalize to the 1st so shorter target months don't roll the date forward
  date.setDate(1)
  date.setMonth(date.getMonth() - pastMonth)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  }
}

export const fetchDirectTaxPaymentsFromRsk = async (
  rskApi: RskPersonalTaxReturnApi,
  nationalId: string,
  logger: Logger,
  applicationId: string,
): Promise<TaxData['municipalitiesDirectTaxPayments']> => {
  return rskApi
    .directTaxPayments(nationalId, createPeriod(3), createPeriod(1))
    .then((res) => {
      if (!res.success) {
        logger.info('RSK returned no direct tax payments', {
          applicationId,
          errorText: res.errorText,
        })
      }
      return {
        directTaxPayments: res.salaryBreakdown
          ? res.salaryBreakdown.map((salary) => {
              return {
                totalSalary: salary.salaryTotal,
                payerNationalId: formatPayerNationalId(salary.payerNationalId),
                personalAllowance: salary.personalAllowance,
                withheldAtSource: salary.salaryWithheldAtSource,
                month: salary.period,
                year: salary.year,
              }
            })
          : [],
        success: res.success,
      } as TaxData['municipalitiesDirectTaxPayments']
    })
    .catch((error: unknown) => {
      logger.warn('Could not fetch direct tax payments from RSK', {
        applicationId,
        error: describeError(error),
      })
      return {
        directTaxPayments: [],
        success: false,
      }
    })
}

export const fetchPersonalTaxReturnFromRsk = async (
  rskApi: RskPersonalTaxReturnApi,
  attachmentService: AttachmentS3Service,
  application: ApplicationWithAttachments,
  nationalId: string,
  logger: Logger,
): Promise<TaxData['municipalitiesPersonalTaxReturn']> => {
  const applicationId = application.id
  const unavailable = {
    personalTaxReturn: undefined,
  } as unknown as TaxData['municipalitiesPersonalTaxReturn']

  const fetchYear = async (year: number) => {
    try {
      const taxReturn = await rskApi.personalTaxReturnInPdf(nationalId, year)
      if (!taxReturn.success) {
        logger.info('RSK returned no tax return for year', {
          applicationId,
          year,
          errorText: taxReturn.errorText,
        })
      }
      return taxReturn
    } catch (error) {
      logger.warn('Could not fetch tax return from RSK', {
        applicationId,
        year,
        error: describeError(error),
      })
      return { success: false, errorText: '', content: '' }
    }
  }

  let changeableYear = new Date().getFullYear() - 1
  let taxReturn = await fetchYear(changeableYear)
  if (!taxReturn.success) {
    changeableYear -= 1
    taxReturn = await fetchYear(changeableYear)
  }
  if (!taxReturn.success) {
    return unavailable
  }

  try {
    // Kept free of the national id, which would otherwise end up in the S3
    // key, presigned URLs and access logs.
    const isSpouse = nationalId !== application.applicant
    const fileName = isSpouse
      ? `Framtal_maki_${changeableYear}.pdf`
      : `Framtal_${changeableYear}.pdf`
    const buffer = Buffer.from(taxReturn.content, 'base64')

    const key = await attachmentService.addAttachment(
      application,
      fileName,
      buffer,
      { ContentType: 'application/pdf' },
    )

    return {
      personalTaxReturn: { key, name: fileName, size: buffer.length },
    }
  } catch (error) {
    logger.warn('Could not store RSK tax return', {
      applicationId,
      year: changeableYear,
      error: describeError(error),
    })
    return unavailable
  }
}
