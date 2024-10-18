import { Box } from '@island.is/island-ui/core'
import * as styles from './Signatures.css'
import { useApplication } from '../../hooks/useUpdateApplication'
import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'
import { InputFields } from '../../lib/types'
import set from 'lodash/set'
import {
  getEmptyMember,
  getRegularAnswers,
  getSignaturesMarkup,
  getSingleSignatureMarkup,
} from '../../lib/utils'
import { memberItemSchema } from '../../lib/dataSchema'
import { SignatureMember } from './Member'
import * as z from 'zod'
import { RemoveRegularMember } from './RemoveRegularMember'
import { useFormContext } from 'react-hook-form'

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
  const { debouncedOnUpdateApplicationHandler, application } = useApplication({
    applicationId,
  })

  const { setValue } = useFormContext()

  const handleMemberChange = (
    value: string,
    key: keyof MemberProperties,
    si: number,
    mi: number,
  ) => {
    const { signature, currentAnswers } = getRegularAnswers(application.answers)

    if (signature) {
      const updatedRegularSignature = signature.map((s, index) => {
        if (index === si) {
          const additionalSignature =
            application.answers.signatures?.additionalSignature?.regular
          const members = s.members?.map((member, memberIndex) => {
            if (memberIndex === mi) {
              return {
                ...member,
                [key]: value,
              }
            }

            return member
          })

          const html = getSingleSignatureMarkup(
            {
              ...s,
              members: members,
            },
            additionalSignature,
          )

          return {
            ...s,
            html: html,
            members: members,
          }
        }

        return s
      })

      const updatedSignatures = set(
        currentAnswers,
        InputFields.signature.regular,
        updatedRegularSignature,
      )

      setValue(InputFields.signature.regular, updatedRegularSignature)

      return updatedSignatures
    }

    return currentAnswers
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
            debouncedOnUpdateApplicationHandler(
              handleMemberChange(
                e.target.value,
                'above',
                signatureIndex,
                memberIndex,
              ),
            )
          }
        />
        <SignatureMember
          name={`signature.regular.member.name.${signatureIndex}.${memberIndex}`}
          label={f(signatures.inputs.name.label)}
          defaultValue={member.name}
          onChange={(e) =>
            debouncedOnUpdateApplicationHandler(
              handleMemberChange(
                e.target.value,
                'name',
                signatureIndex,
                memberIndex,
              ),
            )
          }
        />
      </Box>
      <Box className={styles.inputWrapper}>
        <SignatureMember
          name={`signature.regular.member.after.${signatureIndex}.${memberIndex}`}
          label={f(signatures.inputs.after.label)}
          defaultValue={member.after}
          onChange={(e) =>
            debouncedOnUpdateApplicationHandler(
              handleMemberChange(
                e.target.value,
                'after',
                signatureIndex,
                memberIndex,
              ),
            )
          }
        />
        <SignatureMember
          name={`signature.regular.member.below.${signatureIndex}.${memberIndex}`}
          label={f(signatures.inputs.below.label)}
          defaultValue={member.below}
          onChange={(e) =>
            debouncedOnUpdateApplicationHandler(
              handleMemberChange(
                e.target.value,
                'below',
                signatureIndex,
                memberIndex,
              ),
            )
          }
        />
      </Box>
      <RemoveRegularMember
        key={`signature.${signatureIndex}.remove.${memberIndex}`}
        applicationId={applicationId}
        signatureIndex={signatureIndex}
        memberIndex={memberIndex}
      />
    </Box>
  )
}
