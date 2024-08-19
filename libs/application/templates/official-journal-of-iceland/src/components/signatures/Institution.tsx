import {
  Box,
  DatePicker,
  Input,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import {
  DEBOUNCE_INPUT_TIMER,
  OJOJ_INPUT_HEIGHT,
  SignatureType,
} from '../../lib/constants'
import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'
import { getValueViaPath } from '@island.is/application/core'
import { InputFields } from '../../lib/types'
import debounce from 'lodash/debounce'
import * as styles from './Signatures.css'
import { getSignatureDefaultValues } from '../../lib/utils'
import { z } from 'zod'
import {
  committeeSignatureSchema,
  regularSignatureSchema,
  signatureInstitutionSchema,
} from '../../lib/dataSchema'
type Props = {
  applicationId: string
  type: SignatureType
  signatureIndex?: number
}

type SignatureInstitutionKeys = z.infer<typeof signatureInstitutionSchema>

export const InstitutionSignature = ({
  applicationId,
  type,
  signatureIndex,
}: Props) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application, applicationLoading } = useApplication(
    {
      applicationId,
    },
  )

  const handleInstitutionChange = (
    value: string,
    key: SignatureInstitutionKeys,
    signatureIndex?: number,
  ) => {
    const currentAnswers = structuredClone(application.answers)

    const signature = getValueViaPath(
      currentAnswers,
      InputFields.signature[type],
    )

    const isRegularSignature = regularSignatureSchema.safeParse(signature)
    const isCommitteeSignature = committeeSignatureSchema.safeParse(signature)

    if (isRegularSignature.success && signatureIndex !== undefined) {
      const updatedRegularSignature = isRegularSignature.data?.map(
        (signature, index) => {
          if (index === signatureIndex) {
            return {
              ...signature,
              [key]: value,
            }
          }

          return signature
        },
      )

      const updatedSignatures = set(
        currentAnswers,
        InputFields.signature[type],
        updatedRegularSignature,
      )

      updateApplication(updatedSignatures)
    }

    if (isCommitteeSignature.success) {
      const updatedCommitteeSignature = set(
        currentAnswers,
        InputFields.signature[type],
        {
          ...isCommitteeSignature.data,
          [key]: value,
        },
      )

      updateApplication(updatedCommitteeSignature)
    }
  }

  const debounceHandleInstitutionChange = debounce(
    handleInstitutionChange,
    DEBOUNCE_INPUT_TIMER,
  )

  const onChangeHandler = (
    value: string,
    key: SignatureInstitutionKeys,
    signatureIndex?: number,
  ) => {
    debounceHandleInstitutionChange.cancel()
    debounceHandleInstitutionChange(value, key, signatureIndex)
  }

  if (applicationLoading) {
    return <SkeletonLoader repeat={5} height={OJOJ_INPUT_HEIGHT} space={2} />
  }

  const { institution, date } = getSignatureDefaultValues(
    getValueViaPath(application.answers, InputFields.signature[type]),
    signatureIndex,
  )

  return (
    <Box className={styles.institutionWrapper}>
      <Box className={styles.institution}>
        <Box flexGrow={1}>
          <Input
            name={`signature.${type}.institution${
              signatureIndex ? `.${signatureIndex}` : ''
            }`}
            label={f(signatures.inputs.institution.label)}
            placeholder={f(signatures.inputs.institution.placeholder)}
            size="sm"
            defaultValue={institution}
            backgroundColor="blue"
            onChange={(e) =>
              onChangeHandler(e.target.value, 'institution', signatureIndex)
            }
          />
        </Box>
        <Box flexGrow={1}>
          <DatePicker
            name={`signature.${type}.date${
              signatureIndex ? `.${signatureIndex}` : ''
            }`}
            label={f(signatures.inputs.date.label)}
            placeholderText={f(signatures.inputs.date.placeholder)}
            size="sm"
            locale="is"
            backgroundColor="blue"
            selected={date ? new Date(date) : undefined}
            handleCloseCalendar={(date) =>
              date &&
              onChangeHandler(date.toISOString(), 'date', signatureIndex)
            }
          />
        </Box>
      </Box>
    </Box>
  )
}
