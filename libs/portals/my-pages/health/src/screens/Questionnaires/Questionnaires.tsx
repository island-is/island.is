import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
  QuestionnairesBaseItem,
  QuestionnaireQuestionnairesStatusEnum as QuestionnairesStatusEnum,
} from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  Filter,
  Input,
  Stack,
  Text,
  ActionCard,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { debounceTime } from '@island.is/shared/constants'
import debounce from 'lodash/debounce'
import { FC, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetQuestionnairesQuery } from './questionnaires.generated'
import { Problem } from '@island.is/react-spa/shared'
import * as styles from './Questionnaires.css'

const defaultFilterValues = {
  searchQuery: '',
  status: [],
  organization: [],
  treatment: [],
}

type FilterValues = {
  searchQuery: string
  status: QuestionnaireQuestionnairesStatusEnum[]
  organization: QuestionnaireQuestionnairesOrganizationEnum[]
  treatment: string[]
}

const Questionnaires: FC = () => {
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const [filterValues, setFilterValues] =
    useState<FilterValues>(defaultFilterValues)
  const [filteredData, setFilteredData] = useState<
    QuestionnairesBaseItem[] | null
  >(null)
  const [showExpired, setShowExpired] = useState(false)

  const { data, loading, error } = useGetQuestionnairesQuery({
    variables: {
      locale: lang,
    },
  })

  const dataLength = data?.questionnairesList?.questionnaires?.length ?? 0

  const toggleStatus = (status: QuestionnaireQuestionnairesStatusEnum) => {
    setFilterValues((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }))
  }

  const toggleOrganization = (
    organization: QuestionnaireQuestionnairesOrganizationEnum,
  ) => {
    setFilterValues((prev) => ({
      ...prev,
      organization: prev.organization.includes(organization)
        ? prev.organization.filter((o) => o !== organization)
        : [...prev.organization, organization],
    }))
  }

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setFilterValues((prev) => ({
          ...prev,
          searchQuery: value,
        }))
      }, debounceTime.search),
    [],
  )

  const handleSearchChange = (value: string) => {
    debouncedSetSearchQuery(value)
  }

  useEffect(() => {
    setFilteredData(
      data?.questionnairesList?.questionnaires?.filter((item) => {
        // Search filter
        const searchLower = filterValues.searchQuery.toLowerCase()
        const matchesSearch =
          !searchLower ||
          item.organization?.toLowerCase().includes(searchLower) ||
          item.title?.toLowerCase().includes(searchLower)

        // Status filter
        const matchesStatus =
          filterValues.status.length === 0 ||
          (item.status && filterValues.status.includes(item.status))

        // Organization filter
        const matchesOrganization =
          filterValues.organization.length === 0 ||
          (item.organization &&
            filterValues.organization.includes(item.organization))

        // Expired filter
        const matchesExpired =
          showExpired || item.status !== QuestionnairesStatusEnum.expired

        return (
          matchesSearch &&
          matchesStatus &&
          matchesOrganization &&
          matchesExpired
        )
      }) ?? null,
    )
  }, [filterValues, data, showExpired])

  return (
    <IntroWrapper
      title={formatMessage(messages.questionnaires)}
      intro={formatMessage(messages.questionnairesIntro)}
      loading={loading}
    >
      {!loading && error && (
        <Box marginTop={3}>
          <Problem
            type="internal_service_error"
            noBorder={false}
            error={error}
          />
        </Box>
      )}
      {!loading && !error && (
        <Filter
          variant="popover"
          align="left"
          reverse
          labelClearAll={formatMessage(m.clearAllFilters)}
          labelClear={formatMessage(m.clearFilter)}
          labelOpen={formatMessage(m.openFilter)}
          onFilterClear={() => {
            debouncedSetSearchQuery.cancel()
            setFilterValues(defaultFilterValues)
          }}
          filterInput={
            <Input
              placeholder={formatMessage(m.searchPlaceholder)}
              name="rafraen-skjol-input"
              size="xs"
              label={formatMessage(m.searchLabel)}
              onChange={(e) => handleSearchChange(e.target.value)}
              backgroundColor="blue"
              icon={{ name: 'search' }}
            />
          }
        >
          <Box paddingX={4} paddingY={2}>
            <Text
              variant="default"
              as="p"
              fontWeight="semiBold"
              paddingBottom={2}
            >
              {formatMessage(m.status)}
            </Text>

            <Stack space={2}>
              {[
                {
                  name: 'unanswered',
                  label: formatMessage(messages.unAnsweredQuestionnaire),
                  status: QuestionnairesStatusEnum.notAnswered,
                },
                {
                  name: 'answered',
                  label: formatMessage(messages.answeredQuestionnaire),
                  status: QuestionnairesStatusEnum.answered,
                },
                {
                  name: 'draft',
                  label: formatMessage(messages.draftQuestionnaire),
                  status: QuestionnaireQuestionnairesStatusEnum.draft,
                },
              ].map(({ name, label, status }) => (
                <Checkbox
                  key={name}
                  name={name}
                  label={label}
                  value={name}
                  checked={filterValues.status.includes(status)}
                  onChange={() => {
                    toggleStatus(status)
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Box paddingX={4} paddingBottom={2}>
            <Text
              variant="default"
              as="p"
              fontWeight="semiBold"
              paddingBottom={2}
            >
              {formatMessage(messages.organization)}
            </Text>

            <Stack space={2}>
              {[
                {
                  name: 'lsh',
                  label: formatMessage(messages.landspitali),
                  organization: QuestionnaireQuestionnairesOrganizationEnum.LSH,
                },
                {
                  name: 'el',
                  label: formatMessage(messages.healthDirectorate),
                  organization: QuestionnaireQuestionnairesOrganizationEnum.EL,
                },
              ].map(({ name, label, organization }) => (
                <Checkbox
                  key={name}
                  name={name}
                  label={label}
                  value={name}
                  checked={filterValues.organization.includes(organization)}
                  onChange={() => {
                    toggleOrganization(organization)
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Filter>
      )}
      {!loading &&
        (data?.questionnairesList === null ||
          data?.questionnairesList?.questionnaires?.length === 0) && (
          <Box marginTop={3}>
            <Problem
              type="no_data"
              noBorder={false}
              imgSrc="./assets/images/nodata.svg"
              imgAlt=""
              title={formatMessage(messages.noData)}
              message={formatMessage(messages.noDataFoundDetail, {
                arg: formatMessage(messages.questionnairesThgf).toLowerCase(),
              })}
            />
          </Box>
        )}
      <Box marginTop={5}>
        {loading && <CardLoader />}
        {!loading && !error && dataLength > 0 && (
          <Box
            justifyContent="spaceBetween"
            alignItems="center"
            display="flex"
            marginBottom={2}
            className={styles.toggleBox}
          >
            <Text variant="medium">
              {filteredData?.length === 1
                ? formatMessage(messages.singleQuestionnaire)
                : formatMessage(messages.numberOfQuestionnaires, {
                    number: filteredData?.length,
                  })}
            </Text>
            <ToggleSwitchButton
              className={styles.toggleButton}
              label={formatMessage(messages.showExpiredQuestionnaires)}
              onChange={() => setShowExpired(!showExpired)}
              checked={showExpired}
            />
          </Box>
        )}
        {dataLength > 0 &&
          filterValues.searchQuery.length === 0 &&
          filterValues.status.length === 0 &&
          filterValues.organization.length === 0 &&
          filteredData?.length === 0 &&
          !showExpired && (
            <Problem
              type="no_data"
              noBorder={false}
              title={formatMessage(messages.noData)}
              message={formatMessage(messages.noActiveQuestionnairesRegistered)}
              imgSrc="./assets/images/empty_flower.svg"
              imgAlt=""
            />
          )}
        <Stack space={3}>
          {filteredData?.map((questionnaire) => {
            const status = questionnaire.status
            const isAnswered = status === QuestionnairesStatusEnum.answered
            const isDraft = status === QuestionnairesStatusEnum.draft
            const isExpired = status === QuestionnairesStatusEnum.expired
            return (
              <ActionCard
                key={questionnaire.id}
                heading={questionnaire.title}
                headingVariant="h4"
                subText={questionnaire.description ?? ''}
                eyebrow={
                  questionnaire.organization ===
                  QuestionnaireQuestionnairesOrganizationEnum.EL
                    ? formatMessage(messages.healthDirectorate)
                    : formatMessage(messages.landspitali)
                }
                eyebrowColor="purple400"
                text={formatDate(questionnaire.sentDate)}
                tag={{
                  label: isAnswered
                    ? formatMessage(messages.answeredQuestionnaire)
                    : isExpired
                    ? formatMessage(messages.expiredQuestionnaire)
                    : isDraft
                    ? formatMessage(messages.draftQuestionnaire)
                    : formatMessage(messages.unAnsweredQuestionnaire),

                  outlined: false,
                  variant: isAnswered ? 'blue' : isExpired ? 'red' : 'purple',
                }}
                cta={{
                  label: formatMessage(messages.seeMore),
                  variant: 'text',
                  icon: 'arrowForward',
                  onClick: () =>
                    navigate(
                      HealthPaths.HealthQuestionnairesDetail.replace(
                        ':org',
                        questionnaire.organization?.toLocaleLowerCase() ?? '',
                      ).replace(':id', questionnaire.id),
                    ),
                }}
              />
            )
          })}
        </Stack>
      </Box>
      {!loading &&
        Object.entries(filterValues).some(([key, value]) =>
          key !== 'treatment' && Array.isArray(value)
            ? value.length > 0
            : value.length > 0,
        ) &&
        (filteredData === null || filteredData.length === 0) && (
          <Box marginTop={3}>
            <Problem
              type="no_data"
              noBorder={false}
              title={formatMessage(messages.questionnairesNotFound)}
              message={formatMessage(messages.questionnaireNotFoundWithFilters)}
              imgAlt=""
              imgSrc="./assets/images/empty_flower.svg"
            />
          </Box>
        )}
    </IntroWrapper>
  )
}

export default Questionnaires
