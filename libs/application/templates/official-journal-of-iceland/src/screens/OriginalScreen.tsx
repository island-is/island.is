import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { original } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { Original } from '../fields/Original'

export const OriginalScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  return (
    <FormScreen
      title={f(original.general.title)}
      intro={f(original.general.intro)}
      goToScreen={props.goToScreen}
    >
      <Original {...props} />
    </FormScreen>
  )
}
