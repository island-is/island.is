/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
import {
  LinkCard,
  LinkCardSlice as LinkCardSliceType,
} from '@island.is/api/schema'
import { Typography, Box, Stack, Tiles, Icon } from '@island.is/island-ui/core'

export const LinkCardSlice: FC<LinkCardSliceType> = ({ title, cards }) => (
  <>
    <Box paddingBottom={6}>
      <Typography variant="h2" as="h2">
        {title}
      </Typography>
    </Box>
    <Tiles columns={[1, 1, 1, 1, 2]} space={4}>
      {cards.map((card, i) => (
        <Card key={i} {...card} />
      ))}
    </Tiles>
  </>
)

const Card: FC<LinkCard> = ({ title, body, link, linkText }) => {
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
          <Link href={link}>
            <a>
              {linkText} <Icon type="arrowRight" width="15" height="15" />
            </a>
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}

export default LinkCardSlice
