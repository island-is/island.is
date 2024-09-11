import { useState } from 'react'

import { NavigationFunctionComponent } from 'react-native-navigation'
import {
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { ApplicationsList } from './components/applications-list'

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'applications.incomplete' }),
        },
        noBorder: true,
      },
    }),
    {
      bottomTabs: {
        visible: false,
        drawBehind: true,
      },
    },
  )

export const ApplicationsIncompleteScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const [refetching, setRefetching] = useState(false)

  const applicationsRes = useListApplicationsQuery({
    variables: {
      input: {
        status: [ApplicationResponseDtoStatusEnum.Draft],
      },
    },
  })

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: [applicationsRes],
  })

  return (
    <ApplicationsList
      applicationsRes={applicationsRes}
      badgeVariant="blue"
      displayProgress={true}
      displayDescription={false}
      componentId={componentId}
      onRefetch={(refetching) => setRefetching(refetching)}
    />
  )
}

ApplicationsIncompleteScreen.options = getNavigationOptions
