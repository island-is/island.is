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
  const isMedicineDelegationEnabled = useFeatureFlag(
    'isMedicineDelegationEnabled',
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
    // Build the medicine subLinks based on feature flags
    const medicineSubLinks = [
      ...(isPrescriptionsEnabled
        ? [
            {
              id: 'prescriptions',
              titleId: 'health.prescriptions.title',
              route: '/prescriptions',
            },
          ]
        : []),
      ...(isMedicineDelegationEnabled
        ? [
            {
              id: 'medicineDelegation',
              titleId: 'health.medicineDelegation.screenTitle',
              route: '/prescriptions',
            },
          ]
        : []),
      {
        id: 'drugCertificates',
        titleId: 'health.drugCertificates.title',
        route: '/prescriptions',
      },
      ...(isPrescriptionsEnabled
        ? [
            {
              id: 'medicineHistory',
              titleId: 'health.medicineHistory.title',
              route: '/prescriptions',
            },
          ]
        : []),
    ]

    // Neither prescriptions nor medicine delegation are enabled, so we just display drug certificates
    const isMedicineEnabled =
      isPrescriptionsEnabled || isMedicineDelegationEnabled

    const healthCards = [
      {
        id: 'medicine',
        titleId: !isMedicineEnabled
          ? 'health.drugCertificates.title'
          : 'health.overview.medicine',
        icon: medicineIcon,
        route: '/prescriptions',
        enabled: true,
        subLinks: isMedicineEnabled ? medicineSubLinks : null,
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
    isMedicineDelegationEnabled,
    isQuestionnaireFeatureEnabled,
    isVaccinationsEnabled,
    isAppointmentsEnabled,
  ])

  const externalLinks = [
    {
      id: 'referrals',
      titleId: 'health.categories.referrals',
      url: `${origin}/minarsidur/heilsa/tilvisanir`,
    },
    {
      id: 'paymentsAndRights',
      titleId: 'health.categories.paymentsAndRights',
      url: `${origin}/minarsidur/heilsa/greidslur`,
    },
    {
      id: 'aidsAndNutrition',
      titleId: 'health.overview.aidsAndNutrition',
      url: `${origin}/minarsidur/heilsa/hjalpartaeki-og-naering`,
    },
    {
      id: 'therapy',
      titleId: 'health.overview.therapy',
      url: `${origin}/minarsidur/heilsa/thjalfun`,
    },
    {
      id: 'medicalRecords',
      titleId: 'health.categories.medicalRecords',
      url: `${origin}/minarsidur/heilsa/sjukraskra/heimildir`,
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
                  link: subLink.route,
                  title: intl.formatMessage({ id: subLink.titleId }),
                  isExternal: false,
                  tabId: subLink.id,
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
