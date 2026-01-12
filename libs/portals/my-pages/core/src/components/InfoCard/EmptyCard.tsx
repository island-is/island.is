import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import * as styles from './InfoCard.css'

interface EmptyCardProps {
  title: string
  description?: string
  img?: string
}

export const EmptyCard = ({ title, description, img }: EmptyCardProps) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  return (
    <Box
      border="standard"
      borderRadius="large"
      borderColor="blue200"
      paddingTop={isMobile ? 2 : 'p2'}
      paddingBottom={isMobile ? 5 : 'p2'}
      paddingX={isMobile ? 2 : 3}
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
      flexDirection={isMobile ? 'columnReverse' : 'row'}
      height="full"
    >
      <Box marginRight={isMobile ? 0 : 3}>
        <Text
          variant="h3"
          marginBottom={isMobile ? 1 : 0}
          textAlign={isMobile ? 'center' : 'left'}
        >
          {title}
        </Text>
        <Text textAlign={isMobile ? 'center' : 'left'}>{description}</Text>
      </Box>
      <Box>
        <Box
          alt=""
          component="img"
          src={img ?? './assets/images/sofa.svg'}
          margin={isMobile ? 3 : 1}
          className={styles.smallImage}
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="full"
        />
      </Box>
    </Box>
  )
}

export default EmptyCard
