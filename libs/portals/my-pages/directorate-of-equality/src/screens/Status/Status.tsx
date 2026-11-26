import {
  AlertMessage,
  Box,
  KeyValueCard,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatDate,
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'

import { useDirectorateOfEqualityCompanyQuery } from '../../lib/company.generated'
import { NAMESPACE } from '../../lib/constants'
import { messages } from '../../lib/messages'

const Status = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const { profile } = useUserInfo()
  const { data, loading, error } = useDirectorateOfEqualityCompanyQuery()
  const company = data?.directorateOfEqualityCompany
  const isObliged =
    loading ||
    (!!company &&
      (company.equalityPlanRequired || company.salaryReportRequired))

  return (
    <IntroWrapper
      desktopContentSpan="10/12"
      title={formatMessage(messages.statusTitle)}
      intro={formatMessage(messages.statusIntro)}
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !isObliged && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noObligationsTitle)}
          message={formatMessage(messages.noObligationsMessage)}
          imgSrc="./assets/images/nodata.svg"
          titleSize="h2"
        />
      )}
      {!error && isObliged && (
        <>
          <Text
            as="h2"
            variant="eyebrow"
            color="foregroundBrandSecondary"
            marginBottom={2}
          >
            {formatMessage(messages.submissionObligationsForCompany, {
              companyName: profile.name,
            })}
          </Text>
          <KeyValueCard
            loading={loading}
            img="./assets/images/handshake.svg"
            columns={[
              [
                {
                  label: formatMessage(messages.equalityPlanRequired),
                  value: formatMessage(
                    company?.equalityPlanRequired
                      ? coreMessages.yes
                      : coreMessages.no,
                  ),
                },
                ...(loading || company?.equalityPlanRequired
                  ? [
                      {
                        label: formatMessage(messages.nextEqualityPlanDeadline),
                        value: formatDate(company?.nextEqualityPlanDeadline),
                      },
                    ]
                  : []),
              ],
              [
                {
                  label: formatMessage(messages.salaryReportRequired),
                  value: formatMessage(
                    company?.salaryReportRequired
                      ? coreMessages.yes
                      : coreMessages.no,
                  ),
                },
                ...(loading || company?.salaryReportRequired
                  ? [
                      {
                        label: formatMessage(messages.nextSalaryReportDeadline),
                        value: formatDate(company?.nextSalaryReportDeadline),
                      },
                    ]
                  : []),
              ],
            ]}
          />
        </>
      )}
      {company?.serviceProviderApprovedAt && (
        <Box marginTop={5}>
          <AlertMessage
            type="info"
            title={formatMessage(
              messages.serviceProviderNoticeTitleForCompany,
              { companyName: profile.name },
            )}
            message={formatMessage(messages.serviceProviderApprovedMessage, {
              date: formatDate(company.serviceProviderApprovedAt),
            })}
          />
        </Box>
      )}
    </IntroWrapper>
  )
}

export default Status
