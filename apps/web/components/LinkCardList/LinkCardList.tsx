/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from 'next/link'
import { Button, Text, Box, Tiles } from '@island.is/island-ui/core'

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

export const LinkCardList = ({ title, cards }: LinkCardListProps) => (
  <>
    <Box paddingBottom={6}>
      <Text variant="h2" as="h2">
        {title}
      </Text>
    </Box>
    <Tiles columns={[1, 1, 1, 1, 2]} space={4}>
      {cards.map((card, i) => (
        <LinkCard key={i} {...card} />
      ))}
    </Tiles>
  </>
)

const LinkCard = ({ title, body, link, linkText }: LinkCardProps) => {
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
          <Text variant="h3" as="h3">
            {title}
          </Text>
        </Box>
        <Box paddingBottom={2}>
          <Text>{body}</Text>
        </Box>
      </div>
      <div>
        <Link href={link}>
          <Button variant="text" size="large" icon="arrowForward">
            {linkText}
          </Button>
        </Link>
      </div>
    </Box>
  )
}

export default LinkCardList
