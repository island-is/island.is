import { Box, Button } from '@island.is/island-ui/core'
import { useApplication } from '../../hooks/useUpdateApplication'
import { InputFields } from '../../lib/types'
import { MINIMUM_COMMITTEE_SIGNATURE_MEMBER_COUNT } from '../../lib/constants'
import set from 'lodash/set'
import * as styles from './Signatures.css'
import { getCommitteeAnswers, isCommitteeSignature } from '../../lib/utils'
import { useFormContext } from 'react-hook-form'

type Props = {
  applicationId: string
  memberIndex: number
}

export const RemoveCommitteeMember = ({
  applicationId,
  memberIndex,
}: Props) => {
  const { updateApplication, application, isLoading } = useApplication({
    applicationId,
  })

  const { setValue } = useFormContext()

  const onRemoveMember = () => {
    const { currentAnswers, signature } = getCommitteeAnswers(
      application.answers,
    )

    if (isCommitteeSignature(signature)) {
      const updatedCommitteeSignature = {
        ...signature,
        members: signature.members?.filter((_, mi) => mi !== memberIndex),
      }

      const updatedAnswers = set(
        currentAnswers,
        InputFields.signature.committee,
        updatedCommitteeSignature,
      )

      setValue(InputFields.signature.committee, updatedCommitteeSignature)

      updateApplication(updatedAnswers)
    }
  }

  return (
    <Box className={styles.removeInputGroup}>
      <Button
        disabled={memberIndex < MINIMUM_COMMITTEE_SIGNATURE_MEMBER_COUNT}
        loading={isLoading}
        variant="utility"
        icon="trash"
        iconType="outline"
        onClick={() => onRemoveMember()}
      />
    </Box>
  )
}
