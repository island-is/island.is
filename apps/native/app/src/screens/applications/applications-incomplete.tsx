import { useState } from 'react'
import { NavigationFunctionComponent } from 'react-native-navigation'

import {
  ApplicationResponseDtoStatusEnum,
  useListApplicationsQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { ApplicationsList } from './components/applications-list'
import { usePreferencesStore } from '../../stores/preferences-store'

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
  const { locale } = usePreferencesStore()

  const applicationsRes = useListApplicationsQuery({
    variables: {
      input: {
        status: [ApplicationResponseDtoStatusEnum.Draft],
      },
      locale: locale === 'is-IS' ? 'is' : 'en',
    },
  })

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: applicationsRes,
  })

  return (
    <ApplicationsList
      applicationsRes={applicationsRes}
      displayProgress
      displayDescription={false}
      componentId={componentId}
      onRefetch={setRefetching}
    />
  )
}

ApplicationsIncompleteScreen.options = getNavigationOptions
