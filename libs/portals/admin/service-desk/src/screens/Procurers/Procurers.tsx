import React from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'

import { formatNationalId, IntroHeader } from '@island.is/portals/core'
import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import { ServiceDeskPaths } from '../../lib/paths'
import { CompanyProcurerResult } from './Procurers.loader'
import { Card } from '../../components/Card'

const Procurers = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const {
    name,
    nationalId,
    procurers,
  } = useLoaderData() as CompanyProcurerResult

  return (
    <Stack space="containerGutter">
      <Button
        colorScheme="default"
        iconType="filled"
        onClick={() => navigate(ServiceDeskPaths.Root)}
        preTextIcon="arrowBack"
        preTextIconType="filled"
        size="small"
        type="button"
        variant="text"
      >
        {formatMessage(m.back)}
      </Button>
      <div>
        <IntroHeader title={name} intro={formatNationalId(nationalId)} />
        <Box marginTop={[3, 3, 6]}>
          <Text marginBottom={2} variant="h4">
            {formatMessage(m.listProcurers)}
          </Text>
          <Stack space={3}>
            {procurers?.map(({ nationalId, name }) => (
              <Card title={name} description={nationalId} />
            ))}
          </Stack>
        </Box>
      </div>
    </Stack>
  )
}

export default Procurers
