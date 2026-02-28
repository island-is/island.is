import { InvoiceGroupCollection } from '../models/invoiceGroups.model'

export const MOCK_INVOICE_GROUPS: InvoiceGroupCollection = {
  data: [
    {
      id: 'group-1',
      supplier: {
        id: 1001,
        name: 'Reykjavík Ráðgjöf ehf.',
        isPrivateProxy: false,
        isConfidential: false,
      },
      customer: {
        id: 2001,
        name: 'Íslenska Byggingafélagið hf.',
      },
      totalSum: 2450000,
      totalCount: 1,
    },
    {
      id: 'group-2',
      supplier: {
        id: 1002,
        name: 'Norðurorka ehf.',
        isPrivateProxy: false,
        isConfidential: false,
      },
      customer: {
        id: 2002,
        name: 'Landspítali',
      },
      totalSum: 890000,
      totalCount: 2,
    },
    {
      id: 'group-3',
      supplier: {
        id: 1003,
        name: 'Bláa lónið ehf.',
        isPrivateProxy: false,
        isConfidential: false,
      },
      customer: {
        id: 2003,
        name: 'Ferðamálastofa',
      },
      totalSum: 1250000,
      totalCount: 1,
    },
    {
      id: 'group-4',
      supplier: {
        id: 1004,
        name: 'Icelandair Group hf.',
        isPrivateProxy: false,
        isConfidential: false,
      },
      customer: {
        id: 2004,
        name: 'Keflavíkurflugvöllur',
      },
      totalSum: 5675000,
      totalCount: 1,
    },
    {
      id: 'group-5',
      supplier: {
        id: 1005,
        name: 'Eimskip hf.',
        isPrivateProxy: false,
        isConfidential: false,
      },
      customer: {
        id: 2005,
        name: 'Samskip hf.',
      },
      totalSum: 3200000,
      totalCount: 2,
    },
    {
      id: 'group-6',
      supplier: {
        id: 1006,
        name: 'Orkuveita Reykjavíkur',
        isPrivateProxy: false,
        isConfidential: false,
      },
      customer: {
        id: 2006,
        name: 'Álftanes sveitarfélag',
      },
      totalSum: 780000,
      totalCount: 1,
    },
    {
      id: 'group-7',
      supplier: {
        id: 1007,
        name: 'Vopnasköpun ehf.',
        isPrivateProxy: false,
        isConfidential: true,
      },
      customer: {
        id: 2007,
        name: 'Fiskifélag Íslands',
      },
      totalSum: 4500000,
      totalCount: 1,
    },
    {
      id: 'group-8',
      supplier: {
        id: 1008,
        name: 'Njósnakerfi ehf.',
        isPrivateProxy: false,
        isConfidential: true,
      },
      customer: {
        id: 2008,
        name: 'Tæknigarður',
      },
      totalSum: 650000,
      totalCount: 1,
    },
    {
      id: 'group-9',
      supplier: {
        id: 1011,
        name: 'Jón Sigurdsson',
        isPrivateProxy: true,
        isConfidential: false,
      },
      customer: {
        id: 2009,
        name: 'Fasteignafélag Reykjavíkur',
      },
      totalSum: 8900000,
      totalCount: 1,
    },
    {
      id: 'group-10',
      supplier: {
        id: 1009,
        name: 'Lífeyrissjóður Verslunarmanna',
        isPrivateProxy: false,
        isConfidential: false,
      },
      customer: {
        id: 2010,
        name: 'Hagkaup hf.',
      },
      totalSum: 420000,
      totalCount: 2,
    },
  ],
  totalCount: 10,
  totalPaymentsSum: 28715000,
  totalPaymentsCount: 13,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
}
