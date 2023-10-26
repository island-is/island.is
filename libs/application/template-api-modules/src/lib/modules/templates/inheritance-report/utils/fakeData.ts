import { EstateInfo } from '@island.is/clients/syslumenn'

export const getFakeData = (): EstateInfo => {
  return {
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
        name: 'Stúfur Mack',
        relation: 'Sonur',
        nationalId: '2222222229',
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
    caseNumber: '011515',
    dateOfDeath: new Date(Date.now() - 1000 * 3600 * 24 * 100),
    nameOfDeceased: 'Lizzy B. Gone',
    nationalIdOfDeceased: '0101301234',
    districtCommissionerHasWill: true,
  }
}
