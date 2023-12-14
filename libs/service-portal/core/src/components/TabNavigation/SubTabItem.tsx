import { Box, Button, ResponsiveSpace } from '@island.is/island-ui/core'
import LinkResolver from '../LinkResolver/LinkResolver'

interface Props {
  onClick?: () => void
  colorScheme: 'default' | 'light'
  title: string
  marginLeft?: ResponsiveSpace
  href: string
}

export const SubTabItem: React.FC<Props> = ({
  onClick,
  colorScheme,
  title,
  marginLeft = 2,
  href,
}) => {
  return (
    <Box marginLeft={marginLeft}>
      <LinkResolver href={href}>
        <Button
          as="span"
          type="button"
          aria-label={title}
          size="small"
          colorScheme={colorScheme}
          onClick={onClick}
        >
          {title}
        </Button>
      </LinkResolver>
    </Box>
  )
}
