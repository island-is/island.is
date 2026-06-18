import { useLocale } from '@island.is/localization'
import * as styles from './ExampleCustomComponent.css'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

interface Props {
  /**
   * Server-resolved component id. Dynamic `(application, user) => string` ids
   * are resolved when the SDF screen DTO is built, so the component always
   * receives a plain string (or `undefined`).
   */
  id?: string
  someData?: Array<string>
}

export const ExampleCustomComponent = ({ id, someData }: Props) => {
  const { formatMessage } = useLocale()
  if (!someData) return null

  return (
    <Box
      id={id}
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
