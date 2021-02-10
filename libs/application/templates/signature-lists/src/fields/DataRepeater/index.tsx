import React, { FC } from 'react'
import { formatText, RepeaterProps } from '@island.is/application/core'
import { Box, ButtonDeprecated as Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../forms/messages'
import DataTable from '../DataTable'

const DataRepeater: FC<RepeaterProps> = ({ expandRepeater, application }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box marginY={3}>
        <DataTable application={application} />
      </Box>
      <Button onClick={expandRepeater}>
        {formatText(m.dataAdd, application, formatMessage)}
      </Button>
    </>
  )
}

export default DataRepeater
