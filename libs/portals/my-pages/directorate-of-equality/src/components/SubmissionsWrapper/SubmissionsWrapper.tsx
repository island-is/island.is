import { ReactNode } from 'react'

import { AlertMessage, Box, LinkV2, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  formatNationalId,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { messages } from '../../lib/messages'
import { directorateOfEqualityNavigation } from '../../lib/navigation'
import { DirectorateOfEqualityPaths } from '../../lib/paths'
import { useDirectorateOfEqualityCompanyQuery } from '../../mocks/hooks'

export const SubmissionsWrapper = ({
  pathname,
  children,
}: {
  pathname: string
  children: ReactNode
}) => {
  const { formatMessage } = useLocale()
  const { data, loading, error } = useDirectorateOfEqualityCompanyQuery()
  const company = data?.directorateOfEqualityCompany
  const isObliged =
    !!company && (company.equalityPlanRequired || company.salaryReportRequired)

  const tabs =
    directorateOfEqualityNavigation.children
      ?.find((item) => item.path === DirectorateOfEqualityPaths.Submissions)
      ?.children?.filter((item) => !item.navHide) ?? []

  return (
    <IntroWrapper
      title={formatMessage(coreMessages.equalitySubmissions)}
      intro={formatMessage(messages.submissionsIntro)}
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && (
        <InfoLineStack label={messages.companyInfo}>
          <InfoLine
            label={messages.companyName}
            content={company?.name}
            loading={loading}
          />
          <InfoLine
            label={messages.companyNationalId}
            content={company ? formatNationalId(company.nationalId) : undefined}
            loading={loading}
          />
          <InfoLine
            label={messages.employeeCount}
            content={company?.employeeCountRange}
            loading={loading}
          />
          <InfoLine
            label={messages.isatCategory}
            content={company?.isatCategory}
            loading={loading}
          />
          <InfoLine
            label={messages.equalityPlanRequired}
            content={formatMessage(
              company?.equalityPlanRequired ? messages.yes : messages.no,
            )}
            loading={loading}
          />
          {(loading || company?.equalityPlanRequired) && (
            <InfoLine
              label={messages.nextEqualityPlanDeadline}
              content={formatDate(company?.nextEqualityPlanDeadline)}
              loading={loading}
            />
          )}
          <InfoLine
            label={messages.salaryReportRequired}
            content={formatMessage(
              company?.salaryReportRequired ? messages.yes : messages.no,
            )}
            loading={loading}
          />
          {(loading || company?.salaryReportRequired) && (
            <InfoLine
              label={messages.nextSalaryReportDeadline}
              content={formatDate(company?.nextSalaryReportDeadline)}
              loading={loading}
            />
          )}
        </InfoLineStack>
      )}
      {company && !isObliged && (
        <Box marginTop={6}>
          <AlertMessage
            type="info"
            message={
              <Text variant="small">
                {formatMessage(messages.notObligedMessage)}{' '}
                <LinkV2
                  href={formatMessage(messages.notObligedLinkUrl)}
                  color="blue400"
                  underline="normal"
                  underlineVisibility="always"
                  newTab
                >
                  {formatMessage(messages.notObligedLinkText)}
                </LinkV2>
                .
              </Text>
            }
          />
        </Box>
      )}
      {company && isObliged && (
        <Box marginTop={6}>
          <TabNavigation
            label={formatMessage(coreMessages.equalitySubmissions)}
            pathname={pathname}
            items={tabs}
          />
          <Box marginTop={4}>{children}</Box>
        </Box>
      )}
    </IntroWrapper>
  )
}
