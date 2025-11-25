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
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetQuestionnairesQuery } from './questionnaires.generated'
import { Problem } from '@island.is/react-spa/shared'

const defaultFilterValues = {
  searchQuery: '',
  status: [],
  organization: [],
  treatment: [],
}

type FilterValues = {
  searchQuery: string
  status: QuestionnaireQuestionnairesStatusEnum[] // TODO: switch to enum from graphql
  organization: QuestionnaireQuestionnairesOrganizationEnum[] // TODO: switch to enum from graphql
  treatment: string[] // TODO: switch to enum from graphql
}

const Questionnaires: React.FC = () => {
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const [filterValues, setFilterValues] =
    useState<FilterValues>(defaultFilterValues)
  const [filteredData, setFilteredData] = useState<QuestionnairesBaseItem[]>([])

  const { data, loading, error } = useGetQuestionnairesQuery({
    variables: {
      locale: lang,
    },
  })

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

        return matchesSearch && matchesStatus && matchesOrganization
      }) || [],
    )
  }, [filterValues, data])

  return (
    <IntroWrapper
      title={formatMessage(messages.questionnaires)}
      intro={formatMessage(messages.questionnairesIntro)}
      loading={loading}
    >
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
                  name: 'expired',
                  label: formatMessage(messages.expiredQuestionnaire),
                  status: QuestionnairesStatusEnum.expired,
                },
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
                  label: 'Landspítali',
                  organization: QuestionnaireQuestionnairesOrganizationEnum.LSH,
                },
                {
                  name: 'el',
                  label: 'Embætti Landlæknis',
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
      {!loading && data?.questionnairesList === null && (
        <Box marginTop={3}>
          <Problem type="no_data" noBorder={false} />
        </Box>
      )}
      <Box marginTop={5}>
        <Stack space={3}>
          {loading && <CardLoader />}
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
                    ? 'Embætti Landlæknis'
                    : 'Landspítali'
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
        (filterValues.status.length > 0 ||
          filterValues.searchQuery.length > 0) &&
        filteredData.length === 0 && (
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
