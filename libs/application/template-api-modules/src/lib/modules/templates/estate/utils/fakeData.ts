import { ApplicationWithAttachments } from '@island.is/application/types'
import { EstateInfo } from '@island.is/clients/syslumenn'

export const getFakeData = (
  application: ApplicationWithAttachments,
): EstateInfo => {
  const data: EstateInfo = {
    addressOfDeceased: 'Gerviheimili 123, 600 Feneyjar',
    cash: [],
    marriageSettlement: false,
    assets: [
      {
        assetNumber: 'F2318696',
        description: 'Íbúð í Reykjavík',
        share: 1,
      },
      {
        assetNumber: 'F2262202',
        description: 'Raðhús á Akureyri',
        share: 1,
      },
    ],
    vehicles: [
      {
        assetNumber: 'VA334',
        description: 'Nissan Terrano II',
        share: 1,
      },
      {
        assetNumber: 'YZ927',
        description: 'Subaru Forester',
        share: 1,
      },
    ],
    knowledgeOfOtherWills: 'Yes',
    ships: [],
    flyers: [],
    guns: [
      {
        assetNumber: '009-2018-0505',
        description: 'Framhlaðningur (púður)',
        share: 1,
      },
      {
        assetNumber: '007-2018-1380',
        description: 'Mauser P38',
        share: 1,
      },
    ],
    estateMembers: [
      {
        name: 'Gervimaður Afríka',
        relation: 'Sonur',
        nationalId: '0101303019',
      },
      {
        name: 'Gervimaður Færeyja',
        relation: 'Maki',
        nationalId: '0101302399',
      },
      {
        name: 'Gervimaður Bretland',
        relation: 'Faðir',
        nationalId: '0101304929',
      },
    ],
    caseNumber: '2020-000123',
    dateOfDeath: new Date(Date.now() - 1000 * 3600 * 24 * 100),
    nameOfDeceased: 'Lizzy B. Gone',
    nationalIdOfDeceased: '0101301234',
    districtCommissionerHasWill: true,
  }

  const fakeAdvocate = {
    name: 'Gervimaður Evrópa',
    address: 'Gerviheimili 123, 600 Feneyjar',
    nationalId: '0101302719',
    email: '',
    phone: '',
  }

  const fakeChild = {
    name: 'Gervimaður Undir 18 án málsvara',
    relation: 'Barn',
    // This kennitala is for Gervimaður Ísak Miri ÞÍ Jarrah
    // This test will stop serving its purpose on the 24th of September 2034
    // eslint-disable-next-line local-rules/disallow-kennitalas
    nationalId: '2409151460',
    phone: '',
    email: '',
  }

  if (application.applicant.endsWith('7789')) {
    data.estateMembers.push(fakeChild)
  } else {
    data.estateMembers.push({
      ...fakeChild,
      advocate: fakeAdvocate,
    })
  }
  return data
}
