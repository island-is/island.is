export interface Procure {
  name: string
  nationalId: string
}

export const procuresMock: Procure[] = [
  {
    name: 'Guðmundur Guðmundsson',
    nationalId: '0101302989',
  },
  {
    name: 'Jón Jónsson',
    nationalId: '0201302989',
  },
  {
    name: 'María Guðmundsdóttir',
    nationalId: '0301302989',
  },
]

export interface Company {
  id: string
  name: string
  nationalId: string
  procurers?: Procure[]
}

export const companiesMock = [
  {
    id: '1',
    name: 'Fyrirtæki ehf.',
    nationalId: '5501690339',
    procurers: procuresMock,
  },
  {
    id: '2',
    name: 'Company ltd.',
    nationalId: '9871485376',
    procurers: procuresMock,
  },
  {
    id: '3',
    name: 'Kennitala ehf.',
    nationalId: '1122446688',
    procurers: procuresMock,
  },
]
