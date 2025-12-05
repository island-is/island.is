import * as React from 'react'
import { Box, Icon, Inline, Text } from '@island.is/island-ui/core'
import * as styles from './ApplicationCard.css'
import { ApplicationCardDelete } from './components/ApplicationCardDelete'
import { dateFormat } from '@island.is/shared/constants'
import format from 'date-fns/format'
import { ApplicationCardHistory } from './components/ApplicationCardHistory'
import { ApplicationCardProgress } from './components/ApplicationCardProgress'
import { ApplicationCardTag } from './components/ApplicationCardTag'
import { useLocale } from '@island.is/localization'
import { defaultCardDataByStatus } from './utils/defaultData'
import { ApplicationCardFields } from './types'
import { buildHistoryItems } from './utils/history'
import { ApplicationStatus } from '@island.is/application/types'
import { useOpenApplication } from '../../hooks/useOpenApplication'

export type ApplicationCardProps = {
  /**
   * The application to display in the card.
   */
  application: ApplicationCardFields
  /**
   * The logo of the application.
   * TODO: This prop should not exist and rather the card component should render correct logo based on the application
   */
  logo?: string
  /**
   * Should the card be focused?
   */
  focused?: boolean
  /**
   * Method that is invoked when an application is deleted.
   * Used to refetch the data to keep the list up to date
   */
  onDelete?: () => void
  /**
   * Method that is invoked when application card button is clicked.
   * Defaults to opening the application in a new tab
   */
  onClick?: (id: string) => void
  /**
   * Should the card buttons be shown?
   */
  shouldShowCardButtons?: boolean
  /**
   * Application slug
   */
  slug?: string
  /**
   * The path to the application.
   */
  applicationPath?: string
}

export const ApplicationCard = ({
  application,
  onDelete,
  onClick,
  logo,
  focused = false,
  shouldShowCardButtons = true,
}: ApplicationCardProps) => {
  const { status, actionCard, modified } = application
  const { lang: locale, formatMessage } = useLocale()
  const { openApplication: defaultOpen, slug } = useOpenApplication(application)
  const formattedDate = locale === 'is' ? dateFormat.is : dateFormat.en
  const defaultData = defaultCardDataByStatus[status]
  const heading = actionCard?.title ?? application.name
  const openApplication = onClick
    ? () => onClick(`${slug}/${application.id}`)
    : defaultOpen
  const historyItems = buildHistoryItems(
    application,
    formatMessage,
    formattedDate,
    shouldShowCardButtons ? openApplication : undefined,
  )

  const shouldRenderProgress = status === 'draft'
  const showHistory =
    application.status !== ApplicationStatus.DRAFT &&
    historyItems &&
    historyItems.length > 0

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderColor={focused ? 'mint400' : 'blue200'}
      borderRadius="large"
      borderWidth="standard"
      paddingX={[3, 3, 4]}
      paddingY={3}
      dataTestId={`application-card`}
      background="white"
    >
      <Box
        alignItems={['flexStart', 'center']}
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        marginBottom={2}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box display="flex" marginRight={1} justifyContent="center">
            <Icon icon="time" size="medium" type="outline" color="blue400" />
          </Box>
          <Box display="flex" justifyContent="center">
            <Text variant="small">
              {format(new Date(modified), formattedDate)}
            </Text>
          </Box>
        </Box>
        <Inline alignY="center" justifyContent="flexEnd" space={1}>
          <ApplicationCardTag
            actionCard={actionCard}
            defaultData={defaultData}
          />
          {actionCard && actionCard.deleteButton && (
            <ApplicationCardDelete
              application={application}
              onDelete={onDelete}
            />
          )}
        </Inline>
      </Box>

      <Box flexDirection="row" width="full">
        {heading && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            alignItems={['flexStart', 'flexStart', 'flexEnd']}
          >
            <Box display="flex" flexDirection="row" alignItems="center">
              {logo && (
                <Box
                  padding={2}
                  marginRight={2}
                  className={styles.logo}
                  style={{ backgroundImage: `url(${logo})` }}
                ></Box>
              )}
              <Text variant="h3" color="currentColor">
                {heading}
              </Text>
            </Box>
          </Box>
        )}

        {actionCard?.description && (
          <Text paddingTop={heading ? 1 : 0}>{actionCard.description}</Text>
        )}
      </Box>

      {shouldRenderProgress ? (
        <ApplicationCardProgress
          application={application}
          defaultData={defaultData}
          shouldShowCardButtons={shouldShowCardButtons}
          onOpenApplication={openApplication}
        />
      ) : showHistory ? (
        <ApplicationCardHistory items={historyItems} />
      ) : (
        <ApplicationCardProgress
          application={application}
          defaultData={defaultData}
          shouldShowCardButtons={shouldShowCardButtons}
          onOpenApplication={openApplication}
          forceDefault
        />
      )}
    </Box>
  )
}
