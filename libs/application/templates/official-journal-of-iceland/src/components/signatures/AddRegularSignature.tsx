import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'
import { Box, Button } from '@island.is/island-ui/core'
import { useApplication } from '../../hooks/useUpdateApplication'
import { getValueViaPath } from '@island.is/application/core'
import { InputFields } from '../../lib/types'
import {
  getRegularAnswers,
  getRegularSignature,
  isRegularSignature,
} from '../../lib/utils'
import set from 'lodash/set'
import {
  DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT,
  MAXIMUM_REGULAR_SIGNATURE_COUNT,
  ONE,
} from '../../lib/constants'
import { useFormContext } from 'react-hook-form'

type Props = {
  applicationId: string
}

export const AddRegularSignature = ({ applicationId }: Props) => {
  const { formatMessage: f } = useLocale()
  const { updateApplication, application, isLoading } = useApplication({
    applicationId,
  })

  const { setValue } = useFormContext()

  const onAddInstitution = () => {
    const { signature, currentAnswers } = getRegularAnswers(
      structuredClone(application.answers),
    )

    if (signature) {
      const newSignature = getRegularSignature(
        ONE,
        DEFAULT_REGULAR_SIGNATURE_MEMBER_COUNT,
      )?.pop()

      const updatedSignature = [...signature, newSignature]

      const updatedAnswers = set(
        currentAnswers,
        InputFields.signature.regular,
        updatedSignature,
      )

      setValue(InputFields.signature.regular, updatedSignature)

      updateApplication(updatedAnswers)
    }
  }

  const getCount = () => {
    const currentAnswers = structuredClone(application.answers)
    const signature = getValueViaPath(
      currentAnswers,
      InputFields.signature.regular,
    )

    if (isRegularSignature(signature)) {
      return signature?.length ?? 0
    }

    return 0
  }

  const count = getCount()

  return (
    <Box marginTop={2}>
      <Button
        disabled={count >= MAXIMUM_REGULAR_SIGNATURE_COUNT}
        loading={isLoading}
        onClick={onAddInstitution}
        variant="utility"
        size="small"
        icon="add"
        iconType="outline"
      >
        {f(signatures.buttons.addInstitution)}
      </Button>
    </Box>
  )
}
