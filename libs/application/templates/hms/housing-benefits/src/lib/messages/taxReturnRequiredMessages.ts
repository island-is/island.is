import { defineMessages } from 'react-intl'

export const taxReturnRequiredMessages = defineMessages({
  title: {
    id: 'hb.application:taxReturnRequired.title',
    defaultMessage: 'Þú átt eftir að skila skattframtali',
    description: 'Applicant tax return required error title',
  },
  summary: {
    id: 'hb.application:taxReturnRequired.summary#markdown',
    defaultMessage:
      'Til að sækja um húsnæðisbætur þarftu að hafa skilað inn skattframtali fyrir síðasta ár til skattsins. Samkvæmt þeim upplýsingum sem HMS hefur aðgang að hefur því ekki verið skilað inn. Þegar framtalinu hefur verið skilað getur þú haldið áfram með umsóknina.\n\n\nEf þú telur að upplýsingar séu rangar geturðu haft samband við HMS.',
    description: 'Applicant tax return required error summary',
  },
})
