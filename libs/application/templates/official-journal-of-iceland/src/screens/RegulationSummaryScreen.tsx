import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { regulation } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { Stack } from '@island.is/island-ui/core'
import { ReviewWarnings, ReviewOverview } from '../components/regulations'
import { collectRegulationWarnings } from '../utils/regulationValidations'

export const RegulationSummaryScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application } = props

  const answers = application.answers ?? {}
  const warnings = collectRegulationWarnings(answers)

  return (
    <FormScreen
      goToScreen={props.goToScreen}
      title={f(regulation.summary.general.title)}
      intro={f(regulation.summary.general.intro)}
    >
      <Stack space={[2, 2, 3]}>
        <ReviewWarnings answers={answers} />
        <ReviewOverview answers={answers} hasWarnings={warnings.length > 0} />
      </Stack>
    </FormScreen>
  )
}

export default RegulationSummaryScreen
