import {
  getDateBeginDateEnd,
  getShortDate,
} from '../../utils/helpers/dateFunctions'
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
import { getTagVariants } from './utils'
import { Eyebrows } from '../../components'
import localization from './Card.json'
import shared from '../../lib/shared.json'
import * as styles from './Card.css'

type CardInfo = {
  tag?: string
  id: number
  title: string
  published?: string
  processBegins?: string
  processEnds?: string
  eyebrows: Array<string>
  caseNumber: string
}
type CardProps = {
  card: CardInfo
  dropdown?: ReactNode
  showAttachment?: boolean
  frontPage: boolean
  children: ReactNode
  showPublished?: boolean
}

const Card = ({
  card,
  showAttachment,
  dropdown,
  frontPage,
  showPublished,
  children,
}: CardProps) => {
  const loc = localization['card']

  const child = (
    <>
      <Box dataTestId="front-page-card">
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="spaceBetween"
          paddingBottom={2}
        >
          <Tag variant={getTagVariants(card.tag)}>{card.tag}</Tag>
          <Text as="p" variant="eyebrow" color="purple400">
            {`${loc.tagText} S-${card.caseNumber}`}
          </Text>
        </Box>
        <Eyebrows
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
            {loc.adviceDateText}
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
        {frontPage ? (
          <ArrowLink as="span">{loc.arrowLink.text}</ArrowLink>
        ) : (
          <ArrowLink href={`${loc.arrowLink.href}/${card.id}`}>
            {loc.arrowLink.text}
          </ArrowLink>
        )}

        {showPublished && (
          <Text variant="eyebrow" color="purple400">{`${
            loc.publishedText
          }: ${getShortDate(card.published)}`}</Text>
        )}
      </Inline>
    </>
  )

  return frontPage ? (
    <FocusableBox
      href={`${loc.arrowLink.href}/${card.id}`}
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
