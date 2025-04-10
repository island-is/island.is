import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const RehabilitationPlan = () => {
  const { formatMessage } = useLocale()

  return (
    <ReviewGroup isLast>
      <DataValue
        label={formatMessage(
          medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
            .sectionTitle,
        )}
        value={formatMessage(
          medicalAndRehabilitationPaymentsFormMessage.overview
            .rehabilitationPlanConfirmed,
        )}
      />
    </ReviewGroup>
  )
}
