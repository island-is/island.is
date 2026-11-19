import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { primarySchoolKeyInfoMessages as kim } from '../../../../lib/messages'
import type { MmsError } from './types'

/**
 * Standard error block for a key-info section. Surfaces the MMS request id, when
 * MMS sent one with the failure, so it can be traced with MMS (contract §6) —
 * `Problem` itself does not show it. See mmsError.ts for where it comes from.
 */
export const SectionError = ({ error }: { error: MmsError }) => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Problem type="internal_service_error" noBorder={false} />
      {error.requestId && (
        <Box marginTop={1}>
          <Text variant="small" color="dark400">
            {formatMessage(kim.requestId, { requestId: error.requestId })}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default SectionError
