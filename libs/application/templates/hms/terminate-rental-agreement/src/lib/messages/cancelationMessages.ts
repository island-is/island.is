import { defineMessages } from 'react-intl'

export const cancelationMessages = defineMessages({
  title: {
    id: 'tra.application:cancelation.title',
    defaultMessage: 'Riftun leigusamnings',
    description: 'Cancelation title',
  },
  dateTitle: {
    id: 'tra.application:cancelation.dateTitle',
    defaultMessage: 'Dagsetning riftunar',
    description: 'Cancelation date title',
  },
  reasonTitle: {
    id: 'tra.application:cancelation.reasonTitle',
    defaultMessage: 'Ástæða riftunar',
    description: 'Cancelation reason title',
  },
  reasonPlaceholder: {
    id: 'tra.application:cancelation.reasonPlaceholder',
    defaultMessage: 'Sláðu inn ástæðu fyrir riftun',
    description: 'Cancelation reason placeholder',
  },
  warningSectionTitle: {
    id: 'tra.application:cancelation.warningSectionTitle',
    defaultMessage: 'Aðvörun vegna riftunar',
    description: 'Cancelation warning section title',
  },
  warningTitle: {
    id: 'tra.application:cancelation.warningTitle',
    defaultMessage: 'Athugið',
    description: 'Cancelation warning title',
  },
  warningPlaceholder: {
    id: 'tra.application:cancelation.warningPlaceholder#markdown',
    defaultMessage:
      'Þú ert að fara að rifta leigusamningi. Skilyrði fyrir slíkri riftun eru útlistuð [á upplýsingasíðu island.is](https://island.is/leiga-a-ibudarhusnaedi/uppsogn-eda-riftun-leigusamnings) og í [húsaleigulögum](https://www.althingi.is/lagas/nuna/1994036.html) ',
    description: 'Cancelation warning text',
  },
})
