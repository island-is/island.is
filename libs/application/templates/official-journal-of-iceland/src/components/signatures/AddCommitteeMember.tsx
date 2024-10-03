import { Box, Button } from '@island.is/island-ui/core'
import { signatures } from '../../lib/messages/signatures'
import { useLocale } from '@island.is/localization'
import { useApplication } from '../../hooks/useUpdateApplication'
import { InputFields } from '../../lib/types'
import {
  MAXIMUM_COMMITTEE_SIGNATURE_MEMBER_COUNT,
  MINIMUM_COMMITTEE_SIGNATURE_MEMBER_COUNT,
} from '../../lib/constants'
import { getCommitteeAnswers, getEmptyMember } from '../../lib/utils'
import set from 'lodash/set'
import { useFormContext } from 'react-hook-form'

type Props = {
  applicationId: string
}

export const AddCommitteeMember = ({ applicationId }: Props) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application, isLoading } = useApplication({
    applicationId,
  })

  const { setValue } = useFormContext()

  const onAddCommitteeMember = () => {
    const { signature, currentAnswers } = getCommitteeAnswers(
      structuredClone(application.answers),
    )

    if (signature) {
      const withExtraMember = {
        ...signature,
        members: [...(signature.members ?? []), getEmptyMember()],
      }

      const updatedAnswers = set(
        currentAnswers,
        InputFields.signature.committee,
        withExtraMember,
      )

      setValue(InputFields.signature.committee, withExtraMember)

      updateApplication(updatedAnswers)
    }
  }

  const getCurrentCount = () => {
    const { signature } = getCommitteeAnswers(
      structuredClone(application.answers),
    )
    if (signature) {
      return signature.members?.length ?? 0
    }

    return 0
  }

  const count = getCurrentCount()

  const isGreaterThanMinimum = count >= MINIMUM_COMMITTEE_SIGNATURE_MEMBER_COUNT
  const isLessThanMaximum = count < MAXIMUM_COMMITTEE_SIGNATURE_MEMBER_COUNT

  const isDisabled = !isGreaterThanMinimum || !isLessThanMaximum

  return (
    <Box marginTop={2}>
      <Button
        onClick={() => onAddCommitteeMember()}
        loading={isLoading}
        disabled={isDisabled}
        variant="utility"
        size="small"
        icon="add"
        iconType="outline"
      >
        {f(signatures.buttons.addPerson)}
      </Button>
    </Box>
  )
}
