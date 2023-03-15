import {
  getDateBeginDateEnd,
  getShortDate,
} from '../../utils/helpers/dateFormatter'
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
import EyebrowsWithSeperator from '../EyebrowsWithSeperator/EyebrowsWithSeperator'

import * as styles from './Card.css'

type CardInfo = {
  tag?: string
  id: number
  title: string
  published?: string
  processBegins?: string
  processEnds?: string
  eyebrows: Array<string>
}
type CardProps = {
  card: CardInfo
  dropdown?: ReactNode
  showAttachment?: boolean
  frontPage: boolean
  children: any
  showPublished?: boolean
}

export const Card = ({
  card,
  showAttachment,
  dropdown,
  frontPage,
  showPublished,
  children,
}: CardProps) => {
  const child = (
    <>
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
        <EyebrowsWithSeperator
          instances={[card.eyebrows[0], card.eyebrows[1]]}
          color="blue600"
          style={styles.seperator}
          wrap={true}
          truncate={false}
        />

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
            Umsagnarfrestur:
          </Text>
          <Text variant="eyebrow" color="blue600">
            {getDateBeginDateEnd(card.processBegins, card.processEnds)}
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
        {showPublished && (
          <Text variant="eyebrow" color="purple400">{`Birt: ${getShortDate(
            card.published,
          )}`}</Text>
        )}
      </Inline>
    </>
  )

  return frontPage ? (
    <FocusableBox
      href={`/mal/${card.id}`}
      position="relative"
      height="full"
      width="full"
      className={styles.cardBox}
      padding={3}
      borderRadius="standard"
      borderWidth="standard"
      borderColor="blue200"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      color="blueberry"
    >
      {child}
    </FocusableBox>
  ) : (
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
      {child}
    </Box>
  )
}

export default Card
