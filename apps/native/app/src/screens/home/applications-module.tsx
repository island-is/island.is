import {
  Badge,
  Heading,
  StatusCard,
  StatusCardSkeleton,
  ViewPager,
} from '@island.is/island-ui-native'
import React from 'react'
import { Image, SafeAreaView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import leJobss4 from '../../assets/illustrations/le-jobs-s4.png'
import { IApplication } from '../../graphql/fragments/application.fragment'
import { config } from '../../utils/config'
import { useIntl } from '../../utils/intl'
import { openBrowser } from '../../utils/rn-island'

interface ApplicationsModuleProps {
  applications: IApplication[]
  loading: boolean
  componentId: string
}

const Empty = styled.View`
  display: flex;
  flex-direction: row;
  padding: 20px 70px 20px 24px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) =>
      theme.isDark ? theme.shade.shade300 : theme.color.blue200};
  align-items: center;
  justify-content: space-between;
`

const EmptyText = styled.Text`
  padding-right: 30px;
  font-family: 'IBMPlexSans-Light';
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.shade.foreground};
`

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
        <Heading>
          {intl.formatMessage({ id: 'home.applicationsStatus' })}
        </Heading>
        {loading ? (
          <StatusCardSkeleton />
        ) : (
          <>
            {count === 0 && (
              <Empty>
                <EmptyText>
                  {intl.formatMessage({
                    id: 'applicationStatusCard.noActiveApplications',
                  })}
                </EmptyText>
                <Image source={leJobss4} height={90} width={42} />
              </Empty>
            )}
            {count === 1 && children.slice(0, 1)}
            {count >= 2 && <ViewPager>{children}</ViewPager>}
          </>
        )}
      </SafeAreaView>
    )
  },
)
