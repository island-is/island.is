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
import { MockApplicationItem } from './MockData'
import BasicInfo from './BasicInfo'
import Translations from './Translations'
import ApplicationsUrl from './ApplicationsUrl'
import Lifetime from './Lifetime'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const Application = () => {
  const { formatMessage } = useLocale()
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>(
    Object.keys(MockApplicationItem.availableEnvironments)[0],
  )
  const {
    development,
    staging,
    production,
  } = MockApplicationItem.availableEnvironments

  const getEnv = () => {
    switch (selectedEnvironment) {
      case 'development':
        return development
      case 'staging':
        return staging
      case 'production':
        return production
      default:
        return development
    }
  }

  return (
    <GridContainer>
      <Stack space={4}>
        <GridRow>
          <GridColumn span="6/12">
            <Stack space="smallGutter">
              <Tag outlined>{MockApplicationItem.tag}</Tag>
              <Text variant="h2">{MockApplicationItem.name}</Text>
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
                options={Object.keys(
                  MockApplicationItem.availableEnvironments,
                ).map((env) => ({ label: env, value: env }))}
              />
            </Box>
          </GridColumn>
        </GridRow>

        <BasicInfo basicInfo={getEnv().basicInfo} />
        <Translations translations={getEnv().translations} />
        <ApplicationsUrl applicationUrls={getEnv().applicationUrls} />
        <Lifetime lifetime={getEnv().lifeTime} />
      </Stack>
    </GridContainer>
  )
}

export default Application
