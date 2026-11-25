import { useToggle } from 'react-use'

import { Box, FocusableBox, Text } from '@island.is/island-ui/core'

import * as styles from './Header.css'

interface Props {
  href: string
  title: string
  imgSrc: string
  imgAlt?: string
}

export const ShortcutCard = ({ href, title, imgSrc, imgAlt }: Props) => {
  const [isHovered, toggleIsHovered] = useToggle(false)

  return (
    <FocusableBox
      href={href}
      borderRadius="standard"
      borderWidth="standard"
      borderColor={isHovered ? 'purple200' : 'transparent'}
      background="backgroundBrandSecondaryMinimal"
      display="flex"
      alignItems="center"
      onMouseOver={toggleIsHovered}
      onMouseOut={toggleIsHovered}
      className={styles.shortcut}
    >
      <Box justifyContent="center" alignItems={'center'}>
        <img src={imgSrc} alt={imgAlt ?? ''} className={styles.headerImage} />
      </Box>
      <Text color="foregroundBrandSecondaryContrast" variant="h5">
        {title}
      </Text>
    </FocusableBox>
  )
}
