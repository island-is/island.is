import {
  Badge,
  Heading,
  Skeleton,
  StatusCard,
  ViewPager,
} from '@island.is/island-ui-native'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'
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
  height: 183px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) =>
      theme.isDark ? theme.shade.shade300 : theme.color.blue200};
  align-items: center;
  justify-content: center;
`

const EmptyText = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${(props) => props.theme.shade.foreground};
`

export function ApplicationsModule({
  applications,
  loading,
  componentId,
}: ApplicationsModuleProps) {
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
            { state: application.state },
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
    <>
      <Heading>{intl.formatMessage({ id: 'home.applicationsStatus' })}</Heading>
      {loading ? (
        <Skeleton
          active={true}
          height={183}
          overlayColor={
            theme.isDark ? theme.shade.foreground : theme.color.blue400
          }
          overlayOpacity={theme.isDark ? 1 : 0.7}
          backgroundColor={theme.shade.background}
          style={{
            borderRadius: 8,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.isDark
              ? theme.shade.shade300
              : theme.color.blue200,
          }}
        />
      ) : (
        <>
          {count === 0 && (
            <Empty>
              <EmptyText>
                {intl.formatMessage({
                  id: 'applicationStatusCard.noActiveApplications',
                })}
              </EmptyText>
            </Empty>
          )}
          {count === 1 && children.slice(0, 1)}
          {count >= 2 && <ViewPager>{children}</ViewPager>}
        </>
      )}
    </>
  )
}
