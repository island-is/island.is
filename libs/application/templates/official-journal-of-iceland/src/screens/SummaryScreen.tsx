import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import Summary from '../fields/Summary'
import { OJOIFieldBaseProps } from '../lib/types'
import { summary } from '../lib/messages'

export const SummaryScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  return (
    <FormScreen
      title={f(summary.general.title)}
      intro={f(summary.general.intro)}
      goToScreen={props.goToScreen}
    >
      <Summary {...props} />
    </FormScreen>
  )
}
