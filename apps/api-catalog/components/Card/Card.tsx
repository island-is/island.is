import React from 'react'
import { Box, Link, Typography } from '@island.is/island-ui/core'

//import './service-card.scss'

export interface CardInformation {
    title: string;
    slug: string;
}

export interface CardProps {
  card: CardInformation
}

function Card({ title, slug }) {
  return (
    <Link href={slug}>
      <Box
      display="flex"
      boxShadow="large"
      borderRadius="large"
      justifyContent="center"
      alignItems="center"
      marginX={2}

      className="home-card"
      >
        <Typography variant="cardCategoryTitle">{title}</Typography>
      </Box>
    </Link>
  )
}

export default Card