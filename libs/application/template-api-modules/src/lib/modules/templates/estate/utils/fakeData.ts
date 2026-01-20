import { ApplicationWithAttachments } from '@island.is/application/types'
import { EstateInfo } from '@island.is/clients/syslumenn'

export const getFakeData = (
  application: ApplicationWithAttachments,
): Array<EstateInfo> => {
  const fakes = [
    getFakeEstateInfo(application, 'Lizzy B. Gone', '0101301234'),
    getFakeEstateInfo(application, 'Johnny Bye Bye', '0101309876'),
    getFakeEstateInfo(application, 'Rita Ingrid Petersen', '0101305555'),
    getFakeEstateInfo(application, 'Devin Godsend', '0101302299'),
  ]

  if (
    application.applicant.startsWith('010130') &&
    application.applicant.endsWith('7789')
  ) {
    fakes.push(getFakeEstateInfo(application, 'Dr. No Errors', '0101304499'))
  }
  return fakes
}

export const getFakeEstateInfo = (
  application: ApplicationWithAttachments,
  nameOfDeceased: string,
  nationalIdOfDeceased: string,
): EstateInfo => {
  const data: EstateInfo = {
    addressOfDeceased: 'Gerviheimili 123, 600 Feneyjar',
    availableSettlements: {
      divisionOfEstateByHeirs: 'Í lagi',
      estateWithoutAssets: 'Í lagi',
      officialDivision: 'Í lagi',
      permitForUndividedEstate: 'Í lagi',
    },
    cash: [],
    moneyAndDeposit: [
      {
        assetNumber: 'MD-2023-001',
        description: 'Peningar í bankahólfi',
        marketValue: '750000',
        share: 100,
      },
    ],
    marriageSettlement: false,
    assets: [
      {
        assetNumber: 'F2318696',
        description: 'Íbúð í Reykjavík',
        share: 100,
      },
      {
        assetNumber: 'F2262202',
        description: 'Raðhús á Akureyri',
        share: 100,
      },
    ],
    vehicles: [
      {
        assetNumber: 'VA334',
        description: 'Nissan Terrano II',
        share: 100,
      },
      {
        assetNumber: 'YZ927',
        description: 'Subaru Forester',
        share: 100,
      },
    ],
    knowledgeOfOtherWills: 'Yes',
    ships: [],
    flyers: [],
    guns: [
      {
        assetNumber: '009-2018-0505',
        description: 'Framhlaðningur (púður)',
        share: 100,
      },
      {
        assetNumber: '007-2018-1380',
        description: 'Mauser P38',
        share: 100,
      },
    ],
    otherAssets: [
      {
        assetNumber: 'HV-2023-001',
        description: 'Hugverkaréttindi',
        marketValue: '500000',
        share: 100,
      },
      {
        assetNumber: 'BS-2023-002',
        description: 'Búseturéttur',
        marketValue: '2000000',
        share: 100,
      },
    ],
    bankAccounts: [
      {
        assetNumber: '0159-26-000001',
        description: 'Bankareikningur',
        marketValue: '1500000',
        share: 100,
      },
    ],
    claims: [],
    stocks: [],
    estateMembers: [
      {
        name: 'Gervimaður Afríka',
        relation: 'Sonur',
        nationalId: '0101303019',
        email: 'fake@email.com',
        phone: '9999999',
      },
      {
        name: 'Gervimaður Færeyjar',
        relation: 'Maki',
        nationalId: '0101302399',
        email: 'fake2@email.com',
        phone: '9999998',
      },
      {
        name: 'Gervimaður Bretland',
        relation: 'Faðir',
        nationalId: '0101304929',
        email: 'fake3@email.com',
        phone: '9999997',
      },
    ],
    caseNumber: `2020-00012${nationalIdOfDeceased.slice(-4)}`,
    dateOfDeath: new Date(Date.now() - 1000 * 3600 * 24 * 100),
    nameOfDeceased,
    nationalIdOfDeceased,
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
    nationalId: '0101303019',
    phone: '',
    email: '',
  }

  if (
    application.applicant.endsWith('7789') &&
    nameOfDeceased !== 'Dr. No Errors'
  ) {
    data.estateMembers.push(fakeChild)

    // I'm just a programmer. I had little direction about what these validation messages might be.
    // This is just fake data.
    data.availableSettlements = {
      divisionOfEstateByHeirs: 'Í lagi',
      estateWithoutAssets:
        'Ríkið hefur áskilið sér þann rétt að hægja á vinnslu þessa dánarbús vegna gruns um skattsviks.',
      permitForUndividedEstate: 'Í lagi',
      officialDivision:
        'Því miður er maki hins látna með punkta á ökuskírteini og stendur í heiftarlegum vanskilum.',
    }
  } else {
    data.estateMembers.push({
      ...fakeChild,
      advocate: fakeAdvocate,
    })
  }
  return data
}
