import {
  PrescribedItemDto,
  PrescribedItemDtoRenewalBlockedReasonEnum,
  PrescribedItemDtoRenewalStatusEnum,
  ReferralDto,
  WaitingListEntryDto,
} from '../gen/fetch/models'

export const prescriptions: PrescribedItemDto[] = [
  {
    prescribedItemId: 2,
    prescriptionId: 2,
    prescriberId: '2',
    prescriberName: 'Dr. Jane Smith' as unknown as object,
    issueDate: new Date('2023-02-01'),
    expiryDate: new Date('2023-11-30'),
    productId: '2',
    productName: 'Ibuprofen' as unknown as object,
    productType: 'Capsule' as unknown as object,
    productForm: 'Oral' as unknown as object,
    productUrl: 'http://example.com/product/2' as unknown as object,
    productStrength: '200mg' as unknown as object,
    productQuantity: '20' as unknown as object,
    dosageInstructions: 'Take one capsule every 8 hours' as unknown as object,
    indication: 'Inflammation' as unknown as object,
    totalPrescribedAmount: '20' as unknown as object,
    totalPrescribedAmountDisplay: '20 capsules' as unknown as object,
    isRegiment: false as unknown as object,
    isRenewable: true,
    renewalBlockedReason: PrescribedItemDtoRenewalBlockedReasonEnum.IsRegiment,
    renewalStatus: PrescribedItemDtoRenewalStatusEnum.NUMBER_0,
    amountRemaining: 15,
    amountRemainingUnit: 'capsules',
    amountRemainingDisplay: '15 capsules',
    percentageRemaining: 75,
    isFullyDispensed: false,
    dispensations: [
      {
        id: 3,
        dispensingAgentId: 2,
        dispensingAgentName: 'Pharmacy B',
        dispensationDate: new Date(),
        dispensedItemsCount: 5,
        dispensedItems: [
          {
            productId: '2',
            productName: 'Ibuprofen' as unknown as object,
            productStrength: '200mg' as unknown as object,
            dispensedAmount: '5' as unknown as object,
            dispensedAmountDisplay: '5 capsules' as unknown as object,
            numberOfPackages: '1' as unknown as object,
          },
        ],
      },
    ],
  },
  {
    prescribedItemId: 3,
    prescriptionId: 3,
    prescriberId: '3',
    prescriberName: 'Dr. Emily Johnson' as unknown as object,
    issueDate: new Date('2023-03-01'),
    expiryDate: new Date('2023-10-31'),
    productId: '3',
    productName: 'Amoxicillin' as unknown as object,
    productType: 'Tablet' as unknown as object,
    productForm: 'Oral' as unknown as object,
    productUrl: 'http://example.com/product/3' as unknown as object,
    productStrength: '500mg' as unknown as object,
    productQuantity: '40' as unknown as object,
    dosageInstructions: 'Take one tablet every 12 hours' as unknown as object,
    indication: 'Bacterial infection' as unknown as object,
    totalPrescribedAmount: '40' as unknown as object,
    totalPrescribedAmountDisplay: '40 tablets' as unknown as object,
    isRegiment: false as unknown as object,
    isRenewable: true,
    renewalBlockedReason: PrescribedItemDtoRenewalBlockedReasonEnum.IsRegiment,
    renewalStatus: PrescribedItemDtoRenewalStatusEnum.NUMBER_0,
    amountRemaining: 30,
    amountRemainingUnit: 'tablets',
    amountRemainingDisplay: '30 tablets',
    percentageRemaining: 75,
    isFullyDispensed: false,
    dispensations: [
      {
        id: 4,
        dispensingAgentId: 3,
        dispensingAgentName: 'Pharmacy C',
        dispensationDate: new Date(),
        dispensedItemsCount: 10,
        dispensedItems: [
          {
            productId: '3',
            productName: 'Amoxicillin' as unknown as object,
            productStrength: '500mg' as unknown as object,
            dispensedAmount: '10' as unknown as object,
            dispensedAmountDisplay: '10 tablets' as unknown as object,
            numberOfPackages: '1' as unknown as object,
          },
          {
            productId: '3',
            productName: 'Amoxicillin' as unknown as object,
            productStrength: '500mg' as unknown as object,
            dispensedAmount: '10' as unknown as object,
            dispensedAmountDisplay: '10 tablets' as unknown as object,
            numberOfPackages: '1' as unknown as object,
          },
          {
            productId: '3',
            productName: 'Amoxicillin' as unknown as object,
            productStrength: '500mg' as unknown as object,
            dispensedAmount: '10' as unknown as object,
            dispensedAmountDisplay: '10 tablets' as unknown as object,
            numberOfPackages: '1' as unknown as object,
          },
          {
            productId: '3',
            productName: 'Amoxicillin' as unknown as object,
            productStrength: '500mg' as unknown as object,
            dispensedAmount: '10' as unknown as object,
            dispensedAmountDisplay: '10 tablets' as unknown as object,
            numberOfPackages: '1' as unknown as object,
          },
        ],
      },
    ],
  },
]

export const referrals: ReferralDto[] = [
  {
    id: '1',
    serviceType: 'Þjálfun (serviceType)', // not used
    serviceName: 'Sjúkraþjálfun',
    createdDate: new Date(),
    validUntilDate: new Date(),
    stateValue: 1, // not used
    stateDisplay: 'Virk tilvísun',
    assignedProviderId: '1', // not used
    reasonForReferral: 'Meiðsli á hné',
    fromContactInfo: {
      name: 'Jón Jónsson',
      profession: 'Heimilislæknir',
      department: 'Heilsugæslan Miðbæ',
    },
    toContactInfo: {
      name: 'Opin tilvísun',
      profession: '',
      department: '',
    },
  },
  {
    id: '2',
    serviceType: 'Ofnæmi (serviceType)', // not used
    serviceName: 'Ofnæmislæknir',
    createdDate: new Date(),
    validUntilDate: new Date(),
    stateValue: 1, // not used
    stateDisplay: 'Óvirk tilvísun',
    assignedProviderId: '1', // not used
    reasonForReferral: 'Ofnæmisviðbrögð í húð',
    fromContactInfo: {
      name: 'Jón Jónsson',
      profession: 'Heimilislæknir',
      department: 'Heilsugæslan Miðbæ',
    },
    toContactInfo: {
      name: 'Sigurður Kjartansson',
      profession: 'Ofnæmislækningar',
      department: 'Domus barnalæknar',
    },
  },
]

export const waitlists: WaitingListEntryDto[] = [
  {
    id: '1',
    name: 'Liðskiptaaðgerð á hné',
    organizationName: 'Landspítalinn',
    statusDisplay: 'Samþykktur á lista',
    statusId: 1,
    lastUpdated: new Date('23.11.2023'),
    waitBeganDate: new Date('08.10.2023'),
  },
  {
    id: '2',
    name: 'Hjúkrunarheimili',
    organizationName: 'Sóltún hjúkrunarheimili',
    statusDisplay: 'Umsókn í vinnslu',
    statusId: 2,
    lastUpdated: new Date('12.09.2024'),
    waitBeganDate: new Date('01.02.2022'),
  },
]
