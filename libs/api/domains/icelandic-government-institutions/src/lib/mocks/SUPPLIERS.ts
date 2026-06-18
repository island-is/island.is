import { Suppliers } from '../models/suppliers.model'

export const MOCK_SUPPLIERS: Suppliers = {
  data: [
    { id: '5501692829', name: 'Reykjavík Ráðgjöf ehf.', isPrivateProxy: false, isConfidential: false },
    { id: '4210992539', name: 'Norðurorka ehf.', isPrivateProxy: false, isConfidential: false },
    { id: '6503760649', name: 'Bláa lónið ehf.', isPrivateProxy: false, isConfidential: false },
    { id: '4408041240', name: 'Icelandair Group hf.', isPrivateProxy: false, isConfidential: false },
    { id: '4210941239', name: 'Eimskip hf.', isPrivateProxy: false, isConfidential: false },
    { id: '5012021880', name: 'Orkuveita Reykjavíkur', isPrivateProxy: false, isConfidential: false },
    { id: '5012021881', name: 'Vopnasköpun ehf.', isPrivateProxy: false, isConfidential: true },
    { id: '5012021882', name: 'Njósnakerfi ehf.', isPrivateProxy: false, isConfidential: true },
    { id: '5012021883', name: 'Lífeyrissjóður Verslunarmanna', isPrivateProxy: false, isConfidential: false },
    { id: '5012021884', name: 'Vífilfell hf.', isPrivateProxy: false, isConfidential: false },
    { id: '1234567890', name: 'Jón Sigurdsson', isPrivateProxy: true, isConfidential: false },
    { id: '0987654321', name: 'Anna Björnsdóttir', isPrivateProxy: true, isConfidential: true },
    { id: '5501010101', name: 'Guðmundur Einarsson', isPrivateProxy: true, isConfidential: false },
  ],
  totalCount: 13,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
}
