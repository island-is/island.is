import {
  Tag,
  Box,
  Divider,
  Text,
  ArrowLink,
  Columns,
  Column,
  Icon,
} from '@island.is/island-ui/core'
import { ReactNode } from 'react'
import getTagVariants from '../../utils/helpers/getTagVariants'

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
    <Box
      style={{
        width: width ? width : '328px',
        minWidth: '287px',
        height: height ? height : '460px',
        flexWrap: 'wrap',
      }}
      padding={3}
      borderRadius="standard"
      borderWidth="standard"
      borderColor="purple300"
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="spaceBetween"
      >
        <Tag variant={getTagVariants(card.tag)}>{card.tag}</Tag>
        <Text as="p" variant="eyebrow" color="purple400">
          Nr. S-{card.id}
        </Text>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" paddingY={1}>
        <Text as="p" variant="eyebrow" color="blue600">
          {card.eyebrows[0]}
        </Text>
        <div
          style={{
            marginLeft: 8,
            marginRight: 8,
            height: 16,
            border: '1px solid #ccdfff',
          }}
        />
        <Text as="p" variant="eyebrow" color="blue600">
          {card.eyebrows[1]}
        </Text>
      </Box>
      <Box
        style={{ height: showAttachment ? '50px' : '90px', overflow: 'hidden' }}
        paddingBottom={2}
      >
        <Text as="h4" fontWeight="semiBold">
          {card.title}
        </Text>
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center">
        <Text variant="eyebrow" color="dark400">
          Umsagnartímabil:
        </Text>
        <Text variant="eyebrow" color="blue600" marginY={1}>
          01.09.22 – 01.12.22
        </Text>
      </Box>
      <Box paddingY={1}>
        <Divider />
      </Box>
      {children}
      <Columns>
        {showAttachment && (
          <Column width="content">
            <Box>{dropdown}</Box>
          </Column>
        )}
        <Column width="content">
          <Box marginLeft={showAttachment ? 20 : 0}>
            <ArrowLink href={`/mal/${card.id}`}>Skoða mál</ArrowLink>
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}

export default Card
