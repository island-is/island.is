import c from 'classnames'

import { Box, Text } from '@island.is/island-ui/core'
import { OfficialJournalOfIcelandAdvertAppendix } from '@island.is/web/graphql/schema'

import { Appendixes } from './OJOIAppendix'
import { splitDepartmentDateFromBody } from './OJOIUtils'
import * as s from './OJOIAdvertDisplay.css'

export type OJOIAdvertDisplayProps = {
  advertNumber: string
  signatureDate: string
  advertType: string
  advertSubject: string
  advertText: string
  isLegacy: boolean
  hiddenSignatureDate?: boolean
  additions?: OfficialJournalOfIcelandAdvertAppendix[]
}

export const OJOIAdvertDisplay = ({
  advertNumber,
  signatureDate,
  advertType,
  advertSubject,
  advertText,
  hiddenSignatureDate,
  additions,
}: OJOIAdvertDisplayProps) => {
  if (!advertText) {
    return null
  }

  const hasAdditions = !!additions?.length

  // The closing department/date line moves below the appendix accordion
  const { bodyHtml, departmentDateHtml } = hasAdditions
    ? splitDepartmentDateFromBody(advertText)
    : { bodyHtml: advertText, departmentDateHtml: null }

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
        {hiddenSignatureDate ? null : (
          <Text variant="eyebrow" color="purple400">
            {signatureDate}
          </Text>
        )}
      </Box>
      <Box textAlign="center" display="flex" flexDirection="column">
        <Text variant="h3">{advertType}</Text>
        <Text variant="h4" className={s.advertDescription}>
          {advertSubject}
        </Text>
      </Box>
      <Box
        className={c(s.bodyText, 'ojoi-advert-display-wrapper', {
          [s.hideSignature]: hiddenSignatureDate,
        })}
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      ></Box>
      {hasAdditions && (
        <Appendixes
          additions={additions}
          departmentDateHtml={departmentDateHtml}
        />
      )}
    </Box>
  )
}
