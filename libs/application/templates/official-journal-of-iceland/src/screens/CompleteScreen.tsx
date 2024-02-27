import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { OJOIFieldBaseProps } from '../lib/types'
import { complete } from '../lib/messages/complete'
import { Complete } from '../fields/Complete'

export const CompleteScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  return (
    <FormScreen title={f(complete.general.title)}>
      <Complete {...props} />
    </FormScreen>
  )
}
