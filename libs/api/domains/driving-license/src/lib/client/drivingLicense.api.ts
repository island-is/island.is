import { User } from '@island.is/auth-nest-tools'

import { DrivingLicenseResponse } from './types'

export class DrivingLicenseApi {
  constructor(private readonly baseApiUrl: string) {}

  async getDrivingLicense(
    nationalId: User['nationalId'],
  ): Promise<DrivingLicenseResponse> {
    const drivingLicense: DrivingLicenseResponse = await {
      id: 1337,
      nafn: 'Jón Ekki Til Jónsson ',
      kennitala: '1234567890',
      faedingarstadur: '8000',
      faedingarStadurHeiti: 'Ísland',
      utgafuDagsetning: '2013-05-28T00:00:00',
      gildirTil: '2045-11-06T23:59:59',
      nrUtgafustadur: 37,
      nafnUtgafustadur: 'Sýslumaðurinn á höfuðborgarsvæðinu - Kópavogi',
      rettindi: [
        {
          id: 1337,
          nr: 'A',
          utgafuDags: '2010-08-30T00:00:00',
          gildirTil: '2045-11-06T00:00:00',
          aths: '',
        },
        {
          id: 1337,
          nr: 'B',
          utgafuDags: '1993-07-26T00:00:00',
          gildirTil: '2045-11-06T00:00:00',
          aths: '',
        },
      ],
      athugasemdir: [{ id: 1337, nr: '71', athugasemd: '1' }],
      mynd: {
        id: -1,
        kennitala: '1234567890',
        skrad: '1996-10-28T00:00:00',
        mynd: '',
        gaedi: 0,
        forrit: 5,
        tegund: 1,
      },
      undirskrift: null,
      svipting: {
        dagsFra: null,
        dagsTil: null,
        skirteiniGlatad: null,
        tegundSviptingarHeiti: null,
        tegundSviptingar: null,
        skirteiniUrGildi: null,
        endurupptakaSkirteinis: null,
      },
    }
    return drivingLicense
  }
}
