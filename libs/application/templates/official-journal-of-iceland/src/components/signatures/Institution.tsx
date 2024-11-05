import {
  Box,
  DatePicker,
  Input,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import {
  OJOI_INPUT_HEIGHT,
  SignatureType,
  SignatureTypes,
} from '../../lib/constants'
import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'
import { getValueViaPath } from '@island.is/application/core'
import { InputFields } from '../../lib/types'
import * as styles from './Signatures.css'
import {
  getCommitteeAnswers,
  getRegularAnswers,
  getSignatureDefaultValues,
  getSingleSignatureMarkup,
  isCommitteeSignature,
  isRegularSignature,
} from '../../lib/utils'
import { z } from 'zod'
import { signatureInstitutionSchema } from '../../lib/dataSchema'
import { RemoveRegularSignature } from './RemoveRegularSignature'
import { useFormContext } from 'react-hook-form'
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
  const {
    debouncedOnUpdateApplicationHandler,
    application,
    applicationLoading,
  } = useApplication({
    applicationId,
  })

  const { setValue } = useFormContext()

  const handleInstitutionChange = (
    value: string,
    key: SignatureInstitutionKeys,
    signatureIndex?: number,
  ) => {
    const { signature, currentAnswers } =
      type === SignatureTypes.COMMITTEE
        ? getCommitteeAnswers(application.answers)
        : getRegularAnswers(application.answers)

    if (isRegularSignature(signature)) {
      const updatedRegularSignature = signature?.map((signature, index) => {
        if (index === signatureIndex) {
          const additionalSignature =
            application.answers.signatures?.additionalSignature?.regular
          const html = getSingleSignatureMarkup(
            {
              ...signature,
              [key]: value,
            },
            additionalSignature,
          )

          return {
            ...signature,
            [key]: value,
            html: html,
          }
        }

        return signature
      })

      const updatedSignatures = set(
        currentAnswers,
        InputFields.signature[type],
        updatedRegularSignature,
      )

      setValue(InputFields.signature[type], updatedRegularSignature)

      return updatedSignatures
    }

    if (isCommitteeSignature(signature)) {
      const chairman = signature.chairman
      const additionalSignature =
        application.answers.signatures?.additionalSignature?.committee
      const html = getSingleSignatureMarkup(
        {
          ...signature,
          [key]: value,
        },
        additionalSignature,
        chairman,
      )

      const updatedCommitteeSignature = set(
        currentAnswers,
        InputFields.signature[type],
        {
          ...signature,
          html: html,
          [key]: value,
        },
      )

      setValue(InputFields.signature[type], updatedCommitteeSignature)

      return updatedCommitteeSignature
    }

    return currentAnswers
  }

  if (applicationLoading) {
    return <SkeletonLoader repeat={5} height={OJOI_INPUT_HEIGHT} space={2} />
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
              debouncedOnUpdateApplicationHandler(
                handleInstitutionChange(
                  e.target.value,
                  'institution',
                  signatureIndex,
                ),
              )
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
              debouncedOnUpdateApplicationHandler(
                handleInstitutionChange(
                  date.toISOString(),
                  'date',
                  signatureIndex,
                ),
              )
            }
          />
        </Box>
        {signatureIndex !== undefined && (
          <RemoveRegularSignature
            applicationId={applicationId}
            signatureIndex={signatureIndex}
          />
        )}
      </Box>
    </Box>
  )
}
