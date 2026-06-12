import { useRouter } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, RefreshControl } from 'react-native'
import { useTheme } from 'styled-components/native'

import { StackScreen } from '@/components/stack-screen'
import externalLinkIcon from '@/assets/icons/external-link.png'
import {
  GetQuestionnairesQueryResult,
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
  useGetQuestionnairesQuery,
} from '@/graphql/types/schema'
import { useBrowser } from '@/hooks/use-browser'
import { useLocale } from '@/hooks/use-locale'
import {
  Problem,
  QuestionnaireCard,
  type QuestionnaireCardAction,
  Skeleton,
} from '@/ui'
import { createSkeletonArr } from '@/utils/create-skeleton-arr'
import { getQuestionnaireOrganizationLabelId } from '@/utils/questionnaire-utils'
import { questionnaireUrls } from '@/utils/url-builder'

type Item = NonNullable<
  NonNullable<
    NonNullable<GetQuestionnairesQueryResult['data']>['questionnairesList']
  >['questionnaires']
>[number]

export default function QuestionnairesScreen() {
  const { openBrowser } = useBrowser()
  const router = useRouter()

  const theme = useTheme()
  const intl = useIntl()
  const locale = useLocale()

  const getActionList = useCallback(
    (
      status: QuestionnaireQuestionnairesStatusEnum | null | undefined,
      organization:
        | QuestionnaireQuestionnairesOrganizationEnum
        | null
        | undefined,
      id: string | null | undefined,
      submissionId?: string,
    ): QuestionnaireCardAction[] => {
      if (!status || !organization || !id) {
        return []
      }

      const urlParams = { organization, id }

      const getActionData = (messageid: string, link: string) => {
        return {
          icon: externalLinkIcon,
          onPress: () => openBrowser(link),
          text: intl.formatMessage({ id: messageid }),
        }
      }

      switch (status) {
        case QuestionnaireQuestionnairesStatusEnum.NotAnswered:
          return [
            getActionData(
              'health.questionnaires.action.answer',
              questionnaireUrls.answer(urlParams),
            ),
          ]
        case QuestionnaireQuestionnairesStatusEnum.Answered:
          return [
            getActionData(
              'health.questionnaires.action.view-answer',
              questionnaireUrls.viewAnswer({ ...urlParams, submissionId }),
            ),
          ]
        case QuestionnaireQuestionnairesStatusEnum.Draft:
          return [
            getActionData(
              'health.questionnaires.action.continue-draft',
              questionnaireUrls.continueDraft(urlParams),
            ),
            getActionData(
              'health.questionnaires.action.view-answer',
              questionnaireUrls.viewAnswer({ ...urlParams, submissionId }),
            ),
          ]
        default:
          return []
      }
    },
    [intl, openBrowser],
  )

  const { data, loading, error, refetch, networkStatus } =
    useGetQuestionnairesQuery({
      variables: {
        locale,
      },
    })

  const isInitialLoading = loading && !data
  const [refetching, setRefetching] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefetching(true)
    try {
      await refetch()
    } finally {
      setRefetching(false)
    }
  }, [refetch])

  const openDetail = useCallback(
    (
      id: string,
      organization?: QuestionnaireQuestionnairesOrganizationEnum,
      title?: string,
    ) => {
      router.navigate({
        pathname: '/health/questionnaires/[id]',
        params: { id, organization, title },
      })
    },
    [router],
  )

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      const open = () =>
        openDetail(item.id, item.organization ?? undefined, item.title)
      return (
        <QuestionnaireCard
          key={item.id}
          title={item.title}
          organization={intl.formatMessage({
            id: getQuestionnaireOrganizationLabelId(item.organization),
          })}
          date={new Date(item.sentDate)}
          status={
            item.status ?? QuestionnaireQuestionnairesStatusEnum.NotAnswered
          }
          onPress={open}
          actionList={getActionList(
            item.status,
            item.organization,
            item.id,
            item.lastSubmissionId ?? undefined,
          )}
          style={{
            marginBottom: theme.spacing[2],
          }}
        />
      )
    },
    [getActionList, intl, openDetail],
  )

  const questionnaires = useMemo(() => {
    const seen = new Set<string>()
    const result: Item[] = []
    for (const item of data?.questionnairesList?.questionnaires ?? []) {
      if (!item?.id || seen.has(item.id)) continue
      seen.add(item.id)
      result.push(item)
    }
    return result
  }, [data])

  return (
    <>
      <StackScreen networkStatus={networkStatus} />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        style={{
          paddingHorizontal: theme.spacing[2],
          flex: 1,
        }}
        initialNumToRender={6}
        data={questionnaires}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <>
            {!loading && error && questionnaires.length === 0 ? (
              <Problem error={error} withContainer />
            ) : null}

            {!loading && !error && questionnaires.length === 0 ? (
              <Problem type="no_data" withContainer />
            ) : null}
            {isInitialLoading
              ? createSkeletonArr(4).map((item) => (
                  <Skeleton
                    key={item.id}
                    active
                    backgroundColor={{
                      dark: theme.shades.dark.shade300,
                      light: theme.color.blue100,
                    }}
                    overlayColor={{
                      dark: theme.shades.dark.shade200,
                      light: theme.color.blue200,
                    }}
                    overlayOpacity={1}
                    height={140}
                    style={{
                      borderRadius: 8,
                      marginBottom: theme.spacing[2],
                    }}
                  />
                ))
              : null}
          </>
        }
      />
    </>
  )
}
