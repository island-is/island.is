import { defineMessage, defineMessages } from 'react-intl'

// Strings for report form 'Greinargerð'
export const reportForm = {
  heading: defineMessage({
    id: 'judicial.system:form.reportForm.heading',
    defaultMessage: 'Greinargerð',
    description: 'Report form: Heading',
  }),
  courtClaim: defineMessages({
    heading: {
      id: 'judicial.system:form.reportForm.courtClaim.heading',
      defaultMessage: 'Dómkröfutexti',
      description: 'Report form court claim: Heading',
    },
    tooltip: {
      id: 'judicial.system:form.reportForm.courtClaim.tooltip',
      defaultMessage:
        'Hér er hægt að bæta texta við dómkröfur, t.d. ef óskað er eftir öðrum úrræðum til vara.',
      description: 'Report form court claim: Tooltip',
    },
    label: {
      id: 'judicial.system:form.reportForm.courtClaim.label',
      defaultMessage: 'Dómkröfur',
      description: 'Report form court claim: Label',
    },
    placeholder: {
      id: 'judicial.system:form.reportForm.courtClaim.placeholder',
      defaultMessage:
        'Hér er hægt að bæta texta við dómkröfurnar eftir þörfum...',
      description: 'Report form court claim: Placeholder',
    },
  }),
  facts: defineMessages({
    heading: {
      id: 'judicial.system:form.reportForm.facts.heading',
      defaultMessage: 'Greinargerð um málsatvik',
      description: 'Report form case facts: Heading',
    },
    tooltip: {
      id: 'judicial.system:form.reportForm.facts.tooltip',
      defaultMessage:
        'Málsatvik, hvernig meðferð þessa máls hófst, skal skrá hér ásamt framburðum vitna og sakborninga ef til eru. Einnig er gott að taka fram stöðu rannsóknar og næstu skref.',
      description: 'Report form case facts: Tooltip',
    },
    label: {
      id: 'judicial.system:form.reportForm.facts.label',
      defaultMessage: 'Málsatvik',
      description: 'Report form case facts: Label',
    },
    placeholder: {
      id: 'judicial.system:form.reportForm.facts.placeholder',
      defaultMessage:
        'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
      description: 'Report form case facts: Placeholder',
    },
  }),
  legalArguments: defineMessages({
    heading: {
      id: 'judicial.system:form.reportForm.legalArguments.heading',
      defaultMessage: 'Greinargerð um lagarök',
      description: 'Report form case legal arguments: Heading',
    },
    tooltip: {
      id: 'judicial.system:form.reportForm.legalArguments.tooltip',
      defaultMessage:
        'Lagarök og lagaákvæði sem eiga við brotið og kröfuna skal taka fram hér.',
      description: 'Report form case legal arguments: Tooltip',
    },
    label: {
      id: 'judicial.system:form.reportForm.legalArguments.label',
      defaultMessage: 'Lagarök',
      description: 'Report form case legal arguments: Label',
    },
    placeholder: {
      id: 'judicial.system:form.reportForm.legalArguments.placeholder',
      defaultMessage: 'Hver eru lagarökin fyrir kröfu um gæsluvarðhald?',
      description: 'Report form case legal arguments: Placeholder',
    },
  }),
  proceduralComments: defineMessages({
    heading: {
      id: 'judicial.system:form.reportForm.proceduralComments.heading',
      defaultMessage: 'Athugasemdir vegna málsmeðferðar',
      description: 'Report form case procedural comments: Heading',
    },
    tooltip: {
      id: 'judicial.system:form.reportForm.proceduralComments.tooltip',
      defaultMessage:
        'Hér er hægt að skrá athugasemdir til dómara og dómritara um hagnýt atriði sem tengjast fyrirtökunni eða málsmeðferðinni, og eru ekki hluti af sjálfri kröfunni.',
      description: 'Report form case procedural comments: Tooltip',
    },
    label: {
      id: 'judicial.system:form.reportForm.proceduralComments.label',
      defaultMessage: 'Athugasemdir',
      description: 'Report form case procedural comments: Label',
    },
    placeholder: {
      id: 'judicial.system:form.reportForm.proceduralComments.placeholder',
      defaultMessage:
        'Er eitthvað sem þú vilt koma á framfæri við dómstólinn varðandi fyrirtökuna eða málsmeðferðina?',
      description: 'Report form case procedural comments: Placeholder',
    },
  }),
  prosecutorOnly: {
    checkbox: defineMessages({
      label: {
        id: 'judicial.system:form.reportForm.prosecutorOnly.checkbox.label',
        defaultMessage: 'Beiðni um dómþing að varnaraðila fjarstöddum',
        description: 'Report form case procecutor only checkbox: Label',
      },
      tooltip: {
        id: 'judicial.system:form.reportForm.prosecutorOnly.checkbox.tooltip',
        defaultMessage:
          'Hér er hægt að setja fram kröfu um að dómþing fari fram að varnaraðila fjarstöddum sé það nauðsynlegt vegna rannsóknarhagsmuna. Með því að haka í reitinn birtist krafan neðst í skjalinu.',
        description: 'Report form case procecutor only checkbox: Tooltip',
      },
    }),
    input: defineMessages({
      label: {
        id: 'judicial.system:form.reportForm.prosecutorOnly.input.label',
        defaultMessage: 'Beiðni',
        description: 'Report form case procecutor only input: Label',
      },
      placeholder: {
        id: 'judicial.system:form.reportForm.prosecutorOnly.input.placeholder',
        defaultMessage:
          'Er þess óskað að varnaraðili sé ekki viðstaddur dómþing?',
        description: 'Report form case procecutor only input: Placeholder',
      },
      defaultValue: {
        id: 'judicial.system:form.reportForm.prosecutorOnly.input.defaultValue',
        defaultMessage:
          'Er eitthvað sem þú vilt koma á framfæri við dómstólinn varðandi fyrirtökuna eða málsmeðferðina?',
        description: 'Report form case procecutor only: Default value',
      },
    }),
  },
}
