import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'

import externalLinkIcon from '@/assets/icons/external-link.png'
import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
  useGetQuestionnairesQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { useBrowser } from '@/hooks/use-browser'
import {
  Problem,
  QuestionnaireCard,
  type QuestionnaireCardAction,
  Skeleton,
} from '@/ui'
import { createSkeletonArr } from '@/utils/create-skeleton-arr'
import { questionnaireUrls } from '@/utils/url-builder'
import { getQuestionnaireOrganizationLabelId } from '../../../../../utils/questionnaire-utils'

const Host = styled(SafeAreaView)`
  flex: 1;
`

const ScrolledView = styled(ScrollView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

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
    (id: string, organization?: QuestionnaireQuestionnairesOrganizationEnum) => {
      router.navigate({
        pathname: '/health/questionnaires/[id]',
        params: { id, organization },
      })
    },
    [router],
  )

  const questionnaires = data?.questionnairesList?.questionnaires ?? []
  return (
    <Host>
      <Stack.Screen
        options={{
          title: intl.formatMessage({
            id: 'health.questionnaires.screenTitle',
          }),
        }}
      />
      <ScrolledView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        contentContainerStyle={{
          paddingTop: theme.spacing[3],
          paddingBottom: theme.spacing[4],
          gap: theme.spacing[2],
        }}
      >
        {isInitialLoading ? (
          <>
            {createSkeletonArr(4).map((item) => (
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
            ))}
          </>
        ) : null}

        {!loading && error && questionnaires.length === 0 ? (
          <Problem error={error} withContainer />
        ) : null}

        {!loading && !error && questionnaires.length === 0 ? (
          <Problem type="no_data" withContainer />
        ) : null}

        {questionnaires.map((item) => {
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
            />
          )
        })}
      </ScrolledView>
    </Host>
  )
}
