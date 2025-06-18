import { Box, Text } from '@island.is/island-ui/core'
import { OfficialJournalOfIcelandAdvertAppendix } from '@island.is/web/graphql/schema'

import { Appendixes } from './OJOIAppendix'
import * as s from './OJOIAdvertDisplay.css'

export type OJOIAdvertDisplayProps = {
  advertNumber: string
  signatureDate: string
  advertType: string
  advertSubject: string
  advertText: string
  isLegacy: boolean
  additions?: OfficialJournalOfIcelandAdvertAppendix[]
}

export const OJOIAdvertDisplay = ({
  advertNumber,
  signatureDate,
  advertType,
  advertSubject,
  advertText,
  isLegacy,
  additions,
}: OJOIAdvertDisplayProps) => {
  if (!advertText) {
    return null
  }

  return (
    <Box
      border="standard"
      borderColor="purple200"
      borderRadius="large"
      padding={[2, 3, 4]}
    >
      <Box
        display="flex"
        justifyContent="spaceBetween"
        marginBottom={[2, 3, 4]}
      >
        <Text variant="eyebrow" color="purple400">
          Nr. {advertNumber}
        </Text>
        <Text variant="eyebrow" color="purple400">
          {signatureDate}
        </Text>
      </Box>
      <Box textAlign="center" marginBottom={[2, 3, 4]}>
        <Text variant="h3">{advertType}</Text>
        <Text variant="h4">{advertSubject}</Text>
      </Box>
      <Box
        className={isLegacy ? s.bodyText : s.bodyText}
        dangerouslySetInnerHTML={{ __html: advertText }}
      ></Box>
      <Appendixes additions={additions ?? []} />
    </Box>
  )
}
