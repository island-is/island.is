import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { attachments } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { SupportingDoc } from '../fields/SupportingDoc'

export const SupportingDocScreen = ({
  application,
  errors,
  field,
  goToScreen,
}: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  return (
    <FormScreen
      title={f(attachments.general.titleSupporting)}
      intro={f(attachments.general.introSupporting)}
      goToScreen={goToScreen}
    >
      <SupportingDoc field={field} application={application} errors={errors} />
    </FormScreen>
  )
}
