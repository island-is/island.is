import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import Summary from '../fields/Summary'
import { OJOIFieldBaseProps } from '../lib/types'
import { publishing } from '../lib/messages'

export const SummaryScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  return (
    <FormScreen
      title={f(publishing.general.title)}
      intro={f(publishing.general.intro)}
    >
      <Summary {...props} />
    </FormScreen>
  )
}
