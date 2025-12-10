import {
  DebtTypes,
  InheritanceEstateMember,
  InheritanceReportAsset,
  InheritanceReportInfo,
} from '@island.is/clients/syslumenn'
const generateRandomAsset = (n: number, i = 1): InheritanceReportAsset => {
  const lookup = [
    'Fasteign',
    'Ökutæki',
    'Skip',
    'Lausafé',
    'Loftfar',
    'Önnur Eign',
    'Hlutabréf',
    'Innistæða í banka',
    'Peningar eða Bankahólf',
    'Skotvopn',
    'Verðbréf eða Krafa',
    'Útfararkostnaður',
    'Opinbert Gjald',
    'Önnur skuld',
    'Eign í atvinnurekstri',
    'Skuld í atvinnurekstri',
  ]

  return {
    share: Math.round(Math.random() * 100),
    assetNumber: String(100000 + Math.round(Math.random() * 899999)),
    description: `${lookup[n]}-${i}`,
    propertyValuation: String(
      1_000_000 + Math.round(Math.random() * 9_000_000),
    ),
    amount: String(1_000_000 + Math.round(Math.random() * 9_000_000)),
    exchangeRateOrInterest: String(1 + Math.round(Math.random() * 99)),
    debtType: [
      DebtTypes.CreditCard,
      DebtTypes.Duties,
      DebtTypes.Loan,
      DebtTypes.InsuranceCompany,
      DebtTypes.Overdraft,
      DebtTypes.PropertyFees,
    ].sort(() => 0.5 - Math.random())[0],
  }
}

const generateRandomHeir = (
  name: string,
  nationalId: string,
  advocate = false,
): InheritanceEstateMember => {
  return {
    name,
    nationalId,
    relation: ['Bróðir', 'Systir', 'Móðir', 'Faðir'].sort(
      () => 0.5 - Math.random(),
    )[0],
    address: 'Gervibýli 5, 201 Kópavogur',
    ...(advocate
      ? {
          advocate: {
            name: 'Maggi Málsvari',
            nationalId: '0101303019',
            address: 'Málsvaratröð 14, 300 Akranes',
            email: 'maggi@malsvari.co.uk',
            phone: '9999999',
          },
        }
      : {}),
    email: name.split(' ').at(-1) + '@gervimadur.com',
    phone: '9999999',
    enabled: true,
    relationWithApplicant: ['Bróðir', 'Systir', 'Móðir', 'Faðir'].sort(
      () => 0.5 - Math.random(),
    )[0],
  }
}

export const getFakeData = (
  caseNumber: string,
  nameOfDeceased: string,
  nationalId: string,
): InheritanceReportInfo => {
  const assetProperties = [
    'assets',
    'vehicles',
    'ships',
    'cash',
    'flyers',
    'otherAssets',
    'stocks',
    'bankAccounts',
    'depositsAndMoney',
    'guns',
    'sharesAndClaims',
    'funeralCosts',
    'officialFees',
    'otherDebts',
    'assetsInBusiness',
    'debtsInBusiness',
  ]
  const assetStructure: Record<string, InheritanceReportAsset[]> = {}

  assetProperties.forEach((k, i) => {
    assetStructure[k] = [generateRandomAsset(i), generateRandomAsset(i, 2)]
    if (k === 'assets') {
      assetStructure[k].forEach(
        (asset) => (asset.assetNumber = 'L' + asset.assetNumber),
      )
    } else if (k === 'vehicles') {
      assetStructure[k][0].assetNumber = 'JOL25'
      assetStructure[k][1].assetNumber = 'YZ927'
    } else if (k === 'bankAccounts') {
      assetStructure[k].forEach((asset) => {
        asset.assetNumber =
          String(8999 + Math.round(Math.random() * 1000)) + '-12-345678'
      })
    }
  })

  // This code is only used in local or dev environments since
  // a 'gervimaður' can not log in on prod.
  return {
    caseNumber,
    nameOfDeceased,
    nationalId,
    addressOfDeceased: 'Dánarbúsvegur 31, 200 Kópavogur',
    dateOfDeath: new Date(),
    will: '',
    knowledgeOfOtherWill: false,
    settlement: false,
    heirs: [
      generateRandomHeir('Gervimaður Afríka', '0101303019'),
      generateRandomHeir('Gervimaður Bretland', '0101304929'),
      generateRandomHeir('Ísak Miri ÞÍ Jarrah', '2409151460', true),
    ],
    ...assetStructure,
  } as unknown as InheritanceReportInfo
}
