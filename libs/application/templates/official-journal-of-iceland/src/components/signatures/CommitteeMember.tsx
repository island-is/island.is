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
import {
  committeeSignatureSchema,
  memberItemSchema,
} from '../../lib/dataSchema'
import { SignatureMember } from './Member'
import * as z from 'zod'

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
  const { updateApplication, application } = useApplication({
    applicationId,
  })

  const handleMemberChange = (
    value: string,
    key: keyof MemberProperties,
    memberIndex: number,
  ) => {
    const currentAnswers = structuredClone(application.answers)

    const signature = getValueViaPath(
      currentAnswers,
      InputFields.signature.committee,
    )

    const isCommitteeSignature = committeeSignatureSchema.safeParse(signature)

    if (isCommitteeSignature.success && isCommitteeSignature.data) {
      const updatedCommitteeSignature = {
        ...isCommitteeSignature.data,
        members: isCommitteeSignature?.data?.members?.map((m, i) => {
          if (i === memberIndex) {
            return {
              ...m,
              [key]: value,
            }
          }

          return m
        }),
      }

      const updatedSignatures = set(
        currentAnswers,
        InputFields.signature.committee,
        updatedCommitteeSignature,
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
    memberIndex: number,
  ) => {
    debouncedMemberUpdate.cancel()
    debouncedMemberUpdate(value, key, memberIndex)
  }

  if (!member) {
    return null
  }

  return (
    <Box className={styles.inputGroup}>
      <Box className={styles.inputWrapper}>
        <SignatureMember
          name={`signature.committee.member.name.${memberIndex}`}
          label={f(signatures.inputs.name.label)}
          defaultValue={member.name}
          onChange={(e) =>
            onMemberChangeHandler(e.target.value, 'name', memberIndex)
          }
        />
        <SignatureMember
          name={`signature.committee.member.below.${memberIndex}`}
          label={f(signatures.inputs.below.label)}
          defaultValue={member.below}
          onChange={(e) =>
            onMemberChangeHandler(e.target.value, 'below', memberIndex)
          }
        />
      </Box>
    </Box>
  )
}
