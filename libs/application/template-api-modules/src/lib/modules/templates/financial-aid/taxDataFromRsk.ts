import {
  isRvkMunicipalityCode,
  TaxData,
} from '@island.is/application/templates/financial-aid'
import { ApplicationWithAttachments } from '@island.is/application/types'
import type { PersonalTaxReturnApi as RskPersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'
import { AttachmentS3Service } from '../../shared/services'

export const shouldFetchTaxDataFromRsk = isRvkMunicipalityCode

const createPeriod = (pastMonth: number) => {
  const date = new Date()
  date.setMonth(date.getMonth() - pastMonth)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  }
}

export const fetchDirectTaxPaymentsFromRsk = async (
  rskApi: RskPersonalTaxReturnApi,
  nationalId: string,
): Promise<TaxData['municipalitiesDirectTaxPayments']> => {
  return rskApi
    .directTaxPayments(nationalId, createPeriod(3), createPeriod(1))
    .then((res) => {
      return {
        directTaxPayments: res.salaryBreakdown
          ? res.salaryBreakdown.map((salary) => {
              return {
                totalSalary: salary.salaryTotal,
                payerNationalId: salary.payerNationalId.toString(),
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
    .catch(() => {
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
): Promise<TaxData['municipalitiesPersonalTaxReturn']> => {
  try {
    let changeableYear = new Date().getFullYear() - 1

    let taxReturn = await rskApi
      .personalTaxReturnInPdf(nationalId, changeableYear)
      .catch(() => {
        return {
          success: false,
          content: '',
        }
      })
    if (taxReturn.success === false) {
      changeableYear -= 1
      taxReturn = await rskApi
        .personalTaxReturnInPdf(nationalId, changeableYear)
        .catch(() => {
          return {
            success: false,
            content: '',
          }
        })
    }
    if (taxReturn.success === false) {
      throw Error('Tax return was not successful')
    }

    const fileName = `Framtal_${nationalId}_${changeableYear}.pdf`
    const buffer = Buffer.from(taxReturn.content, 'base64')
    const size = buffer.length

    const key = await attachmentService.addAttachment(
      application,
      fileName,
      buffer,
      { ContentType: 'application/pdf' },
    )

    return {
      personalTaxReturn: { key, name: fileName, size },
    }
  } catch {
    return {
      personalTaxReturn: undefined,
    } as unknown as TaxData['municipalitiesPersonalTaxReturn']
  }
}
