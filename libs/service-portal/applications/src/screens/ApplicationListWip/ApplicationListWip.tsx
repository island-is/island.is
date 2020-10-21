import React from 'react'
import format from 'date-fns/format'
import * as styles from './ApplicationlistWip.treat'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import ApplicationCard from '../../components/ApplicationCard/ApplicationCard'
import {
  Box,
  Stack,
  Inline,
  Tag,
  Text,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { Application } from '@island.is/application/core'
import { mockApplicationList } from './mockApplicationList'
import { useLocale } from '@island.is/localization'

const ApplicationList: ServicePortalModuleComponent = () => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box marginBottom={4}>
        <Inline space={1}>
          <Text variant="h1">Umsóknir</Text>
          <Tag variant="mint">
            {formatMessage({
              id: 'service-portal:in-progress',
              defaultMessage: 'Í vinnslu',
            })}
          </Tag>
        </Inline>
      </Box>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['1/1', '6/8']}>
            <Text>
              {formatMessage({
                id: 'sp.applications:wip-intro-text',
                defaultMessage: `
                  Hér eru birt þau leyfi og umsóknir sem þú
                  hefur sótt um á Ísland.is, bæði sem einstaklingur
                  og í umboði annarra.
                  `,
              })}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        {mockApplicationList.map((application: Application) => (
          <Box border="standard" key={application.id}>
            <div className={styles.cardBlurWrapper}>
              <ApplicationCard
                name={application.name || application.typeId}
                date={format(new Date(application.modified), 'MMMM')}
                isComplete={application.progress === 1}
                url="/"
                progress={application.progress ? application.progress * 100 : 0}
              />
            </div>
          </Box>
        ))}
      </Stack>
    </>
  )
}

export default ApplicationList
