import { Tag, Box, Divider, Text, ArrowLink } from '@island.is/island-ui/core'
import getTagVariants from '../../utils/helpers/getTagVariants'
type CardProps = {
  caseNumber: string
  status: string
  name: string
  adviceCount: number
  shortDescription: string
  id: number
}

export const Card = (caseData: CardProps) => {
  return (
    <Box
      style={{
        width: '358px',
        minWidth: '287px',
        height: '460px',
        flexWrap: 'wrap',
      }}
      padding={3}
      // margin={1}
      borderRadius="standard"
      borderWidth="standard"
      borderColor="purple300"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="spaceBetween"
      >
        <Tag variant={getTagVariants(caseData.status)}>{caseData.status}</Tag>
        <Text as="p" variant="eyebrow" color="purple400">
          {caseData.caseNumber}
        </Text>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" paddingY={1}>
        <Text as="p" variant="eyebrow" color="blue600">
          Stöðumat og valkostir
        </Text>
        <div
          style={{
            marginLeft: 8,
            marginRight: 8,
            height: 16,
            border: '1px solid #ccdfff',
          }}
        />
      </Box>
      <Box style={{ height: '90px', overflow: 'hidden' }} paddingBottom={2}>
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
        <Text variant="eyebrow" color="purple400">
          {`Fjöldi umsagna: ${caseData.adviceCount}`}
        </Text>
      </Box>
      <Box style={{ minHeight: 132, lineBreak: 'anywhere' }}>
        <Text variant="small" color="dark400">
          {caseData.shortDescription}
        </Text>
      </Box>

      <Box className="ArrowLinkContainer">
        <ArrowLink href={`case/${caseData.id}`}>Skoða mál</ArrowLink>
      </Box>
    </Box>
  )
}

export default Card
