import {
  filterAndSortSenders,
  getErrorMessage,
} from './notificationSettings.utils'

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

describe('getErrorMessage', () => {
  it('returns the message of an Error', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom')
  })

  it('returns strings as is', () => {
    expect(getErrorMessage('boom')).toBe('boom')
  })

  it('stringifies plain objects', () => {
    expect(getErrorMessage({ code: 1 })).toBe('{"code":1}')
  })

  it('falls back for values JSON.stringify cannot represent', () => {
    expect(getErrorMessage(undefined)).toBe('An unknown error occurred')
    expect(getErrorMessage(() => 1)).toBe('An unknown error occurred')
  })

  it('falls back for circular structures', () => {
    const circular: Record<string, unknown> = {}
    circular.self = circular
    expect(getErrorMessage(circular)).toBe('An unknown error occurred')
  })
})
