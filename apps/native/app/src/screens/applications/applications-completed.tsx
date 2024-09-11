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
          text: intl.formatMessage({ id: 'applications.completed' }),
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

export const ApplicationsCompletedScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const [refetching, setRefetching] = useState(false)

  const applicationsRes = useListApplicationsQuery({
    variables: {
      input: {
        status: [ApplicationResponseDtoStatusEnum.Completed],
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
      badgeVariant="mint"
      displayProgress={false}
      displayDescription={true}
      componentId={componentId}
      onRefetch={(refetching) => setRefetching(refetching)}
    />
  )
}

ApplicationsCompletedScreen.options = getNavigationOptions
