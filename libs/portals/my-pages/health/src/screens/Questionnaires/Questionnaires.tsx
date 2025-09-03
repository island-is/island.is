import { useLocale } from '@island.is/localization'
import { ActionCard, IntroWrapper, m } from '@island.is/portals/my-pages/core'
import React, { useMemo, useState } from 'react'
import { messages } from '../../lib/messages'
import {
  Box,
  Checkbox,
  Filter,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import debounce from 'lodash/debounce'
import { debounceTime } from '@island.is/shared/constants'
import { HealthPaths } from '../../lib/paths'
import { useNavigate } from 'react-router-dom'

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
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [filterValues, setFilterValues] =
    useState<FilterValues>(defaultFilterValues)

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
                status: 'expired', // TODO: switch to enum from graphql
              },
              {
                name: 'unanswered',
                label: formatMessage(messages.unAnsweredQuestionnaire),
                status: 'unanswered', // TODO: switch to enum from graphql
              },
              {
                name: 'answered',
                label: formatMessage(messages.answeredQuestionnaire),
                status: 'answered', // TODO: switch to enum from graphql
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
        <ActionCard
          heading="DT - Mat á vanlíðan"
          text="Sent dags: 12.04.2012"
          eyebrow="Landspítali"
          tag={{ label: 'Ósvarað', outlined: false, variant: 'purple' }}
          cta={{
            url: undefined,
            internalUrl: HealthPaths.HealthQuestionnairesDetail.replace(
              ':id',
              '1',
            ),
            label: formatMessage(messages.answer), //TODO: if status is unanswered the label should be "svara" else "sjá nánar"
            variant: 'text',
            size: undefined,
            icon: 'arrowForward',
            iconType: undefined,
            onClick: () =>
              navigate(
                HealthPaths.HealthQuestionnairesDetail.replace(':id', '1'),
              ),
            disabled: undefined,
            centered: undefined,
            hide: undefined,
            callback: undefined,
          }}
        />
      </Box>
    </IntroWrapper>
  )
}

export default Questionnaires
