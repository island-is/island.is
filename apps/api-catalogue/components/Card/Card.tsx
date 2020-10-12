import React from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import { Box, Link } from '@island.is/island-ui/core'

import * as styles from './Card.treat';
import { theme } from '@island.is/island-ui/theme';
import cn from 'classnames';

//import './service-card.scss'

export interface CardProps {
    title: string;
    slug: string;
    text: string;
}

function Card(props: CardProps) {

  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    //if (width < 771) {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <Link href={props.slug}>
      <Box
      display="flex"
      flexDirection="column"
      borderRadius="large"
      marginX={2}
      marginY={2}

      className={cn(isMobile ? styles.homeCardMobile : styles.homeCard)}
      >
        <h3 className={cn(styles.cardTitle)}>{props.title}</h3>
        <p className={cn(styles.cardText)}>{props.text}</p>
      </Box>
    </Link>
  )
}

export default Card