import { Box, ButtonProps } from '@island.is/island-ui/core'

import * as styles from './FormFooter.css'

export type Props = {
  prevButton?: React.ReactElement<ButtonProps>
  nextButton?: React.ReactElement<ButtonProps>
}

export const FormFooter = ({ prevButton, nextButton }: Props) => {
  if (!prevButton && !nextButton) {
    return null
  }

  const align =
    prevButton && nextButton
      ? 'spaceBetween'
      : prevButton
      ? 'flexStart'
      : 'flexEnd'
  return (
    <Box className={styles.footerWrap}>
      <Box
        flexGrow={1}
        flexShrink={0}
        paddingY={4}
        display="flex"
        justifyContent={align}
      >
        {prevButton}
        {nextButton}
      </Box>
    </Box>
  )
}
