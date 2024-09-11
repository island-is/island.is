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
          text: intl.formatMessage({ id: 'applications.inProgress' }),
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

export const ApplicationsInProgressScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const [refetching, setRefetching] = useState(false)
  console.log({ refetching })

  const applicationsRes = useListApplicationsQuery({
    variables: {
      input: {
        status: [ApplicationResponseDtoStatusEnum.Inprogress],
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
      badgeVariant="blueberry"
      displayProgress={false}
      displayDescription={true}
      componentId={componentId}
      onRefetch={(refetching) => setRefetching(refetching)}
    />
  )
}

ApplicationsInProgressScreen.options = getNavigationOptions
