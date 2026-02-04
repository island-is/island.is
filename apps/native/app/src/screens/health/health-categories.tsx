import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { ScrollView } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import calendarIcon from '../../assets/icons/calendar.png'
import medicineIcon from '../../assets/icons/medicine.png'
import readerIcon from '../../assets/icons/reader.png'
import vaccinationsIcon from '../../assets/icons/vaccinations.png'
import { LinkContainer } from '../../components/external-links/external-links'
import { MoreInfoContiner } from '../../components/more-info-container/more-info-container'
import { getConfig } from '../../config'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'

const NUMBER_OF_CARDS_PER_ROW = 3

const Container = styled.View`
  flex: 1;
`

const ContentContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[4]}px;
  gap: ${({ theme }) => theme.spacing[4]}px;
`

const CategoriesContainer = styled.View`
  row-gap: ${({ theme }) => theme.spacing[0]}px;
  margin-horizontal: ${({ theme }) => -theme.spacing[2]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'health.categories.screenTitle' }),
      },
    },
  }))

export const HealthCategoriesScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const origin = getConfig().apiUrl.replace(/\/api$/, '')

  const isVaccinationsEnabled = useFeatureFlag(
    'isVaccinationsEnabled',
    false,
    null,
  )
  const isPrescriptionsEnabled = useFeatureFlag(
    'isPrescriptionsEnabled',
    false,
    null,
  )
  const isQuestionnaireFeatureEnabled = useFeatureFlag(
    'isQuestionnaireEnabled',
    false,
    null,
  )
  const isAppointmentsEnabled = useFeatureFlag(
    'isAppointmentsEnabled',
    false,
    null,
  )

  const healthCardRows = useMemo(() => {
    const healthCards = [
      {
        id: 'medicine',
        titleId: 'health.overview.medicine',
        icon: medicineIcon,
        route: '/prescriptions',
        enabled: isPrescriptionsEnabled,
        subLinks: [
          {
            id: 'prescriptions1',
            titleId: 'health.overview.prescriptions',
            url: `${origin}/minarsidur/heilsa/grunnupplysingar/sjukraskra`,
          },
          {
            id: 'prescriptions2',
            titleId: 'health.overview.prescriptions',
            url: `${origin}/minarsidur/heilsa/grunnupplysingar/sjukraskra`,
          },
          {
            id: 'prescriptions3',
            titleId: 'health.overview.prescriptions',
            url: `${origin}/minarsidur/heilsa/grunnupplysingar/sjukraskra`,
          },
        ],
      },
      {
        id: 'appointments',
        titleId: 'health.overview.appointments',
        icon: calendarIcon,
        route: '/appointments',
        enabled: isAppointmentsEnabled,
      },
      {
        id: 'questionnaires',
        titleId: 'health.overview.questionnaires',
        icon: readerIcon,
        route: '/questionnaires',
        enabled: isQuestionnaireFeatureEnabled,
      },
      {
        id: 'vaccinations',
        titleId: 'health.overview.vaccinations',
        icon: vaccinationsIcon,
        route: '/vaccinations',
        enabled: isVaccinationsEnabled,
      },
    ].filter((card) => card.enabled)

    const rows = []
    // Create rows of cards, each row contains NUMBER_OF_CARDS_PER_ROW cards
    for (let i = 0; i < healthCards.length; i += NUMBER_OF_CARDS_PER_ROW) {
      rows.push(healthCards.slice(i, i + NUMBER_OF_CARDS_PER_ROW))
    }

    return rows
  }, [
    isPrescriptionsEnabled,
    isQuestionnaireFeatureEnabled,
    isVaccinationsEnabled,
    isAppointmentsEnabled,
    origin,
  ])

  const externalLinks = [
    {
      id: 'referrals',
      titleId: 'health.categories.referrals',
      url: `${origin}/minarsidur/heilsa/grunnupplysingar/tilvisanir`,
    },
    {
      id: 'paymentsAndRights',
      titleId: 'health.categories.paymentsAndRights',
      url: `${origin}/minarsidur/heilsa/greidslur`,
    },
    {
      id: 'aidsAndNutrition',
      titleId: 'health.overview.aidsAndNutrition',
      url: `${origin}/minarsidur/heilsa/grunnupplysingar/hjalpartaeki-og-naering`,
    },
    {
      id: 'therapy',
      titleId: 'health.overview.therapy',
      url: `${origin}/minarsidur/heilsa/grunnupplysingar/hjalfun`,
    },
    {
      id: 'waitingLists',
      titleId: 'health.categories.waitingLists',
      url: `${origin}/minarsidur/heilsa/grunnupplysingar/bidlistar`,
    },
    {
      id: 'medicalRecords',
      titleId: 'health.categories.medicalRecords',
      url: `${origin}/minarsidur/heilsa/grunnupplysingar/sjukraskra`,
    },
    {
      id: 'basicInformation',
      titleId: 'health.overview.basicInformation',
      url: `${origin}/minarsidur/heilsa/grunnupplysingar`,
    },
  ]

  return (
    <Container>
      <ScrollView>
        <ContentContainer>
          <CategoriesContainer>

            {healthCardRows.flat().map((hc) => (
              <LinkContainer
                componentId={componentId}
                key={hc.id}
                links={{
                  link: hc.route,
                  title: intl.formatMessage({ id: hc.titleId }),
                  icon: hc.icon,
                }}
                subLinks={hc.subLinks?.map((subLink) => ({
                  link: subLink.url,
                  title: intl.formatMessage({ id: subLink.titleId }),
                  isExternal: false,
                }))}
              />
            ))}
          </CategoriesContainer>
          <MoreInfoContiner
            externalLinks={externalLinks.map((link) => ({
              link: link.url,
              title: intl.formatMessage({ id: link.titleId }),
              isExternal: true,
            }))}
            componentId={componentId}
          />
        </ContentContainer>
      </ScrollView>
    </Container>
  )
}

HealthCategoriesScreen.options = getNavigationOptions
