import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { Attachments } from '../fields/Attachments'
import { attachments } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'

export const AttachmentsScreen = ({
  application,
  errors,
  field,
  goToScreen,
}: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  return (
    <FormScreen
      title={f(attachments.general.title)}
      intro={f(attachments.general.intro)}
      goToScreen={goToScreen}
    >
      <Attachments field={field} application={application} errors={errors} />
    </FormScreen>
  )
}
