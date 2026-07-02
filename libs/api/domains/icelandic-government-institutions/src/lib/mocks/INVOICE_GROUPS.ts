import { InvoiceGroupCollection } from '../models/invoiceGroups.model'

export const MOCK_INVOICE_GROUPS: InvoiceGroupCollection = {
  data: [
    {
      id: '5012021885-5501692829',
      supplier: {
        id: '5501692829',
        name: 'Reykjavík Ráðgjöf ehf.',
        isPrivateProxy: false,
        isConfidential: false,
      },
      debtor: {
        erpLegalEntityId: 5012021885,
        legalId: '5012021885',
        name: 'Íslenska Byggingafélagið hf.',
      },
      totalSum: 2450000,
      totalCount: 1,
    },
    {
      id: '5012021886-4210992539',
      supplier: {
        id: '4210992539',
        name: 'Norðurorka ehf.',
        isPrivateProxy: false,
        isConfidential: false,
      },
      debtor: {
        erpLegalEntityId: 5012021886,
        legalId: '5012021886',
        name: 'Landspítali',
      },
      totalSum: 890000,
      totalCount: 2,
    },
    {
      id: '5012021887-6503760649',
      supplier: {
        id: '6503760649',
        name: 'Bláa lónið ehf.',
        isPrivateProxy: false,
        isConfidential: false,
      },
      debtor: {
        erpLegalEntityId: 5012021887,
        legalId: '5012021887',
        name: 'Ferðamálastofa',
      },
      totalSum: 1250000,
      totalCount: 1,
    },
    {
      id: '5012021888-4408041240',
      supplier: {
        id: '4408041240',
        name: 'Icelandair Group hf.',
        isPrivateProxy: false,
        isConfidential: false,
      },
      debtor: {
        erpLegalEntityId: 5012021888,
        legalId: '5012021888',
        name: 'Keflavíkurflugvöllur',
      },
      totalSum: 5675000,
      totalCount: 1,
    },
    {
      id: '5012021889-4210941239',
      supplier: {
        id: '4210941239',
        name: 'Eimskip hf.',
        isPrivateProxy: false,
        isConfidential: false,
      },
      debtor: {
        erpLegalEntityId: 5012021889,
        legalId: '5012021889',
        name: 'Samskip hf.',
      },
      totalSum: 3200000,
      totalCount: 2,
    },
  ],
  totalCount: 5,
  totalPaymentsSum: 13465000,
  totalPaymentsCount: 7,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
}
