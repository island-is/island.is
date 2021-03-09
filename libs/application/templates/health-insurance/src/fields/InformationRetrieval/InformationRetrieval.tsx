import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'
import { Box, Checkbox, Icon, Stack, Text } from '@island.is/island-ui/core'
import * as styles from './InformationRetrieval.treat'
import Markdown from 'markdown-to-jsx'

interface DataRetrievalContent {
  title: string
  description: string
}
const InformationRetrieval: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const dataProviders = [
    {
      title: formatText(m.nationalRegistryTitle, application, formatMessage),
      description: formatText(
        m.nationalRegistrySubTitle,
        application,
        formatMessage,
      ),
    },
    {
      title: formatText(m.directorateOfLaborTitle, application, formatMessage),
      description: formatText(
        m.directorateOfLaborSubTitle,
        application,
        formatMessage,
      ),
    },
    {
      title: formatText(m.internalRevenueTitle, application, formatMessage),
      description: formatText(
        m.internalRevenueSubTitle,
        application,
        formatMessage,
      ),
    },
    {
      title: formatText(
        m.socialInsuranceAdministrationTitle,
        application,
        formatMessage,
      ),
      description: formatText(
        m.socialInsuranceAdministrationSubtitle,
        application,
        formatMessage,
      ),
    },
    {
      title: '',
      description: formatText(
        m.dataProvidersMoreInfo,
        application,
        formatMessage,
      ),
    },
  ] as DataRetrievalContent[]

  return (
    <Box>
      <Box
        marginBottom={5}
        display="flex"
        alignItems="center"
        justifyContent="flexStart"
        className={styles.marginFix}
      >
        <Box marginRight={1}>
          <Icon icon="download" size="medium" color="blue400" type="outline" />
        </Box>
        <Text variant="h4">
          {formatText(m.externalDataSubtitle, application, formatMessage)}
        </Text>
      </Box>
      <Stack space={3}>
        {dataProviders.map((providers, index) => {
          return (
            <Box key={index}>
              <Text variant="h4" color="blue400">
                {providers.title}
              </Text>
              <Text variant="default">
                <Markdown>{providers.description}</Markdown>
              </Text>
            </Box>
          )
        })}
      </Stack>
      <Box background="blue100" padding={4} borderRadius="large" marginTop={5}>
        <Checkbox
          checked={true}
          onChange={() => true}
          label={
            <Markdown>
              {formatText(m.externalDataCheckbox, application, formatMessage)}
            </Markdown>
          }
        />
      </Box>
    </Box>
  )
}

export default InformationRetrieval
