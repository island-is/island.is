import {
  AlertMessage,
  Box,
  DatePicker,
  GridColumn,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HealthDirectorateCertificateType } from '@island.is/api/schema'
import { formatDate } from '@island.is/portals/my-pages/core'
import { messages } from '../../../lib/messages'

export interface CertificateFormState {
  certificateType?: HealthDirectorateCertificateType
  recipientName?: string
  startDate?: Date
  endDate?: Date
  note?: string
}

/**
 * The submit-ready shape of the form, or undefined while a required field is
 * missing. Dates are serialized as local-time `yyyy-MM-dd` to keep the picked
 * calendar date intact — Date serialization would shift it across timezones.
 */
export const toCertificateRequestInput = (state: CertificateFormState) => {
  const { certificateType, recipientName, startDate, endDate, note } = state
  if (!certificateType || !recipientName?.trim() || !startDate || !endDate) {
    return undefined
  }

  return {
    certificateType,
    recipientName: recipientName.trim(),
    startDate: formatDate(startDate, 'yyyy-MM-dd'),
    endDate: formatDate(endDate, 'yyyy-MM-dd'),
    note: note?.trim() || undefined,
  }
}

const certificateTypeOptions = [
  {
    value: HealthDirectorateCertificateType.WORK,
    label: messages.healthConversationsCertificateTypeWork,
  },
  {
    value: HealthDirectorateCertificateType.SCHOOL,
    label: messages.healthConversationsCertificateTypeSchool,
  },
]

export interface CertificateRequestFormProps {
  formState: CertificateFormState
  onChange: (patch: Partial<CertificateFormState>) => void
  disabled?: boolean
  hidePaymentNotice?: boolean
}

const CertificateRequestForm = ({
  formState,
  onChange,
  disabled,
  hidePaymentNotice,
}: CertificateRequestFormProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={3}>
      {!hidePaymentNotice && (
        <Box marginBottom={3}>
          <AlertMessage
            type="warning"
            message={formatMessage(
              messages.healthConversationsCertificatePaymentNotice,
            )}
          />
        </Box>
      )}

      <Text variant="h5" marginBottom={2}>
        {formatMessage(messages.healthConversationsCertificateTypeTitle)}
      </Text>
      <GridRow marginBottom={3}>
        {certificateTypeOptions.map((option, index) => (
          <GridColumn
            key={option.value}
            span={['12/12', '12/12', '12/12', '6/12']}
            paddingBottom={
              index < certificateTypeOptions.length - 1 ? [2, 2, 2, 0] : 0
            }
          >
            <RadioButton
              large
              backgroundColor="blue"
              id={`certificate-type-${option.value}`}
              name="certificate-type"
              label={formatMessage(option.label)}
              checked={formState.certificateType === option.value}
              disabled={disabled}
              onChange={() => onChange({ certificateType: option.value })}
            />
          </GridColumn>
        ))}
      </GridRow>

      <GridRow marginBottom={3}>
        <GridColumn
          span={['12/12', '12/12', '12/12', '6/12']}
          paddingBottom={[2, 2, 2, 0]}
        >
          <Input
            size="sm"
            name="certificate-recipient-name"
            label={formatMessage(
              messages.healthConversationsCertificateRecipientNameLabel,
            )}
            placeholder={formatMessage(
              messages.healthConversationsCertificateRecipientNamePlaceholder,
            )}
            backgroundColor="blue"
            value={formState.recipientName ?? ''}
            onChange={(e) => onChange({ recipientName: e.target.value })}
            disabled={disabled}
            required
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <DatePicker
            size="sm"
            backgroundColor="blue"
            range
            selectedRange={{
              startDate: formState.startDate ?? null,
              endDate: formState.endDate ?? null,
            }}
            handleChange={(startDate, endDate) =>
              onChange({
                startDate: startDate ?? undefined,
                endDate: endDate ?? undefined,
              })
            }
            label={formatMessage(messages.period)}
            placeholderText={formatMessage(messages.choosePeriod)}
            disabled={disabled}
            required
          />
        </GridColumn>
      </GridRow>

      <Box marginBottom={3}>
        <Input
          size="sm"
          textarea
          rows={5}
          name="certificate-note"
          label={formatMessage(
            messages.healthConversationsCertificateNoteLabel,
          )}
          placeholder={formatMessage(
            messages.healthConversationsCertificateNotePlaceholder,
          )}
          backgroundColor="blue"
          value={formState.note ?? ''}
          onChange={(e) => onChange({ note: e.target.value })}
          disabled={disabled}
        />
      </Box>
    </Box>
  )
}

export default CertificateRequestForm
