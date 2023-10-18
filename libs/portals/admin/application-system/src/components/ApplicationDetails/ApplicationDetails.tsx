import {
  AlertMessage,
  AlertMessageType,
  Box,
  GridColumn,
  GridRow,
  Icon,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { PropsWithChildren, ReactNode } from 'react'
import { getLogo, statusMapper } from '../../shared/utils'
import { m } from '../../lib/messages'
import { AdminApplication } from '../../types/adminApplication'
import { Organization } from '@island.is/shared/types'
import {
  ActionCardMetaData,
  ApplicationStatus,
  ApplicationTypes,
  FormatMessage,
} from '@island.is/application/types'
import { ApplicationListAdminResponseDtoStatusEnum } from '@island.is/api/schema'
import { ApplicationCard } from '@island.is/application/ui-components'

interface ValueLineProps {
  title?: string
}

export type ApplicationCardHistoryItem = {
  date?: string
  title: string
  content?: React.ReactNode
}

const ValueLine = ({ title, children }: PropsWithChildren<ValueLineProps>) => {
  return (
    <>
      {title && (
        <Text variant="h5" marginBottom={1}>
          {title}
        </Text>
      )}
      <Text>{children}</Text>
    </>
  )
}

const buildHistoryItems = (
  application: AdminApplication,
  formatMessage: FormatMessage,
) => {
  if (application.status === ApplicationListAdminResponseDtoStatusEnum.draft)
    return

  const displayStatus = application.actionCard?.pendingAction
    ?.displayStatus as AlertMessageType

  let historyItems: ApplicationCardHistoryItem[] = []

  const actionCardHistory = application.actionCard?.history
  const lastHistoryItem = actionCardHistory
    ? actionCardHistory[actionCardHistory.length - 1]
    : undefined
  const lastHistoryDate = lastHistoryItem?.date

  if (application.actionCard?.pendingAction?.title) {
    historyItems.push({
      date: format(
        lastHistoryDate ? new Date(lastHistoryDate) : new Date(),
        'dd.MM.yyyy',
      ),
      title: formatMessage(application.actionCard.pendingAction.title ?? ''),
      content: application.actionCard.pendingAction.content ? (
        <AlertMessage
          type={displayStatus ?? 'default'}
          message={formatMessage(
            application.actionCard.pendingAction.content ?? '',
          )}
        />
      ) : undefined,
    })
  }

  if (application.actionCard?.history) {
    historyItems = historyItems.concat(
      application.actionCard?.history.map((x) => ({
        date: format(new Date(x.date), 'dd.MM.yyyy'),
        title: x.log ? formatMessage(x.log) : '',
      })),
    )
  }

  return historyItems
}

interface Props {
  application: AdminApplication
  organizations: Organization[]
  onCopyButtonClick: (application: AdminApplication) => void
  shouldShowCardButtons?: boolean
}

export const ApplicationDetails = ({
  application,
  organizations,
  onCopyButtonClick,
  shouldShowCardButtons = true,
}: Props) => {
  const { formatMessage } = useLocale()
  const tag = statusMapper[application.status]
  const logo = getLogo(application.typeId, organizations)
  const actionCard = application.actionCard
  const historyItems = buildHistoryItems(application, formatMessage)
  const showHistory =
    application.status !== ApplicationListAdminResponseDtoStatusEnum.draft &&
    historyItems &&
    historyItems.length > 0

  return (
    <Box>
      <Box display="flex" alignItems="center" marginBottom={[2, 2, 3]}>
        <Icon icon="person" color="blue400" type="outline" />
        <Box paddingLeft={2} />
        <Text variant="h3">{formatMessage(m.applicant)}</Text>
      </Box>
      <Box padding={4} background="blue100" borderRadius="large">
        <GridRow rowGap={3}>
          <GridColumn span={['2/2', '2/2', '1/2']}>
            <ValueLine title={formatMessage(m.name)}>
              {application.applicantName}
            </ValueLine>
          </GridColumn>
          <GridColumn span={['2/2', '2/2', '1/2']}>
            <ValueLine title={formatMessage(m.nationalId)}>
              {application.applicant}
            </ValueLine>
          </GridColumn>
        </GridRow>
      </Box>
      {application.applicantActors.length > 0 &&
        application.applicantActors.map((actor) => (
          <Box key={actor}>
            <Box
              display="flex"
              alignItems="center"
              marginBottom={[2, 2, 3]}
              marginTop={[5, 5, 6]}
            >
              <Icon icon="person" color="purple600" type="outline" />
              <Box paddingLeft={2} />
              <Text variant="h3">{formatMessage(m.procurer)}</Text>
            </Box>
            <Box padding={4} background="purple100" borderRadius="large">
              <GridRow rowGap={3}>
                <GridColumn span={['2/2', '2/2', '1/2']}>
                  <ValueLine title={formatMessage(m.name)}>{actor}</ValueLine>
                </GridColumn>
                <GridColumn span={['2/2', '2/2', '1/2']}>
                  <ValueLine title={formatMessage(m.nationalId)}>
                    {actor}
                  </ValueLine>
                </GridColumn>
              </GridRow>
            </Box>
          </Box>
        ))}
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={[2, 2, 3]}
        marginTop={[5, 5, 6]}
      >
        <Text variant="h3">{formatMessage(m.application)}</Text>
        <Tooltip
          text={formatMessage(m.copyLinkToApplication)}
          // We are already in a portal,
          // and tooltip renders below the drawer if we render tooltip also in portal
          renderInPortal={false}
          placement="left"
        >
          <button onClick={() => onCopyButtonClick(application)}>
            <Icon icon="copy" type="outline" color="blue400" />
          </button>
        </Tooltip>
      </Box>
      {application && (
        <ApplicationCard
          shouldShowCardButtons={shouldShowCardButtons}
          application={{
            id: application.id,
            modified: new Date(application.modified),
            status: application.status as unknown as ApplicationStatus,
            typeId: application.typeId as unknown as ApplicationTypes,
            name: application.name,
            progress: application.progress,
            actionCard: application.actionCard as ActionCardMetaData,
          }}
        />
      )}
    </Box>
  )
}
