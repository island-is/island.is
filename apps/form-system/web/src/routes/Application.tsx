import { useNavigate, useParams } from 'react-router-dom'
import { ApplicationProvider } from '../context/ApplicationProvider'
import { GET_APPLICATION, removeTypename } from '@island.is/form-system/graphql'
import { useQuery } from '@apollo/client'
import { ApplicationLoading, m } from '@island.is/form-system/ui'
import { NotFound } from '@island.is/portals/core'
import {
  Box,
  Text,
  Button,
  Page,
  GridContainer,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'

type UseParams = {
  slug: string
  id: string
}

export const Application = () => {
  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const { slug, id } = useParams() as UseParams
  const { data, error, loading } = useQuery(GET_APPLICATION, {
    variables: { input: { id } },
    skip: !id,
    fetchPolicy: 'cache-first',
  })

  if (!id || !slug) {
    return <NotFound />
  }

  if (loading) {
    return <ApplicationLoading />
  }

  if (error) {
    return (
      <Box padding={4}>
        <Text variant="h3" marginBottom={2}>
          {formatMessage(m.basicErrorMessage)}
        </Text>
        <Text marginBottom={3}>
          {formatMessage(m.errorFetchingApplication)}
        </Text>
        <Button onClick={() => navigate(`../${slug}`)}>
          {formatMessage(m.back)}
        </Button>
      </Box>
    )
  }

  const formSystemApp = data?.formSystemApplication
  const isLoginTypeAllowed = formSystemApp?.isLoginTypeAllowed
  const application = removeTypename(formSystemApp?.application)

  if (isLoginTypeAllowed === false) {
    return (
      <Page>
        <GridContainer>
          <Box marginTop={4}>
            <AlertMessage
              type="error"
              title={formatMessage(m.switchLoginToOpenApplication)}
              message={`${formatMessage(
                m.loginNotAllowedToOpenApplication,
              )} ${id}.`}
            />
            <Box marginTop={3}>
              <Button onClick={() => navigate(`../${slug}`)}>
                {formatMessage(m.createApplication)}
              </Button>
            </Box>
          </Box>
        </GridContainer>
      </Page>
    )
  }

  if (!application) {
    return <NotFound />
  }

  return <ApplicationProvider application={application} />
}
