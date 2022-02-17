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

  private async callPersonalTaxReturn(nationalId: string, year: number) {
    return await this.personalTaxReturnApi
      .personalTaxReturnInPdf(nationalId, year)
      .catch(() => {
        return { success: false, content: '' }
      })
  }

  async directTaxPayments(nationalId: string) {
    const directTaxPayments = await this.personalTaxReturnApi.directTaxPayments(
      nationalId,
      this.createPeriod(3),
      this.createPeriod(1),
    )

    return {
      directTaxPayments: directTaxPayments.salaryBreakdown.map((salary) => {
        return {
          totalSalary: salary.salaryTotal,
          payerNationalId: salary.payerNationalId,
          personalAllowance: salary.personalAllowance,
          withheldAtSource: salary.salaryWithheldAtSource,
          month: salary.period,
        }
      }),
      success: directTaxPayments.success,
    }
  }

  async personalTaxReturn(nationalId: string, folder: string) {
    let year = new Date().getFullYear() - 1

    let taxReturn = await this.callPersonalTaxReturn(nationalId, year)

    if (taxReturn.success === false) {
      year -= 1
      taxReturn = await this.callPersonalTaxReturn(nationalId, year)
    }

    if (taxReturn.success === false) {
      return undefined
    }

    const fileName = `Framtal_${nationalId}_${year}.pdf`

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
    }).catch(() => {
      return undefined
    })

    return { key: presignedUrl.key, name: fileName, size }
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
