import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Tooltip } from '@island.is/island-ui/core'
import { User } from '@island.is/judicial-system/types'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { strings } from './ProsecutorSection.strings'
import ProsecutorSelection from './ProsecutorSelection'

interface Props {
  onChange: (prosecutor: User) => boolean
}

const ProsecutorSection: React.FC<Props> = (props) => {
  const { onChange } = props

  const { formatMessage } = useIntl()

  return (
    <>
      <SectionHeading
        title={`${formatMessage(strings.heading)} `}
        tooltip={
          <Box component="span" data-testid="prosecutor-tooltip">
            <Tooltip text={formatMessage(strings.tooltip)} />
          </Box>
        }
      />
      <ProsecutorSelection onChange={onChange} />
    </>
  )
}

export default ProsecutorSection
