import { defineMessages } from 'react-intl'

export const assigneeTaxReturnRequiredMessages = defineMessages({
  summary: {
    id: 'hb.application:assigneeTaxReturnRequired.summary#markdown',
    defaultMessage:
      'Til að sækja um húsnæðisbætur þarftu að hafa skilað inn skattframtali fyrir síðasta ár til skattsins. Samkvæmt þeim upplýsingum sem HMS hefur aðgang að hefur því ekki verið skilað inn. Þegar framtalinu hefur verið skilað getur þú haldið áfram með umsóknina.\n\n\nEf þú telur að upplýsingar séu rangar geturðu haft samband við HMS.',
    description: 'Assignee tax return required error summary',
  },
  title: {
    id: 'hb.application:assigneeTaxReturnRequired.title',
    defaultMessage: 'Þú átt eftir að skila skattframtali',
    description: 'Assignee tax return required error title',
  },
})
