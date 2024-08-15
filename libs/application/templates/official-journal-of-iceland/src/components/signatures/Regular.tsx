import { Box, DatePicker, Input } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { InputFields } from '../../lib/types'
import { signatures } from '../../lib/messages/signatures'
import { useState } from 'react'
import {
  DEBOUNCE_INPUT_TIMER,
  DEFAULT_REGULAR_SIGNATURE_COUNT,
  DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT,
} from '../../lib/constants'
import { useLocale } from '@island.is/localization'
import { useApplication } from '../../hooks/useUpdateApplication'
import set from 'lodash/set'
import debounce from 'lodash/debounce'
import { getValueViaPath } from '@island.is/application/core'
import * as z from 'zod'
import { signatureSchema } from '../../lib/dataSchema'
import { getEmptyMember, getRegularSignature } from '../../lib/utils'

type SignatureSchema = z.infer<typeof signatureSchema>

type Props = {
  applicationId: string
}

type SignatureProperties =
  | 'institution'
  | 'date'
  | 'member'
  | 'html'
  | 'additionalSignature'
export const RegularSignature = ({ applicationId }: Props) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application } = useApplication({
    applicationId,
  })

  const [signatureCount, setSignatureCount] = useState(
    DEFAULT_REGULAR_SIGNATURE_COUNT,
  )
  const [memberCount, setMemberCount] = useState(
    DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT,
  )

  const initalState = useState<SignatureSchema[]>(
    Array.isArray(
      getValueViaPath(application.answers, InputFields.signature.regular),
    )
      ? (getValueViaPath(
          application.answers,
          InputFields.signature.regular,
        ) as SignatureSchema[])
      : getRegularSignature(signatureCount, memberCount),
  )

  console.log(initalState)

  const onUpdateSignature = (
    value: any,
    key: SignatureProperties,
    index: number,
    memberIndex?: number,
  ) => {
    switch (key) {
      case 'institution':
      case 'date': {
        const currentAnswers = structuredClone(application.answers)
      }
    }
  }

  const debouncedSignatureUpdate = debounce(
    onUpdateSignature,
    DEBOUNCE_INPUT_TIMER,
  )

  const onSignatureChangeHandler = (
    value: any,
    key: SignatureProperties,
    index: number,
  ) => {
    debouncedSignatureUpdate.cancel()

    debouncedSignatureUpdate(value, key, index)
  }

  return Array.from({ length: signatureCount }).map((_, index) => {
    return (
      <Box className={styles.signatureWrapper}>
        <Box className={styles.institution}>
          <Box flexGrow={1}>
            <Input
              name={`signature.regular.institution.${index}`}
              label={f(signatures.inputs.institution.label)}
              placeholder={f(signatures.inputs.institution.placeholder)}
              size="sm"
              backgroundColor="blue"
              onChange={(e) =>
                onSignatureChangeHandler(e.target.value, 'institution', index)
              }
            />
          </Box>
          <Box flexGrow={1}>
            <DatePicker
              name={`signature.regular.date.${index}`}
              label={f(signatures.inputs.date.label)}
              placeholderText={f(signatures.inputs.date.placeholder)}
              size="sm"
              backgroundColor="blue"
              handleChange={(date) =>
                onSignatureChangeHandler(date.toString(), 'date', index)
              }
            />
          </Box>
        </Box>
        <Box className={styles.wrapper}>
          {Array.from({ length: memberCount }).map((_, memberIndex) => {
            return (
              <Box className={styles.inputGroup}>
                <Box className={styles.inputWrapper}>
                  <Input
                    name={`signature.regular.member.above.${index}.${memberIndex}`}
                    label={f(signatures.inputs.above.label)}
                    size="sm"
                    backgroundColor="blue"
                  />
                  <Input
                    name={`signature.regular.member.after.${index}.${memberIndex}`}
                    label={f(signatures.inputs.after.label)}
                    size="sm"
                    backgroundColor="blue"
                  />
                </Box>
                <Box className={styles.inputWrapper}>
                  <Input
                    name={`signature.regular.member.name.${index}.${memberIndex}`}
                    label={f(signatures.inputs.name.label)}
                    size="sm"
                    backgroundColor="blue"
                  />
                  <Input
                    name={`signature.regular.member.below.${index}.${memberIndex}`}
                    label={f(signatures.inputs.below.label)}
                    size="sm"
                    backgroundColor="blue"
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    )
  })
}
