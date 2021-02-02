import React, { FC } from 'react'
import { FieldBaseProps, formatText, getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { m } from '../../forms/messages'
import { MissingInfoType, ReviewFieldProps } from '../../types'
import { Box, Checkbox, Icon, Stack, Text } from '@island.is/island-ui/core'

const InformationRetrieval: FC<FieldBaseProps> = ({application}) => {
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
  ] as any[]

  return (
    <Box>
      <Box // todo fix margin top, or set title in here
        marginBottom={5}
        display="flex"
        alignItems="center"
        justifyContent="flexStart"
      >
        <Box marginRight={1}>
          <Icon icon="download" size="medium" color="blue400" type="outline" />
        </Box>
        <Text variant="h4">
          Eftirfarandi gögn verða sótt rafrænt með þínu samþykki
        </Text>
      </Box>
      <Stack space={3}>
        {dataProviders.map((providers) => {
          return (
            <Box>
              <Text variant="h4" color="blue400">
                {providers.title}
              </Text>
              <Text variant="default">{providers.description}</Text>
            </Box>
          )
        })}
      </Stack>
      <Box background="blue100" padding={4} borderRadius="large" marginTop={5}>
        <Checkbox checked={true} label="Ég samþykki" />
      </Box>
    </Box>
  )
}

export default InformationRetrieval