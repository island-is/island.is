import { Box, Button } from '@island.is/island-ui/core'
import { signatures } from '../../lib/messages/signatures'
import { useLocale } from '@island.is/localization'
import { useApplication } from '../../hooks/useUpdateApplication'
import { InputFields } from '../../lib/types'
import {
  MAXIMUM_REGULAR_SIGNATURE_MEMBER_COUNT,
  MINIMUM_REGULAR_SIGNATURE_MEMBER_COUNT,
} from '../../lib/constants'
import { getEmptyMember, getRegularAnswers } from '../../lib/utils'
import set from 'lodash/set'
import { useFormContext } from 'react-hook-form'

type Props = {
  applicationId: string
  signatureIndex: number
}

export const AddRegularMember = ({ applicationId, signatureIndex }: Props) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application, isLoading } = useApplication({
    applicationId,
  })

  const { setValue } = useFormContext()

  const onAddMember = () => {
    const { signature, currentAnswers } = getRegularAnswers(
      structuredClone(application.answers),
    )

    if (signature) {
      const doesSignatureExist = signature.at(signatureIndex)

      if (doesSignatureExist !== undefined) {
        const updatedRegularSignature = signature.map((signature, index) => {
          if (index === signatureIndex) {
            return {
              ...signature,
              members: [...(signature.members ?? []), getEmptyMember()],
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

  const getCurrentCount = () => {
    const { signature } = getRegularAnswers(
      structuredClone(application.answers),
    )
    if (signature) {
      const doesSignatureExist = signature?.at(signatureIndex)

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
