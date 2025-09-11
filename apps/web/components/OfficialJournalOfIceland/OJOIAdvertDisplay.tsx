import c from 'classnames'

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
      <Box textAlign="center" display="flex" flexDirection="column">
        <Text variant="h3">{advertType}</Text>
        <Text variant="h4" className={s.advertDescription}>
          {advertSubject}
        </Text>
      </Box>
      <Box
        className={c(s.bodyText, 'ojoi-advert-display-wrapper')}
        dangerouslySetInnerHTML={{ __html: advertText }}
      ></Box>
      {additions && additions.length > 0 && (
        <Appendixes additions={additions} />
      )}
    </Box>
  )
}
