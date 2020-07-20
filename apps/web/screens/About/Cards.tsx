/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
import {
  Typography,
  Box,
  Stack,
  Tiles,
  Icon,
} from '@island.is/island-ui/core'

export interface CardsProps {
  title: string
  cards: CardProps[]
}

const Cards: FC<CardsProps> = ({ title, cards }) => (
  <>
    <Box paddingBottom={6}>
      <Typography variant="h2" as="h2">
        {title}
      </Typography>
    </Box>
    <Tiles columns={[1, 1, 1, 2]} space={4}>
      {cards.map((card, i) => (
        <Card key={i} {...card} />
      ))}
    </Tiles>
  </>
)

interface CardProps {
  title: string
  body: string
  link: string
  href: string
}

const Card: FC<CardProps> = ({ title, body, link, href }) => {
  return (
    <Box background="white" padding={5}>
      <Stack space={2}>
        <Typography variant="h3" as="h3">
          {title}
        </Typography>
        <Typography variant="p" as="p">
          {body}
        </Typography>
        <Typography variant="h4" as="span" color="blue400" links>
          <Link href={href}>
            <a>
              {link} <Icon type="arrowRight" width="15" height="15" />
            </a>
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}

export default Cards
