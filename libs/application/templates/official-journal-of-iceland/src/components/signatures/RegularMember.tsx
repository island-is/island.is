import { Box } from '@island.is/island-ui/core'
import * as styles from './Signatures.css'
import { useApplication } from '../../hooks/useUpdateApplication'
import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'
import { InputFields } from '../../lib/types'
import set from 'lodash/set'
import { getValueViaPath } from '@island.is/application/core'
import { getEmptyMember } from '../../lib/utils'
import debounce from 'lodash/debounce'
import { DEBOUNCE_INPUT_TIMER } from '../../lib/constants'
import { memberItemSchema, regularSignatureSchema } from '../../lib/dataSchema'
import { SignatureMember } from './Member'
import * as z from 'zod'

type Props = {
  applicationId: string
  signatureIndex: number
  memberIndex: number
  member?: z.infer<typeof memberItemSchema>
}

type MemberProperties = ReturnType<typeof getEmptyMember>

export const RegularMember = ({
  applicationId,
  signatureIndex,
  memberIndex,
  member,
}: Props) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application } = useApplication({
    applicationId,
  })

  const handleMemberChange = (
    value: string,
    key: keyof MemberProperties,
    signatureIndex: number,
    memberIndex: number,
  ) => {
    const currentAnswers = structuredClone(application.answers)

    const signature = getValueViaPath(
      currentAnswers,
      InputFields.signature.regular,
    )

    const isRegularSignature = regularSignatureSchema.safeParse(signature)

    if (isRegularSignature.success && isRegularSignature.data) {
      const updatedRegularSignature = isRegularSignature.data.map(
        (signature, index) => {
          if (index === signatureIndex) {
            return {
              ...signature,
              members: signature.members?.map((member, mi) => {
                if (memberIndex === mi) {
                  return {
                    ...member,
                    [key]: value,
                  }
                }

                return member
              }),
            }
          }

          return signature
        },
      )

      const updatedSignatures = set(
        currentAnswers,
        InputFields.signature.regular,
        updatedRegularSignature,
      )

      updateApplication(updatedSignatures)
    }
  }

  const debouncedMemberUpdate = debounce(
    handleMemberChange,
    DEBOUNCE_INPUT_TIMER,
  )

  const onMemberChangeHandler = (
    value: string,
    key: keyof MemberProperties,
    signatureIndex: number,
    memberIndex: number,
  ) => {
    debouncedMemberUpdate.cancel()
    debouncedMemberUpdate(value, key, signatureIndex, memberIndex)
  }

  if (!member) {
    return null
  }

  return (
    <Box className={styles.inputGroup}>
      <Box className={styles.inputWrapper}>
        <SignatureMember
          name={`signature.regular.member.above.${signatureIndex}.${memberIndex}`}
          label={f(signatures.inputs.above.label)}
          defaultValue={member.above}
          onChange={(e) =>
            onMemberChangeHandler(
              e.target.value,
              'above',
              signatureIndex,
              memberIndex,
            )
          }
        />
        <SignatureMember
          name={`signature.regular.member.after.${signatureIndex}.${memberIndex}`}
          label={f(signatures.inputs.after.label)}
          defaultValue={member.after}
          onChange={(e) =>
            onMemberChangeHandler(
              e.target.value,
              'after',
              signatureIndex,
              memberIndex,
            )
          }
        />
      </Box>
      <Box className={styles.inputWrapper}>
        <SignatureMember
          name={`signature.regular.member.name.${signatureIndex}.${memberIndex}`}
          label={f(signatures.inputs.name.label)}
          defaultValue={member.name}
          onChange={(e) =>
            onMemberChangeHandler(
              e.target.value,
              'name',
              signatureIndex,
              memberIndex,
            )
          }
        />
        <SignatureMember
          name={`signature.regular.member.below.${signatureIndex}.${memberIndex}`}
          label={f(signatures.inputs.below.label)}
          defaultValue={member.below}
          onChange={(e) =>
            onMemberChangeHandler(
              e.target.value,
              'below',
              signatureIndex,
              memberIndex,
            )
          }
        />
      </Box>
    </Box>
  )
}
