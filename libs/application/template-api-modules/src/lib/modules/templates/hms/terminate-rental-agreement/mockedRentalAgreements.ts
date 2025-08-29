import { Contract } from '@island.is/clients/hms-rental-agreement'

export const mockGetRentalAgreements = (): Array<Contract> => {
  return [
    {
      dateFrom: '2025-08-01',
      indexType: 'Ekki vísitölubundinn',
      baseAmount: 100000,
      contractId: 40440,
      contractRef: 'e1b7ce8f-fd83-4651-9b1d-22667656e32b',
      contractType: 'Ótímabundinn samningur',
      currencyCode: 'ISK',
      receivedDate: '2025-07-10',
      contractParty: [
        {
          name: 'Gervimaður Grænland',
          town: 'null',
          email: 'addi@kolibri.is',
          country: 'IS',
          address1: 'Grænland',
          kennitala: '0101302639',
          postalCode: 0,
          phoneNumber: '0102639',
          partyTypeName: 'Leigjandi',
          contractPartyId: 85392,
          partyTypeUseCode: 'TENANT',
        },
        {
          name: 'Gervimaður Færeyjar',
          town: 'null',
          email: 'addininja@gmail.com',
          country: 'IS',
          address1: 'Færeyjar',
          kennitala: '0101302399',
          postalCode: 0,
          phoneNumber: '0102399',
          partyTypeName: 'Leigusali',
          contractPartyId: 85391,
          partyTypeUseCode: 'OWNER',
        },
      ],
      lastChangedOn: '2025-07-10',
      signatureDate: '2025-07-10',
      contractStatus: 'STATUSVALID',
      indexIntervalM: 104,
      contractProperty: [
        {
          floor: 1,
          areaM2: 78.3,
          apartment: 1,
          noOfRooms: 3,
          postalCode: 105,
          propertyId: 2011202,
          specialType:
            'Íbúðarhúsnæði mað að lágmarki einu svefnherbergi ásamt séreldhúsi eða séreldunaraðstöðu, sérsnyrtingu og baðaðstöðu',
          municipality: 'Reykjavíkurborg',
          appraisalUnitId: 2011202,
          specialTypeCode: 'TM_SPECIAL_TYPE_RESIDENTAL_PREMISE',
          contractPropertyId: 38321,
          specialGroupUseCode: 'SPECIALGROUP_OTHER',
          contractPropertyDesc: 'adsf',
          streetAndHouseNumber: 'Flókagata 9 ',
        },
      ],
      indexTypeUseCode: 'INDEXZERO',
      contractCollateral: [
        {
          currencyCode: 'ISK',
          collateralType: 'Engin trygging',
          collateralAmount: 0,
          contractCollateralId: 20239,
          collateralTypeUseCode: 'COLLATERAL_ZERO',
        },
      ],
      contractTypeUseCode: 'INDEFINETEAGREEMENT',
    },
  ]
}
