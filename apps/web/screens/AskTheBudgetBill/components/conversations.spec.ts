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

  it('should not cut a character outside the basic plane in half', () => {
    // The emoji sits right on the boundary the question is cut at
    const title = toConversationTitle(`${'a'.repeat(58)}\u{1f600}bc`)
    expect(title).toBe(`${'a'.repeat(58)}\u{1f600}…`)
    expect(Array.from(title)).toHaveLength(60)
  })
})
