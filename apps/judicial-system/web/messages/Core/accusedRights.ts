import { defineMessages } from 'react-intl'

export const accusedRights = defineMessages({
  title: {
    id: 'judicial.system.core:accused_rights.title',
    defaultMessage: 'Afstaða {accusedType}',
    description:
      'Notaður sem titill fyrir réttindi kærða hlutann í öllum málstegundum',
  },
  text: {
    id: 'judicial.system.core:accused_rights.text',
    defaultMessage:
      'Sakborningi er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga',
    description: 'Notaður sem texti fyrir réttindi kærða í öllum málstegundum.',
  },
  tooltip: {
    id: 'judicial.system.core:accused_rights.tooltip',
    defaultMessage:
      'Með því að fela forbókun um réttindi {accusedType} birtist hún ekki í Þingbók málsins.',
    description:
      'Notaður sem upplýsingatexti í upplýsingasvæði við "réttindi kærða" í öllum málstegundum.',
  },
})
