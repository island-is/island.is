import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import calendarIcon from '@/assets/icons/calendar.png'
import medicineIcon from '@/assets/icons/medicine.png'
import readerIcon from '@/assets/icons/reader.png'
import vaccinationsIcon from '@/assets/icons/vaccinations.png'
import { LinkRowButton } from '@/components/link-row-button/link-row-button'
import { MoreInfoContiner } from '@/components/more-info-container/more-info-container'
import { getConfig } from '@/config'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { Href } from 'expo-router'

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

type CardItem = {
  id: string
  titleId: string
  icon: any
  route: Href
  enabled: boolean
  subLinks?: Sublink[]
}

type Sublink = {
  id: string
  titleId: string
  route: Href
}

export default function HealthCategoriesScreen() {
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
    const medicineSubLinks = (
      [
        isPrescriptionsEnabled && {
          id: 'prescriptions',
          titleId: 'health.prescriptions.title',
          route: '/health/medicine/prescriptions',
        },
        isMedicineDelegationEnabled && {
          id: 'medicineDelegation',
          titleId: 'health.medicineDelegation.screenTitle',
          route: '/health/medicine/delegation',
        },
        {
          id: 'drugCertificates',
          titleId: 'health.drugCertificates.title',
          route: '/health/medicine/prescriptions',
        },
        isPrescriptionsEnabled && {
          id: 'medicineHistory',
          titleId: 'health.medicineHistory.title',
          route: '/health/medicine/prescriptions/history',
        },
      ] as (Sublink | boolean)[]
    ).filter((v): v is Sublink => !!v)

    // Neither prescriptions nor medicine delegation are enabled, so we just display drug certificates
    const isMedicineEnabled =
      isPrescriptionsEnabled || isMedicineDelegationEnabled

    return (
      [
        {
          id: 'medicine',
          titleId: !isMedicineEnabled
            ? 'health.drugCertificates.title'
            : 'health.overview.medicine',
          icon: medicineIcon,
          route: '/health/medicine/prescriptions',
          enabled: true,
          subLinks: isMedicineEnabled ? medicineSubLinks : [],
        },
        {
          id: 'appointments',
          titleId: 'health.overview.appointments',
          icon: calendarIcon,
          route: '/health/appointments',
          enabled: isAppointmentsEnabled,
        },
        {
          id: 'questionnaires',
          titleId: 'health.overview.questionnaires',
          icon: readerIcon,
          route: '/health/questionnaires',
          enabled: isQuestionnaireFeatureEnabled,
        },
        {
          id: 'vaccinations',
          titleId: 'health.overview.vaccinations',
          icon: vaccinationsIcon,
          route: '/health/vaccinations',
          enabled: isVaccinationsEnabled,
        },
      ] as CardItem[]
    ).filter((card) => card.enabled)
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
    <ScrollView style={{flex: 1}}>
      <ContentContainer>
        <CategoriesContainer>
          {healthCardRows.map((hc) => (
            <LinkRowButton
              key={hc.id}
              link={{
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
        />
      </ContentContainer>
    </ScrollView>
  )
}
