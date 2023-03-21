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
import {
  AuthApplicationApplicationUrlList,
  AuthApplicationLBasicInfoList,
  AuthApplicationList,
  AuthApplicationTranslationList,
  AuthApplicationLifeTimeList,
} from './Application.loader'

const Application = () => {
  const applications = useLoaderData() as AuthApplicationList
  const [application] = useState<AuthApplicationList[0]>(
    applications[0] ? applications[0] : ({} as AuthApplicationList[0]),
  )
  const { formatMessage } = useLocale()
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>(
    application.defaultEnvironment.environment,
  )

  const getEnv = () => {
    if (!selectedEnvironment) return application.defaultEnvironment
    return application.environments.find(
      (env) => env.environment === selectedEnvironment,
    )
  }

  return (
    <GridContainer>
      <Stack space={4}>
        <GridRow>
          <GridColumn span="6/12">
            <Stack space="smallGutter">
              <Tag outlined>{application.applicationType}</Tag>
              <Text variant="h2">
                {application.defaultEnvironment.displayName[0].value}
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
                onChange={(event: any) => setSelectedEnvironment(event.value)}
                value={{
                  label: selectedEnvironment,
                  value: selectedEnvironment,
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

        <BasicInfo
          basicInfo={getEnv()?.basicInfo as AuthApplicationLBasicInfoList}
        />
        <Translations
          translations={
            getEnv()?.displayName as AuthApplicationTranslationList[]
          }
        />
        <ApplicationsUrl
          applicationUrls={
            getEnv()?.applicationUrls as AuthApplicationApplicationUrlList
          }
        />
        <Lifetime
          lifetime={getEnv()?.lifeTime as AuthApplicationLifeTimeList}
        />
      </Stack>
    </GridContainer>
  )
}

export default Application
