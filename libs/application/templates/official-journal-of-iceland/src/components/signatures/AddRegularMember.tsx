import { Box, Button } from '@island.is/island-ui/core'
import { signatures } from '../../lib/messages/signatures'
import { useLocale } from '@island.is/localization'
import { useApplication } from '../../hooks/useUpdateApplication'
import { getValueViaPath } from '@island.is/application/core'
import { InputFields } from '../../lib/types'
import { regularSignatureSchema } from '../../lib/dataSchema'
import {
  MAXIMUM_REGULAR_SIGNATURE_MEMBER_COUNT,
  MINIMUM_REGULAR_SIGNATURE_MEMBER_COUNT,
} from '../../lib/constants'
import { getEmptyMember } from '../../lib/utils'
import set from 'lodash/set'

type Props = {
  applicationId: string
  signatureIndex: number
}

export const AddRegularMember = ({ applicationId, signatureIndex }: Props) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application, isLoading } = useApplication({
    applicationId,
  })

  const onAddMember = () => {
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
                members: [...(signature.members ?? []), getEmptyMember()],
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

  const getCurrentCount = () => {
    const currentAnswers = getValueViaPath(
      application.answers,
      InputFields.signature.regular,
    )

    const isRegularSignature = regularSignatureSchema.safeParse(currentAnswers)
    if (isRegularSignature.success) {
      const doesSignatureExist = isRegularSignature.data?.at(signatureIndex)

      if (doesSignatureExist !== undefined) {
        return doesSignatureExist.members?.length ?? 0
      }
    }

    return 0
  }

  const count = getCurrentCount()

  const isGreaterThanMinimum = count >= MINIMUM_REGULAR_SIGNATURE_MEMBER_COUNT
  const isLessThanMaximum = count < MAXIMUM_REGULAR_SIGNATURE_MEMBER_COUNT

  const isDisabled = !isGreaterThanMinimum || !isLessThanMaximum

  return (
    <Box marginTop={2}>
      <Button
        onClick={() => onAddMember()}
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
