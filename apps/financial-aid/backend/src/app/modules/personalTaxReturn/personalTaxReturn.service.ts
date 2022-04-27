import { Injectable } from '@nestjs/common'
import { Base64 } from 'js-base64'
import { PersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'
import { FileService } from '../file'
import fetch from 'isomorphic-fetch'

@Injectable()
export class PersonalTaxReturnService {
  constructor(
    private personalTaxReturnApi: PersonalTaxReturnApi,
    private fileService: FileService,
  ) {}

  async directTaxPayments(nationalId: string) {
    return await this.personalTaxReturnApi
      .directTaxPayments(nationalId, this.createPeriod(3), this.createPeriod(1))
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
        }
      })
      .catch(() => {
        return {
          directTaxPayments: [],
          success: false,
        }
      })
  }

  async personalTaxReturn(nationalId: string, folder?: string) {
    try {
      let changeableYear = new Date().getFullYear() - 1

      let taxReturn = await this.personalTaxReturnApi
        .personalTaxReturnInPdf(nationalId, changeableYear)
        .catch(() => {
          return {
            success: false,
            content: '',
          }
        })

      if (taxReturn.success === false) {
        changeableYear -= 1
        taxReturn = await this.personalTaxReturnApi
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

      const presignedUrl = this.fileService.createSignedUrl(folder, fileName)

      const base64 = Base64.atob(taxReturn.content)
      const size = base64.length

      await fetch(presignedUrl.url, {
        method: 'PUT',
        body: Buffer.from(base64, 'binary'),
        headers: {
          'x-amz-acl': 'bucket-owner-full-control',
          'Content-Type': 'application/pdf',
          'Content-Length': size.toString(),
        },
      })

      return {
        personalTaxReturn: { key: presignedUrl.key, name: fileName, size },
      }
    } catch {
      return undefined
    }
  }

  private createPeriod(pastMonth: number) {
    const date = new Date()
    date.setMonth(date.getMonth() - pastMonth)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    }
  }
}
