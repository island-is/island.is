import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { original } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'

export const InvolvedPartyScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  return (
    <FormScreen
      // title={f(original.general.title)}
      // intro={f(original.general.intro)}
      title="title"
      intro="intro"
    >
      hallo
    </FormScreen>
  )
}
