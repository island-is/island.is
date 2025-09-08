import { QuestionnairesStatusEnum } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  Filter,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ActionCard,
  formatDate,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { debounceTime } from '@island.is/shared/constants'
import debounce from 'lodash/debounce'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetQuestionnairesQuery } from './questionnaries.generated'

const ITEMS_ON_PAGE = 10

const defaultFilterValues = {
  searchQuery: '',
  status: [],
  organization: [],
  treatment: [],
}

type FilterValues = {
  searchQuery: string
  status: string[] // TODO: switch to enum from graphql
  organization: string[] // TODO: switch to enum from graphql
  treatment: string[] // TODO: switch to enum from graphql
}

const Questionnaires: React.FC = () => {
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const [filterValues, setFilterValues] =
    useState<FilterValues>(defaultFilterValues)

  const { data, loading, error } = useGetQuestionnairesQuery({
    variables: {
      locale: lang,
    },
  })

  console.log(data)
  const toggleStatus = (
    status: any, // TODO: switch to enum from graphql
  ) => {
    setFilterValues((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
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
  return (
    <IntroWrapper
      title={formatMessage(messages.questionnaires)}
      intro={formatMessage(messages.questionnairesIntro)}
    >
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
        <Box padding={4}>
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
      </Filter>
      <Box marginTop={5}>
        <Stack space={3}>
          {data?.questionnairesList?.questionnaires?.map((questionnaire) => (
            <ActionCard
              key={questionnaire.id}
              heading={questionnaire.title}
              text={`Sent dags: ${formatDate(questionnaire.sentDate)}`}
              eyebrow={questionnaire.organization ?? undefined}
              tag={{
                label:
                  questionnaire.status === QuestionnairesStatusEnum.answered
                    ? formatMessage(messages.answeredQuestionnaire)
                    : questionnaire.status ===
                      QuestionnairesStatusEnum.notAnswered
                    ? formatMessage(messages.unAnsweredQuestionnaire)
                    : formatMessage(messages.expiredQuestionnaire),

                outlined: false,
                variant:
                  questionnaire.status === QuestionnairesStatusEnum.answered
                    ? 'blue'
                    : questionnaire.status ===
                      QuestionnairesStatusEnum.notAnswered
                    ? 'purple'
                    : 'red',
              }}
              cta={{
                internalUrl: HealthPaths.HealthQuestionnairesDetail.replace(
                  ':id',
                  questionnaire.id,
                ),
                label: formatMessage(messages.answer), //TODO: if status is unanswered the label should be "svara" else "sjá nánar"
                variant: 'text',
                icon: 'arrowForward',
                onClick: () =>
                  navigate(
                    HealthPaths.HealthQuestionnairesDetail.replace(
                      ':id',
                      questionnaire.id,
                    ),
                  ),
              }}
            />
          ))}
        </Stack>
      </Box>
    </IntroWrapper>
  )
}

export default Questionnaires
