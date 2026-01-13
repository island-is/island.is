import React, { useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import externalLinkIcon from '../../../assets/icons/external-link.png'
import eyeOffIcon from '../../../assets/icons/eye-off.png'
import {
  QuestionnaireQuestionnairesOrganizationEnum,
  useGetQuestionnaireQuery,
} from '../../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../../hooks/create-navigation-option-hooks'
import { useLocale } from '../../../hooks/use-locale'
import { useBrowser } from '../../../lib/use-browser'
import { Button, NavigationBarSheet, Problem, Typography } from '../../../ui'
import {
  getQuestionnaireOrganizationLabelId,
  getQuestionnaireStatusLabelId,
} from './questionnaire-utils'

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

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

type QuestionnaireStatus = 'answered' | 'unanswered'

export type QuestionnaireDetailParams = {
  id: string
  organization?: QuestionnaireQuestionnairesOrganizationEnum
}

export const QuestionnaireDetailScreen: NavigationFunctionComponent<{
  id?: string
  organization?: QuestionnaireQuestionnairesOrganizationEnum
}> = ({ componentId, id, organization }) => {
  useNavigationOptions(componentId)
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

  console.log('data', data)

  const questionnaire = data?.questionnairesDetail ?? null
  const base = questionnaire?.baseInformation ?? null

  const title = useMemo(() => base?.title ?? '', [base?.title])

  const close = useCallback(() => {
    Navigation.dismissModal(componentId)
  }, [componentId])

  const onAnswer = useCallback(() => {
    // TODO: wire to questionnaire answering flow (API-driven)
    return
  }, [])

  const onView = useCallback(() => {
    // TODO: wire to questionnaire answers view (API-driven)
    return
  }, [])

  const onHide = useCallback(() => {
    // no-op for now (wired to API later)
  }, [])

  if (!id) {
    return (
      <Host>
        <NavigationBarSheet
          componentId={componentId}
          onClosePress={close}
          style={{ marginHorizontal: 16 }}
        />
        <Content>
          <View>
            <Typography variant="heading3">
              <FormattedMessage
                id="health.questionnaires.detail.notFound"
                defaultMessage="Spurningalisti fannst ekki"
              />
            </Typography>
          </View>
        </Content>
      </Host>
    )
  }

  if (loading && !base) {
    return (
      <Host>
        <NavigationBarSheet
          componentId={componentId}
          onClosePress={close}
          style={{ marginHorizontal: 16 }}
        />
        <Content>
          <View style={{ paddingVertical: theme.spacing[2] }}>
            <ActivityIndicator />
          </View>
        </Content>
      </Host>
    )
  }

  if (!loading && error && !base) {
    return (
      <Host>
        <NavigationBarSheet
          componentId={componentId}
          onClosePress={close}
          style={{ marginHorizontal: 16 }}
        />
        <Content>
          <Problem error={error} withContainer />
        </Content>
      </Host>
    )
  }

  if (!loading && !error && !base) {
    return (
      <Host>
        <NavigationBarSheet
          componentId={componentId}
          onClosePress={close}
          style={{ marginHorizontal: 16 }}
        />
        <Content>
          <Problem type="no_data" withContainer />
        </Content>
      </Host>
    )
  }

  return (
    <Host>
      <NavigationBarSheet
        componentId={componentId}
        onClosePress={close}
        title={title}
        style={{ marginHorizontal: 16 }}
      />

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
              <Button
                title={intl.formatMessage({
                  id: 'health.questionnaires.action.answer',
                })}
                onPress={onAnswer}
                isFilledUtilityButton
                compactPadding
                icon={externalLinkIcon}
                ellipsis
              />
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
              <Button
                title={intl.formatMessage({
                  id: 'health.questionnaires.action.hide',
                })}
                isOutlined
                isUtilityButton
                compactPadding
                onPress={onHide}
                icon={eyeOffIcon}
                ellipsis
              />
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

QuestionnaireDetailScreen.options = getNavigationOptions
