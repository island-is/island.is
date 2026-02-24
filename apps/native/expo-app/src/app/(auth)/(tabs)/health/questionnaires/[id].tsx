import React, { useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import styled, { useTheme } from 'styled-components/native'

import externalLinkIcon from '@/assets/icons/external-link.png'
import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
  useGetQuestionnaireQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { useBrowser } from '@/lib/use-browser'
import { Button, NavigationBarSheet, Problem, Typography } from '@/ui'
import { questionnaireUrls } from '@/utils/url-builder'
import {
  getQuestionnaireOrganizationLabelId,
  getQuestionnaireStatusLabelId,
} from '@/screens/health/questionnaires/questionnaire-utils'

const Host = styled.View`
  flex: 1;
`

const Content = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[4]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const ButtonRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing[1]}px;
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const InfoRow = styled.View`
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${({ theme }) => theme.color.blue200};
`

const Label = styled(Typography)`
  color: ${({ theme }) => theme.color.dark300};
`

const RowHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export default function QuestionnaireDetailScreen() {
  const { id, organization: orgParam } = useLocalSearchParams<{
    id: string
    organization?: string
  }>()
  const organization = orgParam as
    | QuestionnaireQuestionnairesOrganizationEnum
    | undefined
  const theme = useTheme()
  const intl = useIntl()
  const locale = useLocale()
  const { openBrowser } = useBrowser()
  const shouldSkipQuery = !id
  const { data, loading, error, refetch } = useGetQuestionnaireQuery({
    variables: {
      locale,
      input: {
        id: id ?? '',
        organization: organization ?? undefined,
      },
    },
    skip: shouldSkipQuery,
  })

  const questionnaire = data?.questionnairesDetail ?? null
  const base = questionnaire?.baseInformation ?? null

  const title = useMemo(() => base?.title ?? '', [base?.title])

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

  if (!id) {
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
  } else if (loading && !base) {
    errorContent = (
      <View style={{ paddingVertical: theme.spacing[2] }}>
        <ActivityIndicator />
      </View>
    )
  } else if (!loading && error && !base) {
    errorContent = <Problem error={error} withContainer />
  } else if (!loading && !error && !base) {
    errorContent = <Problem type="no_data" withContainer />
  }

  if (errorContent) {
    return (
      <Host>
        <Stack.Screen options={{ title: '', headerShown: false }} />
        <NavigationBarSheet
          componentId="questionnaire-detail"
          onClosePress={close}
          style={{ marginHorizontal: 16 }}
        />
        <Content>{errorContent}</Content>
      </Host>
    )
  }

  const isAnswered =
    base?.status === QuestionnaireQuestionnairesStatusEnum.Answered
  const isDraft = base?.status === QuestionnaireQuestionnairesStatusEnum.Draft
  const isNotAnswered =
    base?.status === QuestionnaireQuestionnairesStatusEnum.NotAnswered

  return (
    <Host>
      <Stack.Screen options={{ title }} />

      <ScrollView
        style={{ flex: 1 }}
        contentInset={{ bottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <Content>
          <Typography variant="body">
            <FormattedMessage id="health.questionnaires.detail.description" />
          </Typography>
          <View>
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
                />
              )}
              {(isAnswered || isDraft) && (
                <Button
                  title={intl.formatMessage({
                    id: 'health.questionnaires.action.view-answer',
                  })}
                  onPress={onView}
                  isUtilityButton
                  isOutlined
                  compactPadding
                  icon={externalLinkIcon}
                  ellipsis
                />
              )}
            </ButtonRow>
          </View>

          <View>
            <InfoRow>
              <RowHeader>
                <Label variant="eyebrow">
                  <FormattedMessage id="health.questionnaires.detail.status" />
                </Label>
              </RowHeader>
              <Typography variant="heading4">
                <FormattedMessage
                  id={getQuestionnaireStatusLabelId(base?.status)}
                />
              </Typography>
            </InfoRow>

            {base?.organization ? (
              <InfoRow>
                <RowHeader>
                  <Label variant="eyebrow">
                    <FormattedMessage id="health.questionnaires.detail.institution" />
                  </Label>
                </RowHeader>
                <Typography variant="heading4">
                  <FormattedMessage
                    id={getQuestionnaireOrganizationLabelId(base?.organization)}
                  />
                </Typography>
              </InfoRow>
            ) : null}

            {base?.sentDate ? (
              <InfoRow>
                <RowHeader>
                  <Label variant="eyebrow">
                    <FormattedMessage id="health.questionnaires.detail.sentDate" />
                  </Label>
                </RowHeader>
                <Typography variant="heading4">
                  {intl.formatDate(new Date(base?.sentDate ?? ''))}
                </Typography>
              </InfoRow>
            ) : null}
          </View>
        </Content>
      </ScrollView>
    </Host>
  )
}
