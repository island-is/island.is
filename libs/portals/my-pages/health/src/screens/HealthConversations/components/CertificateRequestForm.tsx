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
import { HealthDirectorateCertificateTypeEnum } from '@island.is/api/schema'
import { messages } from '../../../lib/messages'

export interface CertificateFormState {
  certificateType: HealthDirectorateCertificateTypeEnum | null
  recipientName: string
  startDate: Date | null
  endDate: Date | null
  note: string
}

export const emptyCertificateFormState: CertificateFormState = {
  certificateType: null,
  recipientName: '',
  startDate: null,
  endDate: null,
  note: '',
}

interface Props {
  formState: CertificateFormState
  setFormState: (formState: CertificateFormState) => void
  disabled?: boolean
}

const CertificateRequestForm = ({
  formState,
  setFormState,
  disabled,
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
        {formatMessage(messages.healthConversationsCertificateTypeTitle)}
      </Text>
      <GridRow marginBottom={3}>
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
              formState.certificateType ===
              HealthDirectorateCertificateTypeEnum.work
            }
            disabled={disabled}
            onChange={() =>
              setFormState({
                ...formState,
                certificateType: HealthDirectorateCertificateTypeEnum.work,
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
              formState.certificateType ===
              HealthDirectorateCertificateTypeEnum.school
            }
            disabled={disabled}
            onChange={() =>
              setFormState({
                ...formState,
                certificateType: HealthDirectorateCertificateTypeEnum.school,
              })
            }
          />
        </GridColumn>
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
            value={formState.recipientName}
            onChange={(e) =>
              setFormState({ ...formState, recipientName: e.target.value })
            }
            disabled={disabled}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <DatePicker
            size="sm"
            backgroundColor="blue"
            range
            selectedRange={{
              startDate: formState.startDate,
              endDate: formState.endDate,
            }}
            handleChange={(startDate, endDate) =>
              setFormState({
                ...formState,
                startDate,
                endDate: endDate ?? null,
              })
            }
            label={formatMessage(messages.period)}
            placeholderText={formatMessage(messages.choosePeriod)}
            disabled={disabled}
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
          value={formState.note}
          onChange={(e) => setFormState({ ...formState, note: e.target.value })}
          disabled={disabled}
        />
      </Box>
    </Box>
  )
}

export default CertificateRequestForm
