import { defineMessages } from 'react-intl'

export const boundTerminationMessages = defineMessages({
  title: {
    id: 'tra.application:boundTermination.title',
    defaultMessage: 'Uppsögn tímabundins leigusamnings',
    description: 'Bound termination title',
  },
  description: {
    id: 'tra.application:boundTermination.description',
    defaultMessage: 'Vinsamlegast veldu dagsetningu sem uppsögnin tekur gildi',
    description: 'Bound termination description',
  },
  dateTitle: {
    id: 'tra.application:boundTermination.dateTitle',
    defaultMessage: 'Dagsetning leigusamningsloka',
    description: 'Bound termination date title',
  },
  warningSectionTitle: {
    id: 'tra.application:boundTermination.warningSectionTitle',
    defaultMessage: 'Uppsögn tímabundins húsaleigusamnings',
    description: 'Bound termination warning section title',
  },
  warningTitle: {
    id: 'tra.application:boundTermination.warningTitle',
    defaultMessage: 'Athugið',
    description: 'Bound termination warning title',
  },
  warningPlaceholder: {
    id: 'tra.application:boundTermination.warningPlaceholder#markdown',
    defaultMessage:
      'Þú ert að fara segja upp tímabundnum húsaleigusamningi. Tímabundnum leigusamningi lýkur á umsömdum degi án sérstakrar uppsagnar eða tilkynningar af hálfu aðila. Heimilt er þó að semja um slíka uppsögn á grundvelli sérstakra forsendna, atvika eða aðstæðna sem tilgreind eru í leigusamningnum. Nánari upplýsingar er að finna á [island.is](https://island.is/leiga-a-ibudarhusnaedi/uppsogn-eda-riftun-leigusamnings) og í [húsaleigulögum](https://www.althingi.is/lagas/nuna/1994036.html).',
    description: 'Bound termination warning text',
  },
})
