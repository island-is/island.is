import { Box } from '@island.is/island-ui/core'
import * as styles from './Signatures.css'
import { useApplication } from '../../hooks/useUpdateApplication'
import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'
import { InputFields } from '../../lib/types'
import set from 'lodash/set'
import { getCommitteeAnswers, getEmptyMember } from '../../lib/utils'
import debounce from 'lodash/debounce'
import { DEBOUNCE_INPUT_TIMER } from '../../lib/constants'
import { memberItemSchema } from '../../lib/dataSchema'
import { SignatureMember } from './Member'
import * as z from 'zod'

type Props = {
  applicationId: string
  member?: z.infer<typeof memberItemSchema>
}

type MemberProperties = ReturnType<typeof getEmptyMember>

export const Chairman = ({ applicationId, member }: Props) => {
  const { formatMessage: f } = useLocale()
  const { application, debouncedOnUpdateApplicationHandler } = useApplication({
    applicationId,
  })

  const handleChairmanChange = (value: string, key: keyof MemberProperties) => {
    const { signature, currentAnswers } = getCommitteeAnswers(
      application.answers,
    )

    if (signature) {
      const updatedRegularSignature = {
        ...signature,
        chairman: { ...signature.chairman, [key]: value },
      }

      const updatedSignatures = set(
        currentAnswers,
        InputFields.signature.regular,
        updatedRegularSignature,
      )

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
          name={`signature.regular.member.above.chairman`}
          label={f(signatures.inputs.above.label)}
          defaultValue={member.above}
          onChange={(e) =>
            debouncedOnUpdateApplicationHandler(
              handleChairmanChange(e.target.value, 'above'),
            )
          }
        />
        <SignatureMember
          name={`signature.regular.member.after`}
          label={f(signatures.inputs.after.label)}
          defaultValue={member.after}
          onChange={(e) =>
            debouncedOnUpdateApplicationHandler(
              handleChairmanChange(e.target.value, 'after'),
            )
          }
        />
      </Box>
      <Box className={styles.inputWrapper}>
        <SignatureMember
          name={`signature.regular.member.name`}
          label={f(signatures.inputs.name.label)}
          defaultValue={member.name}
          onChange={(e) =>
            debouncedOnUpdateApplicationHandler(
              handleChairmanChange(e.target.value, 'name'),
            )
          }
        />
        <SignatureMember
          name={`signature.regular.member.below`}
          label={f(signatures.inputs.below.label)}
          defaultValue={member.below}
          onChange={(e) =>
            debouncedOnUpdateApplicationHandler(
              handleChairmanChange(e.target.value, 'below'),
            )
          }
        />
      </Box>
    </Box>
  )
}
