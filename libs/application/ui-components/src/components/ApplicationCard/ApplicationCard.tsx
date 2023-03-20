import * as React from 'react'
import { Box, Button, Icon, Inline, Text } from '@island.is/island-ui/core'
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
import { useOpenApplication } from '@island.is/application/core'

export type ApplicationCardProps = {
  application: ApplicationCardFields
  logo?: string // TODO: This prop should not exist and rather the card component should render correct logo based on the application
  focused?: boolean
  refetchOnDelete?: () => void
}

export const ApplicationCard = ({
  application,
  refetchOnDelete,
  logo,
  focused = false,
}: ApplicationCardProps) => {
  const { status, actionCard, modified } = application
  const { lang: locale, formatMessage } = useLocale()
  const openApplication = useOpenApplication(application)
  const formattedDate = locale === 'is' ? dateFormat.is : dateFormat.en
  const defaultData = defaultCardDataByStatus[status]
  const heading = actionCard?.title ?? application.name
  const historyItems = buildHistoryItems(
    application,
    formatMessage,
    formattedDate,
    openApplication,
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
      background="white"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        marginBottom={[0, 2]}
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
        <Inline alignY="center" space={1}>
          <ApplicationCardTag
            actionCard={actionCard}
            defaultData={defaultData}
          />
          <ApplicationCardDelete
            application={application}
            refetchOnDelete={refetchOnDelete}
          />
        </Inline>
      </Box>

      <Box
        alignItems={['flexStart', 'center']}
        display="flex"
        flexDirection={['column', 'row']}
      >
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

        <Box
          display="flex"
          alignItems={['flexStart', 'flexEnd']}
          flexDirection="column"
          flexShrink={0}
          marginTop={[1, 0]}
          marginLeft={[0, 'auto']}
          className={styles.tag}
        >
          {!showHistory && (
            <Box
              paddingTop="gutter"
              display="flex"
              justifyContent={['flexStart', 'flexEnd']}
              alignItems="center"
              flexDirection="row"
            >
              <Box marginLeft={[0, 3]}>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={openApplication}
                  icon="arrowForward"
                >
                  {formatMessage(defaultData.cta.label)}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {shouldRenderProgress ? (
        <ApplicationCardProgress
          application={application}
          defaultData={defaultData}
        />
      ) : showHistory ? (
        <ApplicationCardHistory items={historyItems} />
      ) : null}
    </Box>
  )
}
