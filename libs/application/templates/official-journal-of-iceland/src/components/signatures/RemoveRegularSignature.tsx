import { Box, Button } from '@island.is/island-ui/core'
import { useApplication } from '../../hooks/useUpdateApplication'
import { getValueViaPath } from '@island.is/application/core'
import { InputFields } from '../../lib/types'
import { isRegularSignature } from '../../lib/utils'
import set from 'lodash/set'
import { useFormContext } from 'react-hook-form'

type Props = {
  applicationId: string
  signatureIndex: number
}

export const RemoveRegularSignature = ({
  applicationId,
  signatureIndex,
}: Props) => {
  const { updateApplication, application } = useApplication({
    applicationId,
  })

  const { setValue } = useFormContext()

  const onRemove = () => {
    const currentAnswers = structuredClone(application.answers)
    const signature = getValueViaPath(
      currentAnswers,
      InputFields.signature.regular,
    )

    if (isRegularSignature(signature)) {
      const updatedRegularSignature = signature?.filter(
        (_, index) => index !== signatureIndex,
      )

      const updatedSignatures = set(
        currentAnswers,
        InputFields.signature.regular,
        updatedRegularSignature,
      )

      setValue(InputFields.signature.regular, updatedRegularSignature)

      updateApplication(updatedSignatures)
    }
  }

  return (
    <Box display="flex" flexDirection="column" justifyContent="flexEnd">
      <Button
        variant="utility"
        size="small"
        icon="trash"
        iconType="outline"
        disabled={signatureIndex === 0}
        onClick={onRemove}
      />
    </Box>
  )
}
