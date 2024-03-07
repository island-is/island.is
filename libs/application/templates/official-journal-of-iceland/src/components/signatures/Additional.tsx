import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './Signatures.css'
import { InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'

type Props = Pick<OJOIFieldBaseProps, 'application' | 'errors'> & {
  signature: string
  setSignature: (state: string) => void
}

export const AdditionalSignature = ({
  application,
  errors,
  signature,
  setSignature,
}: Props) => {
  const { formatMessage: f } = useLocale()

  return (
    <Box className={styles.wrapper} marginTop={2}>
      <Text variant="h5" marginBottom={2}>
        {f(signatures.headings.additionalSignature)}
      </Text>
      <Box display="flex" justifyContent="flexStart">
        <InputController
          name={InputFields.signature.additonalSignature}
          id={InputFields.signature.additonalSignature}
          onChange={(event) => setSignature(event.target.value)}
          label={f(signatures.inputs.name.label)}
          defaultValue={signature}
          size="sm"
          backgroundColor="blue"
          error={
            errors &&
            getErrorViaPath(errors, InputFields.signature.additonalSignature)
          }
        />
      </Box>
    </Box>
  )
}
