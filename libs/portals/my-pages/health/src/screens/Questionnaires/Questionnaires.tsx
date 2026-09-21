import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum as QuestionnairesStatusEnum,
  QuestionnairesBaseItem,
} from '@island.is/api/schema'
import {
  ActionCard,
  Box,
  Checkbox,
  Filter,
  Input,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { debounceTime } from '@island.is/shared/constants'
import debounce from 'lodash/debounce'
import { FC, ReactNode, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetQuestionnairesQuery } from './questionnaires.generated'
import { Problem } from '@island.is/react-spa/shared'
import * as styles from './Questionnaires.css'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const Questionnaires: FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  useHealthPlausibleSwap()
  const navigate = useNavigate()

  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuestionnairesStatusEnum[]>(
    [],
  )

  const { data, loading, error } = useGetQuestionnairesQuery({
    variables: {
      locale: lang,
    },
    fetchPolicy: 'network-only',
  })

  const questionnaires = data?.questionnairesList?.questionnaires ?? []
  const dataIsEmpty =
    data?.questionnairesList === null || questionnaires.length === 0

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
      debounce((value: string) => {
        setSearchQuery(value)
      }, debounceTime.search),
    [],
  )

  const handleSearchChange = (value: string) => {
    setInputValue(value)
    debouncedSetSearchQuery(value)
  }

  const matchesSearch = (item: QuestionnairesBaseItem) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      !searchLower ||
      item.senderGroupName?.toLowerCase().includes(searchLower) ||
      item.organization?.toLowerCase().includes(searchLower) ||
      item.title?.toLowerCase().includes(searchLower)
    )
  }

  const matchesStatus = (item: QuestionnairesBaseItem) =>
    statusFilter.length === 0 ||
    (!!item.status && statusFilter.includes(item.status))

  const activeAll = questionnaires.filter(
    (item) => item.status !== QuestionnairesStatusEnum.expired,
  )
  const activeVisible = activeAll.filter(matchesSearch).filter(matchesStatus)

  const expiredAll = questionnaires.filter(
    (item) => item.status === QuestionnairesStatusEnum.expired,
  )
  const expiredVisible = expiredAll.filter(matchesSearch)

  const searchInput = (
    <Input
      placeholder={formatMessage(m.searchPlaceholder)}
      aria-label={formatMessage(m.searchLabel)}
      name="questionnaires-search-input"
      size="xs"
      value={inputValue}
      onChange={(e) => handleSearchChange(e.target.value)}
      backgroundColor="blue"
      icon={{ name: 'search' }}
    />
  )

  const renderQuestionnaireCard = (questionnaire: QuestionnairesBaseItem) => {
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
          questionnaire.senderGroupName ??
          (questionnaire.organization ===
          QuestionnaireQuestionnairesOrganizationEnum.EL
            ? formatMessage(messages.healthDirectorate)
            : formatMessage(messages.landspitali))
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
          variant: isAnswered ? 'blue' : isExpired ? 'red' : 'purple',
        }}
        cta={{
          label: formatMessage(messages.questionnaireSeeMore),
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
  }

  const renderQuestionnaireList = (
    visible: QuestionnairesBaseItem[],
    emptyState: ReactNode,
  ) => {
    if (loading) {
      return <CardLoader />
    }
    if (error) {
      return (
        <Problem type="internal_service_error" noBorder={false} error={error} />
      )
    }
    if (visible.length === 0) {
      return emptyState
    }
    return <Stack space={3}>{visible.map(renderQuestionnaireCard)}</Stack>
  }

  const notFoundEmptyState = (
    <Problem
      type="no_data"
      noBorder={false}
      title={formatMessage(messages.questionnairesNotFound)}
      message={formatMessage(messages.questionnaireNotFoundWithFilters)}
      imgAlt=""
      imgSrc="./assets/images/empty_flower.svg"
    />
  )

  const activeEmptyState =
    activeAll.length === 0 ? (
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(messages.noData)}
        message={formatMessage(messages.noActiveQuestionnairesRegistered)}
        imgSrc="./assets/images/empty_flower.svg"
        imgAlt=""
      />
    ) : (
      notFoundEmptyState
    )

  const expiredEmptyState =
    expiredAll.length === 0 ? (
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(messages.noData)}
        message={formatMessage(messages.noExpiredQuestionnairesRegistered)}
        imgSrc="./assets/images/empty_flower.svg"
        imgAlt=""
      />
    ) : (
      notFoundEmptyState
    )

  return (
    <IntroWrapper
      title={formatMessage(messages.questionnaires)}
      intro={formatMessage(messages.questionnairesIntro)}
      loading={loading}
      desktopContentSpan="10/12"
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
      {!loading && !error && dataIsEmpty && (
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
      {!loading && !error && !dataIsEmpty && (
        <Box marginTop={[4, 4, 4, 3]}>
          <Tabs
            label={formatMessage(messages.questionnaires)}
            selected="active"
            size="xs"
            contentBackground="transparent"
            onlyRenderSelectedTab
            tabs={[
              {
                id: 'active',
                label: formatMessage(messages.valid),
                content: (
                  <Box paddingTop={3}>
                    <Box marginBottom={3}>
                      <Filter
                        variant="popover"
                        align="left"
                        reverse
                        filterInputFluid
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
                        filterInput={searchInput}
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
                            {statusFilterOptions.map(
                              ({ name, label, status }) => (
                                <Checkbox
                                  key={name}
                                  name={name}
                                  label={label}
                                  value={name}
                                  checked={statusFilter.includes(status)}
                                  onChange={() => toggleStatus(status)}
                                />
                              ),
                            )}
                          </Stack>
                        </Box>
                      </Filter>
                    </Box>
                    {renderQuestionnaireList(activeVisible, activeEmptyState)}
                  </Box>
                ),
              },
              {
                id: 'expired',
                label: formatMessage(messages.expiredQuestionnaires),
                content: (
                  <Box paddingTop={3}>
                    {expiredAll.length > 0 && (
                      <Box marginBottom={3} className={styles.searchInput}>
                        {searchInput}
                      </Box>
                    )}
                    {renderQuestionnaireList(expiredVisible, expiredEmptyState)}
                  </Box>
                ),
              },
            ]}
          />
        </Box>
      )}
    </IntroWrapper>
  )
}

export default Questionnaires
