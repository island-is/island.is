import { useLoaderData, useNavigate } from 'react-router-dom'
import { Company } from '../mockProcures'
import { IntroHeader } from '@island.is/portals/core'
import { useNationalId } from '../../hooks/useNationalId'
import {
  Box,
  Button,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import React from 'react'
import { ServiceDeskPaths } from '../../lib/paths'

const Procurers = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { formatNationalId } = useNationalId()
  const company = useLoaderData() as Company

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
        <IntroHeader
          title={company?.name}
          intro={formatNationalId(company?.nationalId)}
        />
        <Box marginTop={[3, 3, 6]}>
          <Text marginBottom={2} variant="h4">
            {formatMessage(m.listProcurers)}
          </Text>
          <GridContainer>
            <Stack space={3}>
              {company.procurers?.map((procurer) => (
                <GridRow key={`procure-${procurer.nationalId}`}>
                  <Box
                    display={'flex'}
                    borderRadius={'large'}
                    border={'standard'}
                    width={'full'}
                    paddingX={4}
                    paddingY={3}
                    justifyContent={'spaceBetween'}
                    alignItems={'center'}
                  >
                    <Box>
                      <Stack space={1}>
                        <Text variant="h3">{procurer.name}</Text>
                        <Text variant={'default'}>
                          {formatNationalId(procurer.nationalId)}
                        </Text>
                      </Stack>
                    </Box>
                  </Box>
                </GridRow>
              ))}
            </Stack>
          </GridContainer>
        </Box>
      </div>
    </Stack>
  )
}

export default Procurers
