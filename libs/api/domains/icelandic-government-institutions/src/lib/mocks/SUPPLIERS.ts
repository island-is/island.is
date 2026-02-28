import { Suppliers } from '../models/suppliers.model'

export const MOCK_SUPPLIERS: Suppliers = {
  data: [
    {
      id: 1001,
      name: 'Reykjavík Ráðgjöf ehf.',
      isPrivateProxy: false,
      isConfidential: false,
    },
    {
      id: 1002,
      name: 'Norðurorka ehf.',
      isPrivateProxy: false,
      isConfidential: false,
    },
    {
      id: 1003,
      name: 'Bláa lónið ehf.',
      isPrivateProxy: false,
      isConfidential: false,
    },
    {
      id: 1004,
      name: 'Icelandair Group hf.',
      isPrivateProxy: false,
      isConfidential: false,
    },
    {
      id: 1005,
      name: 'Eimskip hf.',
      isPrivateProxy: false,
      isConfidential: false,
    },
    {
      id: 1006,
      name: 'Orkuveita Reykjavíkur',
      isPrivateProxy: false,
      isConfidential: false,
    },
    {
      id: 1007,
      name: 'Vopnasköpun ehf.',
      isPrivateProxy: false,
      isConfidential: true,
    },
    {
      id: 1008,
      name: 'Njósnakerfi ehf.',
      isPrivateProxy: false,
      isConfidential: true,
    },
    {
      id: 1009,
      name: 'Lífeyrissjóður Verslunarmanna',
      isPrivateProxy: false,
      isConfidential: false,
    },
    {
      id: 1010,
      name: 'Vífilfell hf.',
      isPrivateProxy: false,
      isConfidential: false,
    },
    {
      id: 1011,
      name: 'Jón Sigurdsson',
      isPrivateProxy: true,
      isConfidential: false,
    },
    {
      id: 1012,
      name: 'Anna Björnsdóttir',
      isPrivateProxy: true,
      isConfidential: true,
    },
    {
      id: 1013,
      name: 'Guðmundur Einarsson',
      isPrivateProxy: true,
      isConfidential: false,
    },
  ],
  totalCount: 13,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
}
