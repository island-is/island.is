import { unescapePreviewMarkdownString } from './translationWorkspaceStaticText'
import { buildTranslationWorkspacePreviewIntlMessages } from './translationWorkspacePreviewIntlMessages'

describe('buildTranslationWorkspacePreviewIntlMessages', () => {
  it('includes extra custom-field descriptors so formatMessage can resolve markdown copy', () => {
    const messages = buildTranslationWorkspacePreviewIntlMessages(
      [],
      unescapePreviewMarkdownString,
      [
        {
          id: 'crc.application:section.effect.terms.description#markdown',
          defaultMessage: 'Intro.\\n\\n#### Heading',
        },
      ],
    )

    expect(
      messages['crc.application:section.effect.terms.description#markdown'],
    ).toBe('Intro.\n\n#### Heading')
  })
})
