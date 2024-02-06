import { Box, Text } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { useFormatMessage } from '../../hooks'
import { InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { advert } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'

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
  const { f } = useFormatMessage(application)

  return (
    <Box className={styles.wrapper} marginTop={2}>
      <Text variant="h5" marginBottom={2}>
        {f(advert.general.additonalSignature)}
      </Text>
      <Box display="flex" justifyContent="flexStart">
        <InputController
          name={InputFields.advert.signature.additonalSignature}
          id={InputFields.advert.signature.additonalSignature}
          onChange={(event) => setSignature(event.target.value)}
          label={f(advert.inputs.signature.name.label)}
          defaultValue={signature}
          size="sm"
          backgroundColor="blue"
          error={
            errors &&
            getErrorViaPath(
              errors,
              InputFields.advert.signature.additonalSignature,
            )
          }
        />
      </Box>
    </Box>
  )
}
