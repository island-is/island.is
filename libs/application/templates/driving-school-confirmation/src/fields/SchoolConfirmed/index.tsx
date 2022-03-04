import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import Jobs from '../../assets/Jobs'

const SchoolConfirmed: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <AlertMessage title="Skráning móttekin" type="success"></AlertMessage>
      <Box height="full" marginTop={8} marginBottom={10}>
        <Jobs />
      </Box>
    </>
  )
}

export default SchoolConfirmed
