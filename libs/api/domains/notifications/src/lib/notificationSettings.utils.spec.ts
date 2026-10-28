import { filterAndSortSenders } from './notificationSettings.utils'

describe('filterAndSortSenders', () => {
  const sender = (id: string) => ({ sender: { id }, categories: [] })

  it('drops senders without a name', () => {
    const result = filterAndSortSenders(
      [sender('1'), sender('2'), sender('3'), sender('4')],
      { '1': 'Skatturinn', '2': null, '3': '  ', '4': undefined },
    )
    expect(result.map((s) => s.sender.id)).toEqual(['1'])
  })

  it('sorts alphabetically using Icelandic collation', () => {
    const result = filterAndSortSenders(
      [sender('1'), sender('2'), sender('3'), sender('4')],
      { '1': 'Þjóðskrá', '2': 'Ísland.is', '3': 'Zeta', '4': 'Almannaróm' },
    )
    expect(result.map((s) => s.sender.title)).toEqual([
      'Almannaróm',
      'Ísland.is',
      'Zeta',
      'Þjóðskrá',
    ])
  })
})
