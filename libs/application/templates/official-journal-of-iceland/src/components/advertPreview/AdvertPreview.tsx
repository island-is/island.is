import { Box, Text } from '@island.is/island-ui/core'

import * as s from './AdvertPreview.css'

export type OJOIAdvertDisplayProps = {
  advertNumber?: string
  signatureDate?: string
  advertType?: string
  advertSubject?: string
  advertText?: string
}

export const AdvertPreview = ({
  advertNumber,
  signatureDate,
  advertType,
  advertSubject,
  advertText,
}: OJOIAdvertDisplayProps) => {
  const hasNumberOrDate = !!(advertNumber || signatureDate)
  const hasTypeOrSubject = !!(advertType || advertSubject)
  const hasText = !!advertText

  return (
    <Box
      border="standard"
      borderColor="purple200"
      borderRadius="large"
      padding={[2, 3, 4]}
    >
      {hasNumberOrDate && (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          marginBottom={[2, 3, 4]}
        >
          {!!advertNumber && (
            <Text variant="eyebrow" color="purple400">
              Nr. {advertNumber}
            </Text>
          )}
          {!!signatureDate && (
            <Text variant="eyebrow" color="purple400">
              {signatureDate}
            </Text>
          )}
        </Box>
      )}
      {hasTypeOrSubject && (
        <Box textAlign="center" marginBottom={advertText ? [2, 3, 4] : 0}>
          {!!advertType && <Text variant="h3">{advertType}</Text>}
          {!!advertSubject && <Text variant="h4">{advertSubject}</Text>}
        </Box>
      )}
      {hasText && (
        <Box
          className={s.bodyText}
          dangerouslySetInnerHTML={{ __html: advertText }}
        ></Box>
      )}
    </Box>
  )
}
