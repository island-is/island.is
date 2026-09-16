import {
  Box,
  Text,
  problemTemplateContainer,
  problemTemplateImg,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { LinkButton } from '@island.is/portals/my-pages/core'
import { useWindowSize } from 'react-use'

interface Props {
  title: string
  text: string
  linkUrl: string
  linkText: string
  imageSrc: string
}

export const RedirectCard = ({
  title,
  text,
  linkUrl,
  linkText,
  imageSrc,
}: Props) => {
  const { width } = useWindowSize()
  const isStacked = width == null || width < theme.breakpoints.lg

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={['columnReverse', 'columnReverse', 'columnReverse', 'row']}
      columnGap={[2, 4, 8, 8, 12]}
      rowGap={[7, 7, 7, 0]}
      paddingY={[5, 8]}
      paddingX={[3, 3, 5, 10]}
      className={problemTemplateContainer({ blue: true })}
    >
      <Box
        display="flex"
        flexDirection="column"
        rowGap={2}
        alignItems={['center', 'center', 'center', 'flexStart']}
        justifyContent={['center', 'center', 'center', 'flexStart']}
      >
        <Text
          variant="h3"
          as="h2"
          color="dark400"
          textAlign={isStacked ? 'center' : 'left'}
        >
          {title}
        </Text>
        <Text whiteSpace="preLine" textAlign={isStacked ? 'center' : 'left'}>
          {text}
        </Text>
        <Box marginTop={2}>
          <LinkButton
            to={linkUrl}
            text={linkText}
            variant="primary"
            size="small"
            icon="open"
          />
        </Box>
      </Box>
      <img src={imageSrc} alt="" className={problemTemplateImg} />
    </Box>
  )
}
