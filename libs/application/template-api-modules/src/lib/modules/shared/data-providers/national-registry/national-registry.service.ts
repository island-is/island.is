import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../..'
import { TemplateApiModuleActionProps } from '../../../../types'
@Injectable()
export class NationalRegistryService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async nationalRegistry({ application, auth }: TemplateApiModuleActionProps) {
    //application.externalData.data.reference
    //random number
    const randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000
    return {
      nationalId: auth.nationalId,
      name: 'Justin Trudeau ' + randomNumber,
      age: '42',
      address: '123 Fake St',
      phone: '123-456-7890',
      city: 'Toronto',
    }
  }

  /*
       query NationalRegistryUserQuery {
        nationalRegistryUser {
          nationalId
          age
          fullName
          citizenship {
            code
            name
          }
          legalResidence
          address {
            code
            postalCode
            city
            streetAddress
            lastUpdated
          }
        }
      }
    `*/
}
