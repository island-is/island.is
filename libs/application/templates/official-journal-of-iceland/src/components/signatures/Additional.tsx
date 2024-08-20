import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './Signatures.css'
import { useLocale } from '@island.is/localization'
import { signatures } from '../../lib/messages/signatures'
import { OJOIInputController } from '../input/OJOIInputController'

type Props = {
  applicationId: string
  name: string
}

export const AdditionalSignature = ({ applicationId, name }: Props) => {
  const { formatMessage: f } = useLocale()

  return (
    <Box className={styles.wrapper} marginTop={2}>
      <Text variant="h5" marginBottom={2}>
        {f(signatures.headings.additionalSignature)}
      </Text>
      <Box display="flex" justifyContent="flexStart">
        <OJOIInputController
          name={name}
          label={f(signatures.inputs.name.label)}
          applicationId={applicationId}
        />
      </Box>
    </Box>
  )
}
