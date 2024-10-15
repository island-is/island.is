import { Box, Text } from '@island.is/island-ui/core'
import { useApplication } from '../../hooks/useUpdateApplication'
import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'
import { InputFields } from '../../lib/types'
import {
  getCommitteeAnswers,
  getEmptyMember,
  getSingleSignatureMarkup,
} from '../../lib/utils'
import { memberItemSchema } from '../../lib/dataSchema'
import { SignatureMember } from './Member'
import set from 'lodash/set'
import * as styles from './Signatures.css'
import * as z from 'zod'
import { useFormContext } from 'react-hook-form'

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

  const { setValue } = useFormContext()

  const handleChairmanChange = (value: string, key: keyof MemberProperties) => {
    const { signature, currentAnswers } = getCommitteeAnswers(
      application.answers,
    )

    if (signature) {
      const additionalSignature =
        application.answers.signatures?.additionalSignature?.committee
      const chairman = { ...signature.chairman, [key]: value }

      const html = getSingleSignatureMarkup(
        {
          ...signature,
        },
        additionalSignature,
        chairman,
      )

      const updatedCommitteeSignature = {
        ...signature,
        chairman: chairman,
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
    <Box className={styles.wrapper}>
      <Text variant="h5" marginBottom={2}>
        {f(signatures.headings.chairman)}
      </Text>
      <Box className={styles.inputGroup}>
        <Box className={styles.inputWrapper}>
          <SignatureMember
            name={`signature.comittee.member.above.chairman`}
            label={f(signatures.inputs.above.label)}
            defaultValue={member.above}
            onChange={(e) =>
              debouncedOnUpdateApplicationHandler(
                handleChairmanChange(e.target.value, 'above'),
              )
            }
          />
          <SignatureMember
            name={`signature.comittee.member.name`}
            label={f(signatures.inputs.name.label)}
            defaultValue={member.name}
            onChange={(e) =>
              debouncedOnUpdateApplicationHandler(
                handleChairmanChange(e.target.value, 'name'),
              )
            }
          />
        </Box>
        <Box className={styles.inputWrapper}>
          <SignatureMember
            name={`signature.comittee.member.after`}
            label={f(signatures.inputs.after.label)}
            defaultValue={member.after}
            onChange={(e) =>
              debouncedOnUpdateApplicationHandler(
                handleChairmanChange(e.target.value, 'after'),
              )
            }
          />
          <SignatureMember
            name={`signature.comittee.member.below`}
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
    </Box>
  )
}
