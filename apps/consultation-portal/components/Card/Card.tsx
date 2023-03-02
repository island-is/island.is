import {
  Tag,
  Box,
  Divider,
  Text,
  ArrowLink,
  Inline,
  FocusableBox,
} from '@island.is/island-ui/core'
import { ReactNode } from 'react'
import getTagVariants from '../../utils/helpers/getTagVariants'

import * as styles from './Card.css'

type CardInfo = {
  tag?: string
  id: number
  title: string
  eyebrows: Array<string>
}
type CardProps = {
  card: CardInfo
  height?: string
  width?: string
  dropdown?: ReactNode
  showAttachment?: boolean
  children: any
}

export const Card = ({
  card,
  showAttachment,
  width,
  height,
  dropdown,
  children,
}: CardProps) => {
  return (
    <FocusableBox href={`/mal/${card.id}`}>
      <Box
        className={styles.cardBox}
        padding={3}
        borderRadius="standard"
        borderWidth="standard"
        borderColor="blue200"
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
      >
        <Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="spaceBetween"
            paddingBottom={2}
          >
            <Tag variant={getTagVariants(card.tag)}>{card.tag}</Tag>
            <Text as="p" variant="eyebrow" color="purple400">
              Nr. S-{card.id}
            </Text>
          </Box>
          <Inline space={1} alignY="center" flexWrap="nowrap">
            <Text as="p" variant="eyebrow" color="blue600" truncate>
              {card.eyebrows[0]}
            </Text>
            <div className={styles.seperator} />
            <Text as="p" variant="eyebrow" color="blue600" truncate>
              {card.eyebrows[1]}
            </Text>
          </Inline>
          <Box
            style={{ height: showAttachment ? '100px' : '100px' }}
            className={styles.title}
            paddingY={2}
          >
            <Text as="h4" fontWeight="semiBold">
              {card.title}
            </Text>
          </Box>
          <Inline space={1} alignY={'center'}>
            <Text variant="eyebrow" color="dark400">
              Umsagnartímabil:
            </Text>
            <Text variant="eyebrow" color="blue600">
              01.09.22 – 01.12.22
            </Text>
          </Inline>
          <Box paddingY={1}>
            <Divider />
          </Box>
          {children}
        </Box>
        <Inline space={1} justifyContent="spaceBetween" alignY="center">
          {showAttachment && <Box>{dropdown}</Box>}
          <Box>
            <ArrowLink href={`/mal/${card.id}`}>Skoða mál</ArrowLink>
          </Box>
        </Inline>
      </Box>
    </FocusableBox>
  )
}

export default Card
