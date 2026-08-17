import {
  AlertMessage,
  Box,
  DatePicker,
  ErrorMessage,
  GridColumn,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HealthDirectorateCertificateType } from '@island.is/api/schema'
import { Dispatch, SetStateAction } from 'react'
import { messages } from '../../../lib/messages'

export interface CertificateFormState {
  certificateType?: HealthDirectorateCertificateType
  recipientName?: string
  startDate?: Date
  endDate?: Date
  note?: string
}

interface Props {
  formState?: CertificateFormState
  setFormState: Dispatch<SetStateAction<CertificateFormState | undefined>>
  disabled?: boolean
  submitAttempted?: boolean
}

const CertificateRequestForm = ({
  formState,
  setFormState,
  disabled,
  submitAttempted,
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={3}>
      <Box marginBottom={3}>
        <AlertMessage
          type="warning"
          message={formatMessage(
            messages.healthConversationsCertificatePaymentNotice,
          )}
        />
      </Box>

      <Text variant="h5" marginBottom={2}>
        {formatMessage(messages.healthConversationsCertificateTypeTitle)} *
      </Text>
      <GridRow
        marginBottom={submitAttempted && !formState?.certificateType ? 1 : 3}
      >
        <GridColumn
          span={['12/12', '12/12', '12/12', '6/12']}
          paddingBottom={[2, 2, 2, 0]}
        >
          <RadioButton
            large
            backgroundColor="blue"
            id="certificate-type-work"
            name="certificate-type"
            label={formatMessage(
              messages.healthConversationsCertificateTypeWork,
            )}
            checked={
              formState?.certificateType ===
              HealthDirectorateCertificateType.work
            }
            disabled={disabled}
            onChange={() =>
              setFormState({
                ...formState,
                certificateType: HealthDirectorateCertificateType.work,
              })
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <RadioButton
            large
            backgroundColor="blue"
            id="certificate-type-school"
            name="certificate-type"
            label={formatMessage(
              messages.healthConversationsCertificateTypeSchool,
            )}
            checked={
              formState?.certificateType ===
              HealthDirectorateCertificateType.school
            }
            disabled={disabled}
            onChange={() =>
              setFormState({
                ...formState,
                certificateType: HealthDirectorateCertificateType.school,
              })
            }
          />
        </GridColumn>
      </GridRow>

      {submitAttempted && !formState?.certificateType && (
        <Box marginBottom={3}>
          <ErrorMessage>
            {formatMessage(messages.healthConversationsCertificateTypeRequired)}
          </ErrorMessage>
        </Box>
      )}

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
            value={formState?.recipientName ?? ''}
            onChange={(e) =>
              setFormState({ ...formState, recipientName: e.target.value })
            }
            disabled={disabled}
            required
            hasError={submitAttempted && !formState?.recipientName?.trim()}
            errorMessage={formatMessage(
              messages.healthConversationsCertificateRecipientNameRequired,
            )}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <DatePicker
            size="sm"
            backgroundColor="blue"
            range
            selectedRange={{
              startDate: formState?.startDate ?? null,
              endDate: formState?.endDate ?? null,
            }}
            handleChange={(startDate, endDate) =>
              setFormState({
                ...formState,
                startDate: startDate ?? undefined,
                endDate: endDate ?? undefined,
              })
            }
            label={formatMessage(messages.period)}
            placeholderText={formatMessage(messages.choosePeriod)}
            disabled={disabled}
            required
            hasError={
              submitAttempted && (!formState?.startDate || !formState?.endDate)
            }
            errorMessage={formatMessage(
              messages.healthConversationsCertificatePeriodRequired,
            )}
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
          value={formState?.note ?? ''}
          onChange={(e) => setFormState({ ...formState, note: e.target.value })}
          disabled={disabled}
        />
      </Box>
    </Box>
  )
}

export default CertificateRequestForm
