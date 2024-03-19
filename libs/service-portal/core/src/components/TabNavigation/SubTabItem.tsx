import { Box, FocusableBox, Text } from '@island.is/island-ui/core'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as styles from './SubTabItem.css'
import cn from 'classnames'

interface Props {
  onClick?: () => void
  title: string
  href: string
  isActive: boolean
}

export const SubTabItem: React.FC<Props> = ({
  onClick,
  title,
  href,
  isActive,
}: Props) => {
  return (
    <Box
      className={cn(styles.tabWrapper, {
        [styles.active]: isActive,
      })}
      component="li"
    >
      <FocusableBox
        borderRadius="standard"
        component={LinkResolver}
        className={cn(styles.tab)}
        justifyContent="center"
        alignItems="center"
        id={href}
        href={href}
        onClick={onClick}
      >
        <Box
          component="p"
          className={cn(styles.text, {
            [styles.activeText]: isActive,
          })}
        >
          {title}
        </Box>
      </FocusableBox>
    </Box>
  )
}
