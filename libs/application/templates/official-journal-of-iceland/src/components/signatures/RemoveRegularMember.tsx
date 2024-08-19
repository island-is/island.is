import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useApplication } from '../../hooks/useUpdateApplication'
import { getValueViaPath } from '@island.is/application/core'
import { InputFields } from '../../lib/types'
import { regularSignatureSchema } from '../../lib/dataSchema'
import { MINIMUM_REGULAR_SIGNATURE_MEMBER_COUNT } from '../../lib/constants'
import set from 'lodash/set'
import * as styles from './Signatures.css'

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

  const onRemoveMember = () => {
    const currentAnswers = structuredClone(application.answers)
    const signature = getValueViaPath(
      currentAnswers,
      InputFields.signature.regular,
    )

    const isRegularSignature = regularSignatureSchema.safeParse(signature)

    if (isRegularSignature.success) {
      const doesSignatureExist = isRegularSignature.data?.at(signatureIndex)

      if (doesSignatureExist !== undefined) {
        const updatedRegularSignature = isRegularSignature.data?.map(
          (signature, index) => {
            if (index === signatureIndex) {
              return {
                ...signature,
                members: signature.members?.filter(
                  (_, mi) => mi !== memberIndex,
                ),
              }
            }

            return signature
          },
        )

        const updatedAnswers = set(
          currentAnswers,
          InputFields.signature.regular,
          updatedRegularSignature,
        )

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
