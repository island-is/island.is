import { defineMessages } from 'react-intl'

// Reason
export const reason = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.arrangement.reason.sectionTitle',
      defaultMessage: 'Tilefni',
      description: 'Reason for change section title',
    },
    pageTitle: {
      id: 'crc.application:section.arrangement.reason.pageTitle',
      defaultMessage: 'Hvert er tilefni breytingar á lögheimili?',
      description: 'Reason for change page title',
    },
    description: {
      id: 'crc.application:section.arrangement.reason.description#markdown',
      defaultMessage:
        'Ekki er nauðsynlegt að tilgreina tilefni breytingarinnar sérstaklega en það getur auðveldað sýslumanni vinnslu umsóknarinnar að gera það.',
      description: 'Reason for change page description',
    },
  }),
  input: defineMessages({
    label: {
      id: 'crc.application:section.arrangement.reason.input.label',
      defaultMessage: 'Tilefni',
      description: 'Label for reason for change input',
    },
    placeholder: {
      id: 'crc.application:section.arrangement.reason.input.placeholder',
      defaultMessage:
        'Skrifaðu hér í stuttu máli ástæðu þess að lögheimili barnsins er að færast á milli foreldra',
      description: 'Placeholder for reason for change input',
    },
  }),
}
