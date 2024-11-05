import { Box, Stack } from '@island.is/island-ui/core'
import * as styles from './Signatures.css'
import { useApplication } from '../../hooks/useUpdateApplication'
import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'
import { InputFields } from '../../lib/types'
import set from 'lodash/set'
import {
  getCommitteeAnswers,
  getEmptyMember,
  getSingleSignatureMarkup,
} from '../../lib/utils'
import { memberItemSchema } from '../../lib/dataSchema'
import { SignatureMember } from './Member'
import * as z from 'zod'
import { RemoveCommitteeMember } from './RemoveComitteeMember'
import { useFormContext } from 'react-hook-form'

type Props = {
  applicationId: string
  memberIndex: number
  member?: z.infer<typeof memberItemSchema>
}

type MemberProperties = ReturnType<typeof getEmptyMember>

export const CommitteeMember = ({
  applicationId,
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
    memberIndex: number,
  ) => {
    const { signature, currentAnswers } = getCommitteeAnswers(
      application.answers,
    )

    if (signature) {
      const additionalSignature =
        application.answers.signatures?.additionalSignature?.committee
      const members = signature?.members?.map((m, i) => {
        if (i === memberIndex) {
          return {
            ...m,
            [key]: value,
          }
        }

        return m
      })

      const html = getSingleSignatureMarkup(
        {
          ...signature,
          members,
        },
        additionalSignature,
        signature.chairman,
      )

      const updatedCommitteeSignature = {
        ...signature,
        members: members,
        html: html,
      }

      const updatedSignatures = set(
        currentAnswers,
        InputFields.signature.committee,
        updatedCommitteeSignature,
      )

      setValue(InputFields.signature.committee, updatedCommitteeSignature)

      return updatedSignatures
    }

    return currentAnswers
  }

  if (!member) {
    return null
  }

  return (
    <Stack space={2}>
      <SignatureMember
        name={`signature.committee.member.name.${memberIndex}`}
        label={f(signatures.inputs.name.label)}
        defaultValue={member.name}
        onChange={(e) =>
          debouncedOnUpdateApplicationHandler(
            handleMemberChange(e.target.value, 'name', memberIndex),
          )
        }
      />
      <Box display="flex" columnGap={2}>
        <Box flexGrow={1}>
          <SignatureMember
            name={`signature.committee.member.below.${memberIndex}`}
            label={f(signatures.inputs.below.label)}
            defaultValue={member.below}
            onChange={(e) =>
              debouncedOnUpdateApplicationHandler(
                handleMemberChange(e.target.value, 'below', memberIndex),
              )
            }
          />
        </Box>

        <RemoveCommitteeMember
          applicationId={applicationId}
          memberIndex={memberIndex}
        />
      </Box>
    </Stack>
  )
}
