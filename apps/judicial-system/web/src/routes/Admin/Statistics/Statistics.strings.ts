import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  subpoenaStatisticsTooltip: {
    id: 'judicial.system.core:admin.statistics.subpoena_tooltip',
    defaultMessage:
      'Yfirlit yfir fyrirköll, birtingarstöður og meðal afgreiðslutíma þeirra birtingaraðferða sem eiga við',
    description: 'Tooltip texti fyrir fyrirkalls hluta á tölfræði skjá.',
  },
  indictmentStatisticsTooltip: {
    id: 'judicial.system.core:admin.statistics.indictment_tooltip',
    defaultMessage:
      'Meðal afgreiðslutími: Fyrir ákærur sem er lokið með dómi. Tímabil er frá því að ákæra er send til dómstóls þar til henni er lokið með dómi.',
    description: 'Tooltip texti fyrir ákæru hluta á tölfræði skjá.',
  },
  allCasesStatisticsTooltip: {
    id: 'judicial.system.core:admin.statistics.all_cases_tooltip',
    defaultMessage: 'Öll mál (R og S) á völdu tímabili',
    description: 'Tooltip texti fyrir ákæru hluta á tölfræði skjá.',
  },
})
