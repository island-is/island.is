import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { OJOIFieldBaseProps } from '../lib/types'
import { publishing } from '../lib/messages'
import { Publishing } from '../fields/Publishing'

export const PublishingScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  return (
    <FormScreen
      title={f(publishing.general.title)}
      intro={f(publishing.general.intro)}
    >
      <Publishing {...props} />
    </FormScreen>
  )
}
