import {
  Badge,
  EmptyCard,
  Heading,
  LinkText,
  StatusCard,
  StatusCardSkeleton,
  ViewPager,
} from '@island.is/island-ui-native'
import React from 'react'
import { useIntl } from 'react-intl'
import { Image, SafeAreaView, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'
import leJobss4 from '../../assets/illustrations/le-jobs-s4.png'
import { IApplication } from '../../graphql/fragments/application.fragment'
import { navigateTo } from '../../lib/deep-linking'
import { openBrowser } from '../../lib/rn-island'
import { config } from '../../utils/config'

interface ApplicationsModuleProps {
  applications: IApplication[]
  loading: boolean
  componentId: string
}

export const ApplicationsModule = React.memo(
  ({ applications, loading, componentId }: ApplicationsModuleProps) => {
    const intl = useIntl()
    const theme = useTheme()
    const count = applications.length

    const children = applications.slice(0, 5).map((application) => (
      <StatusCard
        key={application.id}
        title={application.name!}
        date={new Date(application.created)}
        badge={
          <Badge
            title={intl.formatMessage(
              { id: 'applicationStatusCard.state' },
              { state: application.state || 'unknown' },
            )}
          />
        }
        progress={application.progress * 100}
        actions={[
          {
            text: intl.formatMessage({
              id: 'applicationStatusCard.openButtonLabel',
            }),
            onPress() {
              openBrowser(
                `${config.apiEndpoint.replace(
                  /api$/,
                  'umsoknir',
                )}/sjukratryggingar/${application.id}`,
                componentId,
              )
            },
          },
        ]}
        style={
          count > 1
            ? {
                width: 283,
                marginLeft: 16,
              }
            : {}
        }
      />
    ))

    return (
      <SafeAreaView style={{ marginHorizontal: 16 }}>
        <TouchableOpacity onPress={() => navigateTo(`/applications`)}>
          <Heading>
            {intl.formatMessage({ id: 'home.applicationsStatus' })}
          </Heading>
        </TouchableOpacity>
        {loading ? (
          <StatusCardSkeleton />
        ) : (
          <>
            {count === 0 && (
              <EmptyCard
                text={intl.formatMessage({
                  id: 'applicationStatusCard.noActiveApplications',
                })}
                image={
                  <Image
                    source={leJobss4}
                    height={90}
                    width={42}
                    resizeMode="contain"
                  />
                }
                link={
                  <TouchableOpacity onPress={() => navigateTo(`/applications`)}>
                    <LinkText>Skoða umsóknir</LinkText>
                  </TouchableOpacity>
                }
              />
            )}
            {count === 1 && children.slice(0, 1)}
            {count >= 2 && <ViewPager>{children}</ViewPager>}
          </>
        )}
      </SafeAreaView>
    )
  },
)
