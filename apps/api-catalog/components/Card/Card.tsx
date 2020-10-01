import React from 'react'
import { Box, Link } from '@island.is/island-ui/core'

import * as styles from './Card.treat';
import cn from 'classnames';

//import './service-card.scss'

export interface CardProps {
    title: string;
    slug: string;
    text: string;
}

function Card(props: CardProps) {
  return (
    <Link href={props.slug}>
      <Box
      display="flex"
      flexDirection="column"
      borderRadius="large"
      marginX={2}
      marginY={2}

      className={cn(styles.homeCard)}
      >
        <h3 className={cn(styles.cardTitle)}>{props.title}</h3>
        <p className={cn(styles.cardText)}>{props.text}</p>
      </Box>
    </Link>
  )
}

export default Card