import React, { useCallback, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import externalLinkIcon from '../../../assets/icons/external-link.png'
import eyeOffIcon from '../../../assets/icons/eye-off.png'
import { createNavigationOptionHooks } from '../../../hooks/create-navigation-option-hooks'
import { useBrowser } from '../../../lib/use-browser'
import { Button, NavigationBarSheet, Typography } from '../../../ui'

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

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

type QuestionnaireStatus = 'answered' | 'unanswered'

export type QuestionnaireItem = {
  id: string
  organization: string
  title: string
  status: QuestionnaireStatus
  sentDate: string
  treatment?: string
  institution?: string
  sentBy?: string
  validTo?: string
  answerUrl?: string
}

export const QuestionnaireDetailScreen: NavigationFunctionComponent<{
  questionnaire?: QuestionnaireItem
}> = ({ componentId, questionnaire }) => {
  useNavigationOptions(componentId)
  const theme = useTheme()
  const intl = useIntl()
  const { openBrowser } = useBrowser()
  const item = questionnaire

  const title = useMemo(() => item?.title ?? '', [item?.title])

  const close = useCallback(() => {
    Navigation.dismissModal(componentId)
  }, [componentId])

  const onAnswer = useCallback(() => {
    if (!item?.answerUrl) return
    openBrowser(item.answerUrl, componentId)
  }, [componentId, item?.answerUrl, openBrowser])

  const onView = useCallback(() => {
    if (!item?.answerUrl) return
    openBrowser(item.answerUrl, componentId)
  }, [componentId, 'https://www.google.com', openBrowser])

  const onHide = useCallback(() => {
    // no-op for now (wired to API later)
  }, [])

  if (!item) {
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

  return (
    <Host>
      <NavigationBarSheet
        componentId={componentId}
        onClosePress={close}
        title={item.title}
        style={{ marginHorizontal: 16 }}
      />

      <ScrollView style={{ flex: 1 }} contentInset={{ bottom: 24 }}>
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
              <Label variant="eyebrow">
                <FormattedMessage id="health.questionnaires.detail.status" />
              </Label>
              <Typography variant="heading4">
                <FormattedMessage
                  id={
                    item.status === 'answered'
                      ? 'health.questionnaires.status.answered'
                      : 'health.questionnaires.status.unanswered'
                  }
                />
              </Typography>
            </InfoRow>

            {item.treatment ? (
              <InfoRow>
                <Label variant="eyebrow">
                  <FormattedMessage id="health.questionnaires.detail.treatment" />
                </Label>
                <Typography variant="heading4">{item.treatment}</Typography>
              </InfoRow>
            ) : null}

            {item.institution ? (
              <InfoRow>
                <Label variant="eyebrow">
                  <FormattedMessage id="health.questionnaires.detail.institution" />
                </Label>
                <Typography variant="heading4">{item.institution}</Typography>
              </InfoRow>
            ) : null}

            {item.sentBy ? (
              <InfoRow>
                <Label variant="eyebrow">
                  <FormattedMessage id="health.questionnaires.detail.sentBy" />
                </Label>
                <Typography variant="heading4">{item.sentBy}</Typography>
              </InfoRow>
            ) : null}

            {item.validTo ? (
              <InfoRow>
                <Label variant="eyebrow">
                  <FormattedMessage id="health.questionnaires.detail.validTo" />
                </Label>
                <Typography variant="heading4">
                  {intl.formatDate(item.validTo)}
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
