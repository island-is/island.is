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
  member?: z.infer<typeof memberItemSchema>
}

type MemberProperties = ReturnType<typeof getEmptyMember>

export const Chairman = ({ applicationId, member }: Props) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application } = useApplication({
    applicationId,
  })

  const handleChairmanChange = (value: string, key: keyof MemberProperties) => {
    const currentAnswers = structuredClone(application.answers)

    const signature = getValueViaPath(
      currentAnswers,
      InputFields.signature.regular,
    )

    const isCommitteeSignature = committeeSignatureSchema.safeParse(signature)

    if (isCommitteeSignature.success && isCommitteeSignature.data) {
      const updatedRegularSignature = {
        ...isCommitteeSignature.data,
        chairman: { ...isCommitteeSignature.data.chairman, [key]: value },
      }

      const updatedSignatures = set(
        currentAnswers,
        InputFields.signature.regular,
        updatedRegularSignature,
      )

      updateApplication(updatedSignatures)
    }
  }

  const debouncedMemberUpdate = debounce(
    handleChairmanChange,
    DEBOUNCE_INPUT_TIMER,
  )

  const onChairmanChangeHandler = (
    value: string,
    key: keyof MemberProperties,
  ) => {
    debouncedMemberUpdate.cancel()
    debouncedMemberUpdate(value, key)
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
          onChange={(e) => onChairmanChangeHandler(e.target.value, 'above')}
        />
        <SignatureMember
          name={`signature.regular.member.after`}
          label={f(signatures.inputs.after.label)}
          defaultValue={member.after}
          onChange={(e) => onChairmanChangeHandler(e.target.value, 'after')}
        />
      </Box>
      <Box className={styles.inputWrapper}>
        <SignatureMember
          name={`signature.regular.member.name`}
          label={f(signatures.inputs.name.label)}
          defaultValue={member.name}
          onChange={(e) => onChairmanChangeHandler(e.target.value, 'name')}
        />
        <SignatureMember
          name={`signature.regular.member.below`}
          label={f(signatures.inputs.below.label)}
          defaultValue={member.below}
          onChange={(e) => onChairmanChangeHandler(e.target.value, 'below')}
        />
      </Box>
    </Box>
  )
}
