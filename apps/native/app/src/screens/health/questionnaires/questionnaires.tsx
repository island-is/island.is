import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsModalPresentationStyle,
} from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import externalLinkIcon from '../../../assets/icons/external-link.png'
import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
  useGetQuestionnairesQuery,
} from '../../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../../hooks/use-connectivity-indicator'
import { useLocale } from '../../../hooks/use-locale'
import { useBrowser } from '../../../lib/use-browser'
import {
  Problem,
  QuestionnaireCard,
  type QuestionnaireCardAction,
  Skeleton,
} from '../../../ui'
import { ComponentRegistry } from '../../../utils/component-registry'
import { createSkeletonArr } from '../../../utils/create-skeleton-arr'
import { questionnaireUrls } from '../../../utils/url-builder'
import type { QuestionnaireDetailParams } from './questionnaire-detail'
import { getQuestionnaireOrganizationLabelId } from './questionnaire-utils'

const Host = styled(SafeAreaView)`
  flex: 1;
`

const ScrolledView = styled(ScrollView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'health.questionnaires.screenTitle' }),
      },
    },
  }))

export const QuestionnairesScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const { openBrowser } = useBrowser()

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
          onPress: () => openBrowser(link, componentId),
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
    [intl],
  )

  const { data, loading, error, refetch } = useGetQuestionnairesQuery({
    variables: {
      locale,
    },
  })

  const isInitialLoading = loading && !data

  useConnectivityIndicator({
    componentId,
    queryResult: [{ data, loading }],
  })

  const openDetail = useCallback((params: QuestionnaireDetailParams) => {
    Navigation.showModal({
      stack: {
        options: {
          modalPresentationStyle: OptionsModalPresentationStyle.pageSheet,
        },
        children: [
          {
            component: {
              name: ComponentRegistry.QuestionnaireDetailScreen,
              passProps: params,
            },
          },
        ],
      },
    })
  }, [])

  const questionnaires = data?.questionnairesList?.questionnaires ?? []
  return (
    <Host>
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
          const detailParams: QuestionnaireDetailParams = {
            id: item.id,
            organization: item.organization ?? undefined,
          }
          const open = () => openDetail(detailParams)
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

QuestionnairesScreen.options = getNavigationOptions
