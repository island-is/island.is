import {
  Box,
  FocusableBox,
  Text,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import LinkResolver from '../LinkResolver/LinkResolver'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

interface Props {
  onClick?: () => void
  title: string
  marginLeft?: ResponsiveSpace
  href: string
  isActive: boolean
}

export const SubTabItem: React.FC<Props> = ({
  title,
  onClick,
  marginLeft = 2,
  href,
  isActive,
}) => {
  return (
    <Box marginLeft={marginLeft}>
      <FocusableBox
        background={isActive ? 'blue400' : 'blue100'}
        borderRadius="standard"
        paddingX={3}
        paddingY={1}
        component={LinkResolver}
        id={href}
        href={href}
        onClick={onClick}
        justifyContent="center"
        alignItems="center"
      >
        <Text variant="small" color={isActive ? 'white' : 'black'}>
          {title}
        </Text>
      </FocusableBox>
    </Box>
  )
}
