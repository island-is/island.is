import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import * as styles from './ExampleCustomComponent.css'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { resolveFieldId } from '@island.is/application/core'

interface Props {
  field: {
    props: {
      someData: Array<string>
    }
  }
}

export const ExampleCustomComponent = ({
  field,
  application,
}: Props & FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { someData } = field.props
  if (!someData) return null
  const resolvedId = resolveFieldId({ id: field.id }, application)

  return (
    <Box
      id={resolvedId}
      className={styles.boldNames}
      border="standard"
      borderRadius="large"
      background="blue100"
    >
      <Box display="flex" justifyContent="spaceBetween" margin={2}>
        <Text variant="h3">{formatMessage(m.customComponentAbout)}</Text>
      </Box>
      <Box padding={2} display="flex" justifyContent="spaceBetween">
        {someData.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </Box>
    </Box>
  )
}
