import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Text,
  toast,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PropsWithChildren } from 'react'
import { m } from '../../lib/messages'
import { AdminApplication } from '../../types/adminApplication'
import {
  ActionCardMetaData,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import copyToClipboard from 'copy-to-clipboard'
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

interface Props {
  application: AdminApplication
  onCopyApplicationLink: (application: AdminApplication) => void
  shouldShowCardButtons?: boolean
}

export const ApplicationDetails = ({
  application,
  onCopyApplicationLink,
  shouldShowCardButtons = true,
}: Props) => {
  const { formatMessage } = useLocale()

  const handleCopyApplicationId = () => {
    const copied = copyToClipboard(application.id)

    if (copied) {
      toast.success(formatMessage(m.copyIdSuccessful))
    }
  }

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
          {application.adminData?.map((item) => (
            <GridColumn span={['2/2', '2/2', '1/2']} key={item.key}>
              <ValueLine title={formatMessage(item.label)}>
                {item.values?.join(', ') ?? ''}
              </ValueLine>
            </GridColumn>
          ))}
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
                  <ValueLine title={formatMessage(m.nationalId)}>
                    {actor}
                  </ValueLine>
                </GridColumn>
              </GridRow>
            </Box>
          </Box>
        ))}
      {application.pruned && (
        <Box marginTop={[2, 2, 3]}>
          <AlertMessage
            type="warning"
            message={formatMessage(m.applicationPruned)}
          />
        </Box>
      )}
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginY={[2, 2, 3]}
      >
        <Box>
          <Text variant="h3">{formatMessage(m.application)}</Text>
          <Box marginBottom={2} marginTop={1}>
            <Button
              size="small"
              variant="text"
              icon="copy"
              iconType="outline"
              onClick={() => onCopyApplicationLink(application)}
            >
              {formatMessage(m.copyLinkToApplication)}
            </Button>
          </Box>
          <Box display="flex" alignItems="center">
            <Text variant="small">
              <Text as="span" variant="small" fontWeight="semiBold">
                ID:{' '}
              </Text>
              {application.id}
            </Text>
            <Box marginLeft={1}>
              <Tooltip
                text={formatMessage(m.copyApplicationId)}
                // We are already in a portal,
                // and tooltip renders below the drawer if we render tooltip also in portal
                renderInPortal={false}
                placement="top"
              >
                <button onClick={handleCopyApplicationId}>
                  <Icon
                    icon="copy"
                    size="small"
                    type="outline"
                    color="blue400"
                  />
                </button>
              </Tooltip>
            </Box>
          </Box>
        </Box>
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
