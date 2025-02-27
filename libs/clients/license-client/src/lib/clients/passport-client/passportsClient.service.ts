import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { LicenseClient, LicenseType, Result } from '../../licenseClient.type'
import { FetchError } from '@island.is/clients/middlewares'
import {
  IdentityDocument,
  IdentityDocumentChild,
  PassportsService,
} from '@island.is/clients/passports'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class PassportsClient implements LicenseClient<LicenseType.Passport> {
  constructor(
    private passportService: PassportsService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  clientSupportsPkPass = false
  type = LicenseType.Passport

  async getLicenses(
    user: User,
  ): Promise<Result<Array<IdentityDocument | IdentityDocumentChild>>> {
    return Promise.resolve({
      ok: true,
      data: [
        {
          number: '3196492',
          type: 'P',
          subType: 'A',
          verboseType: 'Vegabréf: Almennt',
          status: 'ISSUED',
          issuingDate: new Date('2016-04-22T00:00:00'),
          expirationDate: new Date('2026-04-22T00:00:00'),
          displayFirstName: 'Bína ÞÍ',
          displayLastName: 'Forsjá',
          mrzFirstName: 'Biihna THII',
          mrzLastName: 'Fohrsjaa',
          sex: 'F',
          numberWithType: 'A3196492',
        },
        {
          childNationalId: '2222222222',
          secondParent: '8888888888',
          secondParentName: 'Baddi ÞÍ Forsjá',
          childName: 'Stuttla ÞÍ Baddadóttir',
          passports: [
            {
              number: '2222222',
              type: 'P',
              subType: 'A',
              verboseType: 'Vegabréf: Almennt',
              status: 'ISSUED',
              issuingDate: new Date('2017-04-22T00:00:00'),
              expirationDate: new Date('2027-04-22T00:00:00'),
              mrzFirstName: 'Stjuttla THII',
              mrzLastName: 'Bjaddadootir',
              displayFirstName: 'Stuttla ÞÍ',
              displayLastName: 'Baddadótir',
            },
          ],
          citizenship: {
            kodi: '1',
            land: 'IS',
          },
        },
        {
          childNationalId: '444444444',
          secondParent: '8888888888',
          secondParentName: 'Baddi ÞÍ Forsjá',
          childName: 'Stuttla ÞÍ Baddadóttir',
          passports: [
            {
              number: '444444444',
              type: 'P',
              subType: 'A',
              verboseType: 'Vegabréf: Almennt',
              status: 'valid',
              issuingDate: new Date('2017-04-22T00:00:00'),
              expirationDate: new Date('2025-03-22T00:00:00'),
              mrzFirstName: 'Smaathur',
              mrzLastName: 'Baddason',
              displayFirstName: 'Smáður',
              displayLastName: 'Baddason',
              expiresWithinNoticeTime: true,
            },
          ],
          citizenship: {
            kodi: '1',
            land: 'IS',
          },
        },
        {
          childNationalId: '5555555555',
          secondParent: '8888888888',
          secondParentName: 'Bína ÞÍ Forsjá',
          childName: 'Lórenzía ÞÍ Bínudóttir',
          passports: [
            {
              number: '5555555555',
              type: 'P',
              subType: 'A',
              verboseType: 'Vegabréf: Almennt',
              status: 'INVALID',
              issuingDate: new Date('2017-04-22T00:00:00'),
              expirationDate: new Date('2023-03-22T00:00:00'),
              mrzFirstName: 'Biina THI',
              mrzLastName: 'Biinudoottir',
              displayFirstName: 'Bína ÞÍ',
              displayLastName: 'Bínudóttir',
              expiryStatus: 'EXPIRED',
            },
          ],
          citizenship: {
            kodi: '1',
            land: 'IS',
          },
        },
        {
          childNationalId: '3333333333',
          secondParent: '8888888888',
          secondParentName: 'Baddi ÞÍ Forsjá',
          childName: 'Lægða ÞÍ Baddadóttir',
          passports: [],
          citizenship: {
            kodi: '1',
            land: 'IS',
          },
        },
      ],
    })

    /*try {
      const { userPassport, childPassports } =
        await this.passportService.getCurrentPassport(user)

      let passports: Array<IdentityDocument | IdentityDocumentChild> = [
        userPassport,
      ].filter(isDefined)

      if (childPassports) {
        passports = [...passports, ...childPassports]
      }
      return {
        ok: true,
        data: passports.filter(isDefined),
      }
    } catch (e) {
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        if (e.status === 404) {
          return {
            ok: true,
            data: [],
          }
        } else {
          error = {
            code: 13,
            message: 'Service failure',
            data: JSON.stringify(e.body),
          }
        }
      } else {
        const unknownError = e as Error
        error = {
          code: 99,
          message: 'Unknown error',
          data: JSON.stringify(unknownError),
        }
      }

      return {
        ok: false,
        error,
      }
      }*/
  }
}
