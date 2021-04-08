import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Approved } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'

const Conclusion: FC<FieldBaseProps> = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginBottom={12}>
        <Approved
          title={formatMessage(m.signedConclusion.approvedTitle)}
          subtitle={formatMessage(m.signedConclusion.approvedSubtitle)}
        />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        {/* todo: add actions/links */}
        <Button variant="ghost">
          {formatMessage(m.signedConclusion.myPagesButton)}
        </Button>
        <Box>
          <Button variant="text" icon="arrowForward" iconType="filled">
            {formatMessage(m.signedConclusion.partyListButton)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Conclusion
