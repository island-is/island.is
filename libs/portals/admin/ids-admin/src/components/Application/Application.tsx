import {
  GridColumn,
  GridContainer,
  GridRow,
  Tag,
  Text,
  Stack,
  Box,
  Select,
} from '@island.is/island-ui/core'
import React, { useState } from 'react'
import BasicInfo from './BasicInfo'
import Translations from './Translations'
import ApplicationsUrl from './ApplicationsUrl'
import Lifetime from './Lifetime'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLoaderData } from 'react-router-dom'
import { AuthApplication } from './Application.loader'

const Application = () => {
  const application = useLoaderData() as AuthApplication

  const { formatMessage } = useLocale()
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    AuthApplication['environments'][0]
  >(application.environments[0])

  return (
    <GridContainer>
      <Stack space={4}>
        <GridRow>
          <GridColumn span="6/12">
            <Stack space="smallGutter">
              <Tag outlined>{application.applicationType}</Tag>
              <Text variant="h2">
                {application.environments[0].displayName[0].value}
              </Text>
            </Stack>
          </GridColumn>
          <GridColumn span="6/12">
            <Box width="full" display="flex" justifyContent="flexEnd">
              <Select
                name="env"
                icon="chevronDown"
                size="sm"
                backgroundColor="blue"
                label={formatMessage(m.environment)}
                onChange={(event: any) =>
                  setSelectedEnvironment(
                    application.environments.find(
                      (env) => env.environment === event.value,
                    ) as AuthApplication['environments'][0],
                  )
                }
                value={{
                  label: selectedEnvironment.environment,
                  value: selectedEnvironment.environment,
                }}
                options={application.environments.map((env) => {
                  return {
                    label: env.environment,
                    value: env.environment,
                  }
                })}
              />
            </Box>
          </GridColumn>
        </GridRow>
        <BasicInfo basicInfo={selectedEnvironment.basicInfo} />
        <Translations translations={selectedEnvironment.displayName} />
        <ApplicationsUrl
          applicationUrls={selectedEnvironment.applicationUrls}
        />
        <Lifetime lifetime={selectedEnvironment.lifeTime} />
      </Stack>
    </GridContainer>
  )
}

export default Application
