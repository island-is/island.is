import { HealthDirectoratePermitStatus } from '@island.is/api/schema'
import {
  Box,
  Button,
  Stack,
  Table as T,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ExpandRow,
  formatDate,
  formatDateWithTime,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InvalidatePermitModal } from '../../components/PatientDataPermit/InvalidatePermitModal'
import { messages } from '../../lib/messages'
import {
  useGetPatientDataPermitsQuery,
  useInvalidatePatientDataPermitMutation,
} from './PatientDataPermits.generated'
import { HealthPaths } from '../../lib/paths'
import { permitTagSelector } from '../../utils/tagSelector'
import { Markdown } from '@island.is/shared/components'

const PermitDetail: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [showAllHistory, setShowAllHistory] = useState(false)

  const HISTORY_VISIBLE_COUNT = 10

  const { data, error, loading } = useGetPatientDataPermitsQuery({
    variables: { locale: lang },
  })

  const [invalidatePermit] = useInvalidatePatientDataPermitMutation({
    refetchQueries: ['GetPatientDataPermits'],
  })

  const permit = data?.healthDirectoratePatientDataPermits?.consent
  const history = data?.healthDirectoratePatientDataPermits?.history ?? []

  const isActive =
    permit?.status === HealthDirectoratePermitStatus.active ||
    permit?.status === HealthDirectoratePermitStatus.awaitingApproval

  const isInactive =
    permit?.status === HealthDirectoratePermitStatus.inactive ||
    permit?.status === HealthDirectoratePermitStatus.expired

  const onInvalidateSubmit = () => {
    invalidatePermit()
      .then(() => {
        toast.success(formatMessage(messages.permitInvalidated))
        navigate(HealthPaths.HealthPatientDataPermits, { replace: true })
      })
      .catch(() => {
        toast.error(formatMessage(messages.permitInvalidatedError))
      })
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.patientDataPermit)}
      introComponent={
        <Markdown>{formatMessage(messages.permitDetailIntroWithLink)}</Markdown>
      }
      serviceProviderSlug="landlaeknir"
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirPatientPermitsTooltip,
      )}
      buttonGroup={
        !loading && !error
          ? [
              // TODO: Re-enable when backend PDF endpoint is available
              // <Button
              //   key="downloadPDF"
              //   variant="utility"
              //   icon="download"
              //   iconType="outline"
              //   size="small"
              // >
              //   {formatMessage(messages.downloadPDF)}
              // </Button>,
              ...(isActive
                ? [
                    <Button
                      key="invalidatePermit"
                      variant="utility"
                      icon="eyeOff"
                      iconType="outline"
                      size="small"
                      onClick={() => setModalOpen(true)}
                    >
                      {formatMessage(messages.patientDataPermitInvalidate)}
                    </Button>,
                  ]
                : []),
              <Button
                key="editPermit"
                variant="utility"
                colorScheme="primary"
                icon="arrowForward"
                iconType="outline"
                size="small"
                onClick={() =>
                  navigate(
                    HealthPaths.HealthPatientDataPermitsAdd,
                    isInactive
                      ? undefined
                      : {
                          state: {
                            countries: permit?.countries ?? [],
                            validFrom: permit?.validFrom ?? null,
                            validTo: permit?.validTo ?? null,
                          },
                        },
                  )
                }
              >
                {formatMessage(
                  isInactive ? messages.activatePermit : messages.editPermit,
                )}
              </Button>,
            ]
          : undefined
      }
    >
      {error && !loading && (
        <Problem title={formatMessage(messages.errorTryAgain)} />
      )}
      {!error && !loading && !permit && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noPermit)}
          message={formatMessage(messages.noPermitsRegistered)}
          imgSrc="./assets/images/empty_flower.svg"
        />
      )}
      {!error && permit && (
        <Box marginTop={2}>
          <Text variant="eyebrow" color="purple400" marginBottom={2}>
            {formatMessage(messages.information)}
          </Text>
          <InfoLineStack>
            <InfoLine
              label={formatMessage(messages.referralFrom) ?? ''}
              content={formatMessage(messages.healthDirectorate)}
              loading={loading}
              button={{
                to: formatMessage(messages.healthDirectorateUrl),
                label: formatMessage(messages.organizationWebsite),
                type: 'link',
              }}
            />
            <InfoLine
              label={formatMessage(messages.lastChanged) ?? ''}
              content={formatDateWithTime(permit?.createdAt?.toString() ?? '')}
              loading={loading}
            />
            <InfoLine
              label={formatMessage(messages.status) ?? ''}
              content={
                permit?.status
                  ? (() => {
                      const tag = permitTagSelector(
                        permit.status,
                        formatMessage,
                      )
                      return (
                        <Tag
                          variant={tag.variant}
                          outlined={tag.outlined}
                          disabled
                        >
                          {tag.label}
                        </Tag>
                      )
                    })()
                  : undefined
              }
              loading={loading}
            />
            <InfoLine
              label={formatMessage(messages.validTime)}
              content={
                permit?.validFrom && permit?.validTo
                  ? formatDate(permit.validFrom.toString()) +
                    ' - ' +
                    formatDate(permit.validTo.toString())
                  : undefined
              }
              loading={loading}
            />
            <InfoLine
              label={formatMessage(messages.validForCountries)}
              content={permit?.countries
                ?.map((country) => country.name)
                .join(', ')}
              loading={loading}
            />
            <InfoLine
              label={formatMessage(messages.patientDataShared)}
              content={formatMessage(messages.patientDataSharedDescription)}
              loading={loading}
            />
          </InfoLineStack>

          {history.length > 0 && (
            <Box marginTop={5}>
              <Text variant="eyebrow" color="purple400" marginBottom={2}>
                {formatMessage(messages.permitChangeHistory)}
              </Text>
              <T.Table>
                <T.Head>
                  <T.Row>
                    <T.HeadData />
                    <T.HeadData>
                      <Text variant="medium" fontWeight="semiBold">
                        {formatMessage(messages.lastModified)}
                      </Text>
                    </T.HeadData>
                    <T.HeadData>
                      <Text variant="medium" fontWeight="semiBold">
                        {formatMessage(messages.medicineValidFrom)}
                      </Text>
                    </T.HeadData>
                    <T.HeadData>
                      <Text variant="medium" fontWeight="semiBold">
                        {formatMessage(messages.medicineValidTo)}
                      </Text>
                    </T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {(showAllHistory
                    ? history
                    : history.slice(0, HISTORY_VISIBLE_COUNT)
                  ).map((entry, index) => (
                    <ExpandRow
                      key={entry.createdAt?.toString() ?? index}
                      data={[
                        {
                          value: formatDateWithTime(
                            entry.changedAt?.toString() ??
                              entry.createdAt?.toString() ??
                              '',
                          ),
                        },
                        {
                          value: formatDate(entry.validFrom?.toString() ?? ''),
                        },
                        {
                          value: entry.validTo
                            ? formatDate(entry.validTo.toString())
                            : '—',
                        },
                      ]}
                    >
                      <Box padding={3} background="blue100">
                        <Stack space={3}>
                          <Box>
                            <Text variant="small" fontWeight="semiBold">
                              {formatMessage(messages.countries)}
                            </Text>
                            <Box marginTop={1} padding={3} background="white">
                              <Text variant="small">
                                {entry.countries.map((c) => c.name).join(', ')}
                              </Text>
                            </Box>
                          </Box>
                          <Box>
                            <Text variant="small" fontWeight="semiBold">
                              {formatMessage(messages.dataShared)}
                            </Text>
                            <Box marginTop={1} padding={3} background="white">
                              <Text variant="small">
                                {formatMessage(
                                  messages.patientDataSharedDescription,
                                )}
                              </Text>
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    </ExpandRow>
                  ))}
                </T.Body>
              </T.Table>
              {history.length > HISTORY_VISIBLE_COUNT && (
                <Box display="flex" justifyContent="center" marginTop={3}>
                  <Button
                    variant="text"
                    size="small"
                    icon={showAllHistory ? 'chevronUp' : 'chevronDown'}
                    iconType="outline"
                    onClick={() => setShowAllHistory(!showAllHistory)}
                  >
                    {formatMessage(
                      showAllHistory
                        ? messages.showLessHistory
                        : messages.showMoreHistory,
                    )}
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
      <InvalidatePermitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onInvalidateSubmit}
        validFrom={formatDate(permit?.validFrom)}
        validTo={formatDate(permit?.validTo)}
      />
    </IntroWrapper>
  )
}

export default PermitDetail
