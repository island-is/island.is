import { Box, Button, Text } from '@island.is/island-ui/core'
import * as styles from './ActionBox.css'

export interface Props {
  heading: string
  text: string
  cta: {
    label: string
    onClick?: () => void
    disabled?: boolean
  }
}

export const ActionBox = ({ heading, text, cta }: Props) => {
  return (
    <Box
      id="write-review"
      display="flex"
      flexDirection={['column', 'column', 'row', 'row']}
      justifyContent={[
        'flexStart',
        'flexStart',
        'spaceBetween',
        'spaceBetween',
      ]}
      alignItems={['flexStart', 'flexStart', 'center', 'center']}
      borderColor="blue200"
      borderRadius="large"
      borderWidth="standard"
      background="white"
      paddingX={[3, 3, 4, 4]}
      paddingY={3}
      columnGap={3}
    >
      <Box display="flex" flexDirection="column">
        <Text variant="h3">{heading}</Text>
        <Text paddingTop={1}>{text}</Text>
      </Box>
      <Box
        paddingTop={[3, 3, 0, 0]}
        display="flex"
        alignItems="center"
        className={styles.button}
      >
        <Button
          nowrap
          fluid
          size="small"
          onClick={cta.onClick}
          disabled={cta.disabled}
        >
          {cta.label}
        </Button>
      </Box>
    </Box>
  )
}

export default ActionBox
