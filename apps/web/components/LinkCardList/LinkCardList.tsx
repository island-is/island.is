/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
import { Button, Typography, Box, Tiles } from '@island.is/island-ui/core'

export interface LinkCardProps {
  title: string
  body: string
  link: string
  linkText: string
}

export interface LinkCardListProps {
  title: string
  cards: LinkCardProps[]
}

export const LinkCardList: FC<LinkCardListProps> = ({ title, cards }) => (
  <>
    <Box paddingBottom={6}>
      <Typography variant="h2" as="h2">
        {title}
      </Typography>
    </Box>
    <Tiles columns={[1, 1, 1, 1, 2]} space={4}>
      {cards.map((card, i) => (
        <LinkCard key={i} {...card} />
      ))}
    </Tiles>
  </>
)

const LinkCard: FC<LinkCardProps> = ({ title, body, link, linkText }) => {
  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      flexDirection="column"
      height="full"
      padding={4}
      background="white"
    >
      <div>
        <Box paddingBottom={2}>
          <Typography variant="h3" as="h3">
            {title}
          </Typography>
        </Box>
        <Box paddingBottom={2}>
          <Typography variant="p" as="p">
            {body}
          </Typography>
        </Box>
      </div>
      <div>
        <Link href={link}>
          <Button variant="text" size="large" href={link} icon="arrowRight">
            {linkText}
          </Button>
        </Link>
      </div>
    </Box>
  )
}

export default LinkCardList
