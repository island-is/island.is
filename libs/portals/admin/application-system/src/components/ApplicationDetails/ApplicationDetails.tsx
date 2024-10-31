import {
  AccordionCard,
  AlertMessage,
  Box,
  Button,
  FocusableBox,
  GridColumn,
  GridRow,
  Icon,
  Text,
  toast,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PropsWithChildren, useState } from 'react'
import { m } from '../../lib/messages'
import { AdminApplication } from '../../types/adminApplication'
import {
  ActionCardMetaData,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import copyToClipboard from 'copy-to-clipboard'
import { ApplicationCard } from '@island.is/application/ui-components'
import {
  GetApplicationDetailsQuery,
  useGetApplicationDetailsQuery,
} from '../../queries/overview.generated'
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
  const [fetchedData, setFetchedData] = useState<string | null>(null)

  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopyApplicationId = () => {
    const copied = copyToClipboard(application.id)

    if (copied) {
      toast.success(formatMessage(m.copyIdSuccessful))
    }
  }

  const { refetch } = useGetApplicationDetailsQuery({
    variables: {
      applicationId: application.id,
    },
    skip: true, // Skip the initial query
  })

  const handleDownloadApplicationData = async () => {
    try {
      const { data } = await refetch()
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { __typename, ...cleanedData } = data?.getApplicationDetails || {}
      const dataDogLink = getErrorDataDogLink(data?.getApplicationDetails)
      setFetchedData(JSON.stringify({ dataDogLink, ...cleanedData }, null, 2))
    } catch (error) {
      console.error('Error fetching application data:', error)
      setFetchedData(JSON.stringify(error, null, 2))
    }
  }

  const getErrorDataDogLink = (
    getApplicationDetails: GetApplicationDetailsQuery['getApplicationDetails'],
  ): string | undefined => {
    const { externalData } = getApplicationDetails || {}
    if (externalData) {
      for (const key in externalData) {
        const dataItem = externalData[key]
        if (dataItem.status === 'failure') {
          const errorDate = new Date(dataItem.date)
          const startOfDay = new Date(errorDate.setHours(0, 0, 0, 0))
          const endOfDay = new Date(errorDate.setHours(23, 59, 59))
          const dataDogLink = formatDataDogLink(
            application.id,
            startOfDay,
            endOfDay,
          )
          return dataDogLink
        }
      }
    }
    return undefined
  }

  const formatDataDogLink = (applicationId: string, from: Date, to: Date) => {
    return `https://app.datadoghq.eu/logs?query=service%3Aapplication-system-api%20%40applicationId%3A${applicationId}&from_ts=${from.getTime()}&to_ts=${to.getTime()}`
  }

  const handleToggleAccordion = () => {
    setIsExpanded((prev) => !prev)
    handleDownloadApplicationData()
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

      <Box marginBottom={2} marginTop={2}>
        <AccordionCard
          colorVariant="red"
          id="id_1"
          label="Nánari gögn svör og viðbótargögn"
          labelColor="red600"
          expanded={isExpanded}
          onToggle={handleToggleAccordion}
        >
          <Box marginBottom={2} marginTop={1}>
            <Button
              size="small"
              variant="text"
              icon="copy"
              iconType="outline"
              onClick={() => onCopyApplicationLink(application)}
            >
              {'Afrita gögn'}
            </Button>
          </Box>

          <FocusableBox component="code">
            <Text variant="small" whiteSpace="breakSpaces">
              {fetchedData || 'No data fetched yet.'}
            </Text>
          </FocusableBox>
        </AccordionCard>
      </Box>
    </Box>
  )
}
