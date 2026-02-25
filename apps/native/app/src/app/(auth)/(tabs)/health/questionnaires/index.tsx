import { useRouter } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, RefreshControl } from 'react-native'
import { useTheme } from 'styled-components/native'

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

  const { data, loading, error, refetch } = useGetQuestionnairesQuery({
    variables: {
      locale,
    },
  })

  const isInitialLoading = loading && !data

  const openDetail = useCallback(
    (
      id: string,
      organization?: QuestionnaireQuestionnairesOrganizationEnum,
    ) => {
      router.navigate({
        pathname: '/health/questionnaires/[id]',
        params: { id, organization },
      })
    },
    [router],
  )

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      const open = () => openDetail(item.id, item.organization ?? undefined)
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
            marginBottom: theme.spacing[2]
          }}
        />
      )
    },
    [getActionList, intl, openDetail],
  )

  const questionnaires = useMemo(
    () =>
      (data?.questionnairesList?.questionnaires ?? [])
        .filter(
          (item, index, self) =>
            item?.id && index === self.findIndex((t) => t?.id === item?.id),
        )
        .slice(0, 64), // @todo needs paging
    [data],
  )

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
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
                  height={112}
                  style={{
                    borderRadius: 8,
                  }}
                />
              ))
            : null}
        </>
      }
    />
  )
}
