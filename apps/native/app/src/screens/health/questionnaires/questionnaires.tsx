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
import {
  Problem,
  QuestionnaireCard,
  type QuestionnaireCardAction,
  Skeleton,
} from '../../../ui'
import { ComponentRegistry } from '../../../utils/component-registry'
import { createSkeletonArr } from '../../../utils/create-skeleton-arr'
import type { QuestionnaireDetailParams } from './questionnaire-detail'
import {
  getQuestionnaireOrganizationLabelId,
  getQuestionnaireStatusLabelId,
} from './questionnaire-utils'

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

  const theme = useTheme()
  const intl = useIntl()
  const locale = useLocale()

  const getActionList = useCallback(
    (
      status: QuestionnaireQuestionnairesStatusEnum | null | undefined,
      onOpen: () => void,
    ): QuestionnaireCardAction[] => {
      if (!status) {
        return []
      }

      const baseAction = {
        icon: externalLinkIcon,
        onPress: onOpen,
      }

      switch (status) {
        case QuestionnaireQuestionnairesStatusEnum.NotAnswered:
          return [
            {
              ...baseAction,
              text: intl.formatMessage({
                id: 'health.questionnaires.action.answer',
              }),
            },
          ]
        case QuestionnaireQuestionnairesStatusEnum.Answered:
          return [
            {
              ...baseAction,
              text: intl.formatMessage({
                id: 'health.questionnaires.action.view-answer',
              }),
            },
          ]
        case QuestionnaireQuestionnairesStatusEnum.Draft:
          return [
            {
              ...baseAction,
              text: intl.formatMessage({
                id: 'health.questionnaires.action.continue-draft',
              }),
            },
            {
              ...baseAction,
              text: intl.formatMessage({
                id: 'health.questionnaires.action.view-answer',
              }),
            },
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
              actionList={getActionList(item.status, open)}
            />
          )
        })}
      </ScrolledView>
    </Host>
  )
}

QuestionnairesScreen.options = getNavigationOptions
