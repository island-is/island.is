interface Grant {
  hasBeenProcessed: boolean

  id: number

  date: string

  fund: string
  project: string
  amountISK: number

  // Sender information
  senderName: string
  senderNationalId: string
  senderAddress: string
  senderPostalCode: string
  senderPlace: string

  grantExplanation: string
}

const data: Grant[] = [
  {
    id: 0,
    date: '2025-01-01',
    fund: 'Styrktarsjóður Barnaspítala Hringsins',
    project: 'Endurmenntun',
    amountISK: 1000,
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    grantExplanation: 'Af því bara',
    hasBeenProcessed: false,
  },
  {
    id: 1,
    date: '2025-01-01',
    fund: 'Styrktarsjóður Barnaspítala Hringsins',
    project: 'Endurmenntun',
    amountISK: 1000,
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    grantExplanation: 'Af því bara',
    hasBeenProcessed: false,
  },
  {
    id: 2,
    date: '2025-01-01',
    fund: 'Styrktarsjóður Barnaspítala Hringsins',
    project: 'Endurmenntun',
    amountISK: 1000,
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    grantExplanation: 'Af því bara',
    hasBeenProcessed: true,
  },
  {
    id: 3,
    date: '2025-01-01',
    fund: 'Styrktarsjóður Barnaspítala Hringsins',
    project: 'Endurmenntun',
    amountISK: 1000,
    senderName: 'test',
    senderNationalId: 'test',
    senderAddress: 'test',
    senderPostalCode: 'test',
    senderPlace: 'test',
    grantExplanation: 'Af því bara',
    hasBeenProcessed: true,
  },
]

export const GrantOverview = () => {
  return <div>Styrkir</div>
}
