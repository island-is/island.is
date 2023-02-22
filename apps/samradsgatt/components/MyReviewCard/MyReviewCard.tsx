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
import getTagVariants from '../../utils/helpers/getTagVariants'

type CardProps = {
  caseNumber: string
  status: string
  name: string
  adviceCount: number
  shortDescription: string
  id: number
  review: string
  type: string
  institution: string
}

export const MyReviewCard = (caseData: CardProps) => {
  return (
    <Box
      style={{
        width: '440px',
        minWidth: '287px',
        height: '376px',
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
        <Tag variant={getTagVariants(caseData.status)}>{caseData.status}</Tag>
        <Text as="p" variant="eyebrow" color="purple400">
          Nr. S-{caseData.caseNumber}
        </Text>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" paddingY={1}>
        <Text as="p" variant="eyebrow" color="blue600">
          {caseData.type}
        </Text>
        <div
          style={{
            marginLeft: 8,
            marginRight: 8,
            height: 16,
            border: '1px solid #ccdfff',
          }}
        />
        <Text variant="eyebrow" color="blue600">
          {caseData.institution}
        </Text>
      </Box>
      <Box style={{ height: '50px', overflow: 'hidden' }} paddingBottom={2}>
        <Text as="h4" fontWeight="semiBold">
          {caseData.name}
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
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="spaceBetween"
      >
        <Text variant="eyebrow">Þín umsögn</Text>
      </Box>
      <Box
        style={{
          minHeight: 110,
          lineBreak: 'anywhere',
        }}
      >
        <Box>
          <Text variant="small" color="dark400" truncate>
            {caseData.review}
          </Text>
        </Box>
      </Box>
      <Columns>
        <Column width="content">
          <Box>
            <Text variant="h5" color="purple400">
              Viðhengi <Icon icon="chevronDown" />
            </Text>
          </Box>
        </Column>
        <Column width="content">
          <Box marginLeft={20}>
            <ArrowLink href={`/mal/${caseData.id}`}>Skoða mál</ArrowLink>
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}

export default MyReviewCard
