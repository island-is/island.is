import { toConversationTitle } from './conversations'

describe('toConversationTitle', () => {
  it('should leave a short question as it is', () => {
    expect(toConversationTitle('Hvað kostar þetta?')).toBe('Hvað kostar þetta?')
  })

  it('should collapse surrounding and repeated whitespace', () => {
    expect(toConversationTitle('  Hvað   kostar\n þetta? ')).toBe(
      'Hvað kostar þetta?',
    )
  })

  it('should truncate a question that is too long to fit on one line', () => {
    const title = toConversationTitle('a'.repeat(100))
    expect(title).toHaveLength(60)
    expect(title.endsWith('…')).toBe(true)
  })

  it('should not leave a trailing space in front of the ellipsis', () => {
    const title = toConversationTitle(`${'a'.repeat(58)} bc`)
    expect(title).toBe(`${'a'.repeat(58)}…`)
  })
})
