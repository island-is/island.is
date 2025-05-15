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
      'Heildarfjöldi: Ákærur sem voru stofnaðar á völdu tímabili. Í vinnslu: hjá dómstóli. Lokið með dómi og meðaltími frá því að mál barst dómstólum þar til búið var að dæma í málinu.',
    description: 'Tooltip texti fyrir ákæru hluta á tölfræði skjá.',
  },
  allCasesStatisticsTooltip: {
    id: 'judicial.system.core:admin.statistics.all_cases_tooltip',
    defaultMessage: 'Öll mál (R og S) sem voru  á völdu tímabili',
    description: 'Tooltip texti fyrir ákæru hluta á tölfræði skjá.',
  },
  requestCaseStatisticsTooltip: {
    id: 'judicial.system.core:admin.statistics.request_cases_tooltip',
    defaultMessage:
      'Heildarfjöldi: Öll R mál sem voru stofnuð á völdu tímabili',
    description: 'Tooltip texti fyrir R mála hluta á tölfræði skjá.',
  },
})
