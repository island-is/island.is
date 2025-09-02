import {
  MockablePaymentCatalogApi,
  InstitutionNationalIds,
} from '@island.is/application/types'

export const MockPaymentCatalog = MockablePaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.FISKISTOFA,
    enableMockPayment: true,
    mockPaymentCatalog: [
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5101',
        chargeItemName: 'Leyfi til veiða í atvinnuskyni - aflamarksleyfi',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5102',
        chargeItemName: 'Leyfi til veiða í atvinnuskyni - krókaflamarksleyfi',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5103',
        chargeItemName: 'Leyfi til dragnótaveiða',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5104',
        chargeItemName: 'Leyfi til frístundaveiða',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5105',
        chargeItemName: 'Leyfi til grásleppuveiða',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5106',
        chargeItemName: 'Leyfi til krabbaveiða',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5107',
        chargeItemName: 'Leyfi til rauðmagaveiða',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5108',
        chargeItemName: 'Leyfi til strandveiða',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5109',
        chargeItemName: 'Leyfi til veiða á beitikóng',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5110',
        chargeItemName: 'Leyfi til veiða á kúfskel',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5111',
        chargeItemName:
          'Leyfi til veiða á norðuríshafsþorski í norskri lögsögu',
        priceAmount: 22000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5112',
        chargeItemName: 'Sérstakt gjald vegna strandleyfa',
        priceAmount: 50000,
      },
      {
        performingOrgID: InstitutionNationalIds.FISKISTOFA,
        chargeType: 'L51',
        chargeItemCode: 'L5113',
        chargeItemName: 'Leyfi til veiða í atvinnuskyni - ígulkerveiðileyfi',
        priceAmount: 22000,
      },
    ],
  },
  externalDataId: 'feeInfoProvider',
})
