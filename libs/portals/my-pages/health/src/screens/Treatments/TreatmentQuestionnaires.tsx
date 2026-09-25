import { QuestionnaireQuestionnairesStatusEnum as QuestionnairesStatusEnum } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  Filter,
  Input,
  Stack,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  STAFRAEN_HEILSA_SLUG,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { debounceTime } from '@island.is/shared/constants'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import QuestionnaireCard from '../Questionnaires/components/QuestionnaireCard'
import { useGetTreatmentQuestionnairesQuery } from './TreatmentQuestionnaires.generated'

type UseParams = {
  treatmentId: string
}

const TreatmentQuestionnaires = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const { treatmentId } = useParams() as UseParams

  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuestionnairesStatusEnum[]>(
    [],
  )

  const { data, loading, error } = useGetTreatmentQuestionnairesQuery({
    variables: { treatmentId, locale: lang },
    fetchPolicy: 'network-only',
  })

  // Expired questionnaires are only shown on the main questionnaires page
  const questionnaires = (
    data?.questionnairesTreatmentList?.questionnaires ?? []
  ).filter((item) => item.status !== QuestionnairesStatusEnum.expired)

  const statusFilterOptions = [
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
      status: QuestionnairesStatusEnum.draft,
    },
  ]

  const toggleStatus = (status: QuestionnairesStatusEnum) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    )
  }

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => setSearchQuery(value), debounceTime.search),
    [],
  )

  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel()
    }
  }, [debouncedSetSearchQuery])

  const handleSearchChange = (value: string) => {
    setInputValue(value)
    debouncedSetSearchQuery(value)
  }

  const searchLower = searchQuery.trim().toLowerCase()
  const visible = questionnaires
    .filter(
      (item) =>
        !searchLower ||
        item.senderGroupName?.toLowerCase().includes(searchLower) ||
        item.title?.toLowerCase().includes(searchLower),
    )
    .filter(
      (item) =>
        statusFilter.length === 0 ||
        (!!item.status && statusFilter.includes(item.status)),
    )

  const isFiltered = !!searchLower || statusFilter.length > 0

  return (
    <IntroWrapper
      title={formatMessage(messages.treatmentQuestionnaires)}
      intro={formatMessage(messages.treatmentQuestionnairesIntro)}
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaTreatmentTooltip),
      }}
      desktopContentSpan="10/12"
    >
      {error && !loading ? (
        <Problem type="internal_service_error" noBorder={false} error={error} />
      ) : loading ? (
        <CardLoader />
      ) : questionnaires.length === 0 ? (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noData)}
          message={formatMessage(messages.noTreatmentQuestionnaires)}
          imgSrc="./assets/images/empty_flower.svg"
          imgAlt=""
        />
      ) : (
        <>
          <Box marginBottom={3}>
            <Filter
              variant="popover"
              align="left"
              reverse
              filterInputFluid
              mobileWrap={false}
              labelClearAll={formatMessage(m.clearAllFilters)}
              labelClear={formatMessage(m.clearFilter)}
              labelOpen={formatMessage(m.openFilter)}
              filterCount={statusFilter.length}
              onFilterClear={() => {
                debouncedSetSearchQuery.cancel()
                setInputValue('')
                setSearchQuery('')
                setStatusFilter([])
              }}
              filterInput={
                <Input
                  placeholder={formatMessage(m.searchPlaceholder)}
                  aria-label={formatMessage(m.searchLabel)}
                  name="treatment-questionnaires-search-input"
                  size="xs"
                  value={inputValue}
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
                  {statusFilterOptions.map(({ name, label, status }) => (
                    <Checkbox
                      key={name}
                      name={name}
                      label={label}
                      value={name}
                      checked={statusFilter.includes(status)}
                      onChange={() => toggleStatus(status)}
                    />
                  ))}
                </Stack>
              </Box>
            </Filter>
          </Box>
          {/* Always mounted so screen readers announce result changes */}
          <Box role="status">
            <VisuallyHidden>
              {isFiltered &&
                formatMessage(messages.numberOfQuestionnairesFound, {
                  number: visible.length,
                })}
            </VisuallyHidden>
          </Box>
          {visible.length === 0 ? (
            <Problem
              type="no_data"
              noBorder={false}
              title={formatMessage(messages.questionnairesNotFound)}
              message={formatMessage(messages.questionnaireNotFoundWithFilters)}
              imgSrc="./assets/images/empty_flower.svg"
              imgAlt=""
            />
          ) : (
            <Stack space={3}>
              {visible.map((questionnaire) => (
                <QuestionnaireCard
                  key={questionnaire.id}
                  questionnaire={questionnaire}
                />
              ))}
            </Stack>
          )}
        </>
      )}
    </IntroWrapper>
  )
}

export default TreatmentQuestionnaires
