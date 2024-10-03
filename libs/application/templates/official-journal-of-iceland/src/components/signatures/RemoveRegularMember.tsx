import { Box, Button } from '@island.is/island-ui/core'
import { useApplication } from '../../hooks/useUpdateApplication'
import { InputFields } from '../../lib/types'
import { MINIMUM_REGULAR_SIGNATURE_MEMBER_COUNT } from '../../lib/constants'
import set from 'lodash/set'
import * as styles from './Signatures.css'
import { getRegularAnswers } from '../../lib/utils'
import { useFormContext } from 'react-hook-form'

type Props = {
  applicationId: string
  signatureIndex: number
  memberIndex: number
}

export const RemoveRegularMember = ({
  applicationId,
  signatureIndex,
  memberIndex,
}: Props) => {
  const { updateApplication, application, isLoading } = useApplication({
    applicationId,
  })

  const { setValue } = useFormContext()

  const onRemoveMember = () => {
    const { currentAnswers, signature } = getRegularAnswers(application.answers)

    if (signature) {
      const doesSignatureExist = signature.at(signatureIndex)

      if (doesSignatureExist !== undefined) {
        const updatedRegularSignature = signature.map((signature, index) => {
          if (index === signatureIndex) {
            return {
              ...signature,
              members: signature.members?.filter((_, mi) => mi !== memberIndex),
            }
          }

          return signature
        })

        const updatedAnswers = set(
          currentAnswers,
          InputFields.signature.regular,
          updatedRegularSignature,
        )

        setValue(InputFields.signature.regular, updatedRegularSignature)

        updateApplication(updatedAnswers)
      }
    }
  }

  return (
    <Box className={styles.removeInputGroup}>
      <Button
        disabled={memberIndex < MINIMUM_REGULAR_SIGNATURE_MEMBER_COUNT}
        loading={isLoading}
        variant="utility"
        icon="trash"
        iconType="outline"
        onClick={() => onRemoveMember()}
      />
    </Box>
  )
}
