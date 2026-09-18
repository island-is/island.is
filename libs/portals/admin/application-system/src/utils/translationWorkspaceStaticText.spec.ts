import {
  unescapeMarkdownLineBreaks,
  unescapePreviewMarkdownString,
} from './translationWorkspaceStaticText'

describe('unescapeMarkdownLineBreaks', () => {
  it('turns escaped line breaks into real newlines', () => {
    expect(unescapeMarkdownLineBreaks('Hello\\n\\n#### Title')).toBe(
      'Hello\n\n#### Title',
    )
  })

  it('leaves already-real newlines unchanged', () => {
    expect(unescapeMarkdownLineBreaks('Hello\n\n#### Title')).toBe(
      'Hello\n\n#### Title',
    )
  })
})

describe('unescapePreviewMarkdownString', () => {
  it('unescapes line breaks for #markdown message ids', () => {
    expect(
      unescapePreviewMarkdownString(
        'crc.application:section.effect.terms.description#markdown',
        'Intro.\\n\\n#### Heading',
      ),
    ).toBe('Intro.\n\n#### Heading')
  })

  it('does not unescape non-markdown message ids', () => {
    expect(
      unescapePreviewMarkdownString(
        'crc.application:section.effect.terms.sectionTitle',
        'Réttindi\\nforeldra',
      ),
    ).toBe('Réttindi\\nforeldra')
  })
})
