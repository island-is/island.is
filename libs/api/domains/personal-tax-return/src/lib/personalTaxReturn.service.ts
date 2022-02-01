import { Injectable } from '@nestjs/common'
import { Base64 } from 'js-base64'
import { PersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'

@Injectable()
export class PersonalTaxReturnService {
  constructor(private personalTaxReturnApi: PersonalTaxReturnApi) {}

  async personalTaxReturnPdf(
    nationalId: string,
    year: string,
    uploadUrl: string,
    folder: string,
  ) {
    const taxReturn = await this.personalTaxReturnApi.personalTaxReturnInPdf(
      nationalId,
      year,
    )

    console.log('taxReturn success', taxReturn.success)
    console.log('taxReturn error text', taxReturn.errorText)

    const base64 = Base64.atob(taxReturn.content)

    await fetch(uploadUrl, {
      method: 'PUT',
      body: Buffer.from(base64, 'binary'),
      headers: {
        'x-amz-acl': 'bucket-owner-full-control',
        'Content-Type': 'application/pdf',
        'Content-Length': base64.length.toString(),
      },
    })

    return taxReturn.content
  }
}
