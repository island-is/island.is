import React, { FC } from 'react'
import { formatText, RepeaterProps } from '@island.is/application/core'
import { Box, ButtonDeprecated as Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../forms/messages'
import ContactTable from '../ContactTable'

const DataRepeater: FC<RepeaterProps> = ({
  expandRepeater,
  application,
  removeRepeaterItem,
  repeater,
}) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Box marginY={3}>
        <ContactTable
          application={application}
          dataId={repeater.id}
          onDeleteContact={removeRepeaterItem}
        />
      </Box>
      <Button onClick={expandRepeater}>
        {formatText(
          repeater.id == 'technicalContact'
            ? m.technicalContactAdd
            : m.businessContactAdd,
          application,
          formatMessage,
        )}
      </Button>
    </>
  )
}

export default DataRepeater
