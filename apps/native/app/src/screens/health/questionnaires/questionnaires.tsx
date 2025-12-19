import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsModalPresentationStyle,
} from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import externalLinkIcon from '../../../assets/icons/external-link.png'
import { createNavigationOptionHooks } from '../../../hooks/create-navigation-option-hooks'
import { QuestionnaireCard } from '../../../ui'
import { ComponentRegistry } from '../../../utils/component-registry'

type QuestionnaireStatus = 'answered' | 'unanswered'

type QuestionnaireItem = {
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

const mockQuestionnaires: QuestionnaireItem[] = [
  {
    id: 'dt-1',
    organization: 'Landspítalinn',
    title: 'DT - Mat á vanlíðan',
    status: 'unanswered',
    sentDate: '2022-06-23T00:00:00.000Z',
    treatment: 'Krabbameinsmeðferð',
    institution: 'Krabbameinsdeild, Landspítalinn',
    sentBy: 'Kristín Skúladóttir, Hjúkrunarfræðingur',
    validTo: '2026-04-01T00:00:00.000Z',
    answerUrl: 'https://island.is/minarsidur/heilsa/spurningalistar/dt-1',
  },
  {
    id: 'esas-1',
    organization: 'Landspítalinn',
    title: 'ESAS - Mat á einkennum',
    status: 'answered',
    sentDate: '2022-06-23T00:00:00.000Z',
    treatment: 'Eftirlit',
    institution: 'Göngudeild, Landspítalinn',
    sentBy: 'Starfsmaður Landspítalans',
    validTo: '2026-04-01T00:00:00.000Z',
    answerUrl: 'https://island.is/minarsidur/heilsa/spurningalistar/esas-1',
  },
  {
    id: 'heilsugaesla-1',
    organization: 'Heilsugæslan',
    title: 'Spurningalisti þunglyndi',
    status: 'unanswered',
    sentDate: '2022-06-23T00:00:00.000Z',
    treatment: 'Heilsugæsla',
    institution: 'Heilsugæsla höfuðborgarsvæðisins',
    sentBy: 'Starfsmaður Heilsugæslunnar',
    validTo: '2026-04-01T00:00:00.000Z',
    answerUrl:
      'https://island.is/minarsidur/heilsa/spurningalistar/heilsugaesla-1',
  },
]

const Host = styled(View)`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
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

  const openDetail = useCallback((questionnaire: QuestionnaireItem) => {
    Navigation.showModal({
      stack: {
        options: {
          modalPresentationStyle: OptionsModalPresentationStyle.pageSheet,
        },
        children: [
          {
            component: {
              name: ComponentRegistry.QuestionnaireDetailScreen,
              passProps: { questionnaire },
            },
          },
        ],
      },
    })
  }, [])

  return (
    <Host>
      <ScrollView
        contentContainerStyle={{
          paddingTop: theme.spacing[3],
          paddingBottom: theme.spacing[4],
          gap: theme.spacing[2],
        }}
      >
        {mockQuestionnaires.map((item) => (
          <QuestionnaireCard
            key={item.id}
            title={item.title}
            organization={item.organization}
            date={new Date(item.sentDate)}
            status={item.status}
            statusLabel={intl.formatMessage({
              id:
                item.status === 'answered'
                  ? 'health.questionnaires.status.answered'
                  : 'health.questionnaires.status.unanswered',
            })}
            onPress={() => openDetail(item)}
            actionList={
              item.status === 'unanswered'
                ? [
                    {
                      text: intl.formatMessage({
                        id: 'health.questionnaires.action.answer',
                      }),
                      icon: externalLinkIcon,
                      onPress: () => openDetail(item),
                    },
                  ]
                : []
            }
          />
        ))}
      </ScrollView>
    </Host>
  )
}

QuestionnairesScreen.options = getNavigationOptions
