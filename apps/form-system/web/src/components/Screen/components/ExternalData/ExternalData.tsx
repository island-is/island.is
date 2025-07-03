import { Box, Checkbox, Icon, Stack, Text } from '@island.is/island-ui/core'
import { useApplicationContext } from '../../../../context/ApplicationProvider'
import { webMessages } from '@island.is/form-system/ui'
import { useIntl } from 'react-intl'
import { Markdown } from '@island.is/shared/components'
import { useQuery } from '@apollo/client'
import { GET_NAME_BY_NATIONALID } from 'libs/portals/form-system/graphql/src/lib/queries/getIndividual'

interface Props {
  setExternalDataAgreement: (value: boolean) => void
}

export const ExternalData = ({ setExternalDataAgreement }: Props) => {
  const { state } = useApplicationContext()
  const { application } = state
  const { certificationTypes } = application
  const { formatMessage } = useIntl()
  const id = '1912982179'
    const { data, error, loading } = useQuery(GET_NAME_BY_NATIONALID, {
      variables: { input:  id },
      skip: !id,
      fetchPolicy: 'cache-first',
    })
  
  console.log('data', data)
  console.log('error', error)
  console.log('loading', loading)
  return (
    <Box>
      <Box marginTop={2} marginBottom={5}>
        <Box marginBottom={5}>
          <Text variant="h2">Gagnaöflun</Text>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flexStart">
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">
            {formatMessage(webMessages.externalDataTitle)}
          </Text>
        </Box>
      </Box>

      <Box marginBottom={5}>
        <Stack space={2}>
          <div>
            <Text variant="h4" color="blue400">
              {formatMessage(webMessages.icelandicRegistryTitle)}
            </Text>
            <Text>
              <Markdown>
                {formatMessage(webMessages.icelandicRegistryDescription)}
              </Markdown>
            </Text>
          </div>
          <div>
            <Text variant="h4" color="blue400">
              {formatMessage(webMessages.myPagesTitle)}
            </Text>
            <Text>
              <Markdown>
                {formatMessage(webMessages.myPagesDescription)}
              </Markdown>
            </Text>
          </div>

          {certificationTypes?.map((certificationType) => (
            <div key={certificationType?.id}>
              <Text variant="h4" color="blue400">
                {certificationType?.certificationTypeId}
              </Text>

              <Text>
                <Markdown>{certificationType?.id ?? ''}</Markdown>
              </Text>
            </div>
          ))}
        </Stack>
      </Box>
      <Checkbox
        large={true}
        backgroundColor="blue"
        label={formatMessage(webMessages.externalDataAgreement)}
        onChange={(event) => setExternalDataAgreement(event.target.checked)}
      />
    </Box>
  )
}
