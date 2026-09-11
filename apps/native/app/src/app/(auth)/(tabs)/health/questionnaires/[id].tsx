import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { RefreshControl, ScrollView, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'

import { StackScreen } from '@/components/stack-screen'
import externalLinkIcon from '@/assets/icons/external-link.png'
import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
  useGetQuestionnaireQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { useBrowser } from '@/hooks/use-browser'
import {
  Button,
  Input,
  InputRow,
  NavigationBarSheet,
  Problem,
  Typography,
} from '@/ui'
import { questionnaireUrls } from '@/utils/url-builder'
import {
  getQuestionnaireOrganizationLabelId,
  getQuestionnaireStatusLabelId,
} from '../../../../../utils/questionnaire-utils'

const Content = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const ButtonRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing[1]}px;
  flex-wrap: wrap;
`

export default function QuestionnaireDetailScreen() {
  const {
    id,
    organization: orgParam,
    title: titleParam,
  } = useLocalSearchParams<{
    id: string
    organization?: string
    title?: string
  }>()
  const organization = orgParam as
    | QuestionnaireQuestionnairesOrganizationEnum
    | undefined
  const theme = useTheme()
  const intl = useIntl()
  const locale = useLocale()
  const { openBrowser } = useBrowser()
  const shouldSkipQuery = !id || !organization
  const { data, loading, error, refetch, networkStatus } =
    useGetQuestionnaireQuery({
      variables: {
        locale,
        input: {
          id: id ?? '',
          organization:
            organization as QuestionnaireQuestionnairesOrganizationEnum,
        },
      },
      skip: shouldSkipQuery,
    })

  const questionnaire = data?.questionnairesDetail ?? null
  const base = questionnaire?.baseInformation ?? null

  const title = useMemo(
    () => base?.title || titleParam || '',
    [base?.title, titleParam],
  )

  const [refetching, setRefetching] = useState(false)

  const onRefresh = useCallback(async () => {
    if (shouldSkipQuery) {
      return
    }
    setRefetching(true)
    try {
      await refetch()
    } finally {
      setRefetching(false)
    }
  }, [refetch, shouldSkipQuery])

  const close = useCallback(() => {
    router.back()
  }, [])

  const onAnswer = useCallback(() => {
    if (!organization || !id) return

    openBrowser(questionnaireUrls.answer({ organization, id }))
  }, [organization, id, openBrowser])

  const onView = useCallback(() => {
    if (!organization || !id) return

    openBrowser(
      questionnaireUrls.viewAnswer({
        organization,
        id,
        submissionId:
          questionnaire?.baseInformation?.lastSubmissionId ?? undefined,
      }),
    )
  }, [
    organization,
    id,
    questionnaire?.baseInformation?.lastSubmissionId,
    openBrowser,
  ])

  let errorContent: React.ReactNode = null

  if (!id || !organization) {
    errorContent = (
      <View>
        <Typography variant="heading3">
          <FormattedMessage
            id="health.questionnaires.detail.notFound"
            defaultMessage="Spurningalisti fannst ekki"
          />
        </Typography>
      </View>
    )
  } else if (!loading && error && !base) {
    errorContent = <Problem error={error} withContainer />
  } else if (!loading && !error && !base) {
    errorContent = <Problem type="no_data" withContainer />
  }

  const isAnswered =
    base?.status === QuestionnaireQuestionnairesStatusEnum.Answered
  const isDraft = base?.status === QuestionnaireQuestionnairesStatusEnum.Draft
  const isNotAnswered =
    base?.status === QuestionnaireQuestionnairesStatusEnum.NotAnswered
  const hasSubmissions = (questionnaire?.submissions?.length ?? 0) > 0
  const canSubmit = questionnaire?.canSubmit ?? false
  const canSubmitAgain = canSubmit && hasSubmissions
  const isInitialLoading = loading && !base

  return (
    <>
      <StackScreen
        closeable
        networkStatus={networkStatus}
        options={{ title: '' }}
      />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
      >
        {errorContent ? (
          errorContent
        ) : (
          <>
            <Content>
              <Typography variant="heading2">{title}</Typography>
              {base?.description ? (
                <Typography variant="body">{base.description}</Typography>
              ) : null}
              <View
                style={
                  base?.description
                    ? { marginTop: theme.spacing[1] }
                    : undefined
                }
              >
                <ButtonRow>
                  {(isNotAnswered || isDraft) && (
                    <Button
                      title={intl.formatMessage({
                        id: isDraft
                          ? 'health.questionnaires.action.continue-draft'
                          : 'health.questionnaires.action.answer',
                      })}
                      onPress={onAnswer}
                      isFilledUtilityButton
                      icon={externalLinkIcon}
                      ellipsis
                      // Match the outlined button's 1px border box so both
                      // buttons render at the same height.
                      style={{ borderWidth: 1, borderColor: 'transparent' }}
                    />
                  )}
                  {!isDraft && canSubmitAgain && (
                    <Button
                      title={intl.formatMessage({
                        id: 'health.questionnaires.action.answer-again',
                      })}
                      onPress={onAnswer}
                      isFilledUtilityButton
                      icon={externalLinkIcon}
                      ellipsis
                      // Match the outlined button's 1px border box so both
                      // buttons render at the same height.
                      style={{ borderWidth: 1, borderColor: 'transparent' }}
                    />
                  )}
                  {(isAnswered || isDraft) && hasSubmissions && (
                    <Button
                      title={intl.formatMessage({
                        id: 'health.questionnaires.action.view-answer',
                      })}
                      onPress={onView}
                      isUtilityButton
                      isOutlined
                      icon={externalLinkIcon}
                      ellipsis
                    />
                  )}
                </ButtonRow>
              </View>
            </Content>

            <InputRow>
              <Input
                size="normal"
                loading={isInitialLoading}
                label={intl.formatMessage({
                  id: 'health.questionnaires.detail.status',
                })}
                value={
                  base?.status
                    ? intl.formatMessage({
                        id: getQuestionnaireStatusLabelId(base.status),
                      })
                    : ''
                }
                hideWhenEmpty
              />
            </InputRow>
            <InputRow>
              <Input
                size="normal"
                loading={isInitialLoading}
                label={intl.formatMessage({
                  id: 'health.questionnaires.detail.institution',
                })}
                value={
                  base?.senderGroupName ||
                  (base?.organization
                    ? intl.formatMessage({
                        id: getQuestionnaireOrganizationLabelId(
                          base.organization,
                        ),
                      })
                    : '')
                }
                hideWhenEmpty
              />
            </InputRow>
            <InputRow>
              <Input
                size="normal"
                loading={isInitialLoading}
                label={intl.formatMessage({
                  id: 'health.questionnaires.detail.sentDate',
                })}
                value={
                  base?.sentDate ? intl.formatDate(new Date(base.sentDate)) : ''
                }
                hideWhenEmpty
              />
            </InputRow>
            <InputRow>
              <Input
                size="normal"
                loading={isInitialLoading}
                label={intl.formatMessage({
                  id: 'health.questionnaires.detail.sentBy',
                })}
                value={questionnaire?.sender ?? ''}
                hideWhenEmpty
              />
            </InputRow>
            <InputRow>
              <Input
                size="normal"
                loading={isInitialLoading}
                label={intl.formatMessage({
                  id: 'health.questionnaires.detail.expirationDate',
                })}
                value={
                  questionnaire?.expirationDate
                    ? intl.formatDate(new Date(questionnaire.expirationDate))
                    : ''
                }
                hideWhenEmpty
              />
            </InputRow>
          </>
        )}
      </ScrollView>
    </>
  )
}
