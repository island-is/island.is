import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapperV2 } from '@island.is/portals/my-pages/core'
import { moduleMessages as m } from '../../lib/messages'
import { SupportMaintenancePaths } from '../../lib/paths'
import {
  SupportMaintenanceCard,
  SupportMaintenanceCardProps,
} from '../../components'

/**
 * TODO: Replace this hook with a real API query once the unemployment
 * service client is integrated (e.g. `useGetUnemploymentStatusQuery`).
 *
 * Change `isOnUnemployment` to `true` to preview the active-benefit state.
 */
const useUnemploymentStatus = () => {
  return { isOnUnemployment: true, loading: false }
}

interface BenefitConfig {
  id: string
  isActive: boolean
  /** Shown when the user is actively receiving this benefit. */
  activeCard: SupportMaintenanceCardProps
  /** Shown when the benefit is available but not yet active. */
  infoCard: SupportMaintenanceCardProps
}

// Framfærsla – yfirlit
const Overview = () => {
  useNamespaces('sp.support-maintenance')
  const { isOnUnemployment } = useUnemploymentStatus()
  const { formatMessage } = useLocale()

  /**
   * Add new support types here as they become available (e.g. Activation
   * Grant / Virknistyrkur). Each entry drives both the active and info card
   * states automatically.
   */
  const benefits: BenefitConfig[] = [
    {
      id: 'unemployment',
      isActive: isOnUnemployment,
      activeCard: {
        logo: './assets/images/skjaldarmerki.svg',
        heading: 'Atvinnuleysisbætur',
        text: 'Yfirlit yfir þínar atvinnuleysisbætur, réttindi og annað sem tengist atvinnuleitinni',
        tag: { label: 'Frestun: Vantar gögn', variant: 'purple' },
        cta: {
          label: 'Skoða nánar',
          href: SupportMaintenancePaths.SupportMaintenanceUnemploymentRoot,
        },
      },
      infoCard: {
        variant: 'bottom',
        logo: './assets/images/skjaldarmerki.svg',
        heading: 'Vinnumálastofnun',
        text: 'Vinnumálastofnun sér um allt í tengslum við atvinnuleysisbætur og virknistyrk. Hægt er að nálgast nánari upplýsingar á upplýsingasíðu Vinnumálastofnunar.',
        tags: [{ label: 'Atvinnuleysisbætur', variant: 'blue' }],
        cta: { label: 'Nánari upplýsingar', href: '/...' },
      },
    },
    // TODO: Activation Grant / Virknistyrkur
    // {
    //   id: 'activation-grant',
    //   isActive: isOnActivationGrant,
    //   activeCard: { ... },
    //   infoCard: { ... },
    // },
  ]

  return (
    <IntroWrapperV2
      title={formatMessage(m.supportMaintenanceRootTitle)}
      intro={formatMessage(m.supportMaintenanceIntro)}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12']}>
            <Box display="flex" flexDirection="column" rowGap={2}>
              {benefits.map(({ id, isActive, activeCard, infoCard }) => (
                <SupportMaintenanceCard
                  key={id}
                  {...(isActive ? activeCard : infoCard)}
                />
              ))}
              <SupportMaintenanceCard
                variant="bottom"
                logo={'./assets/images/skjaldarmerki.svg'}
                heading="Tryggingastofnun"
                text="Tryggingastofnun sér um allt í tengslum við lífeyrissjóðsgreiðslur. Hægt er að nálgast nánari upplýsingar á upplýsingasíðu Tryggingastofnunar."
                tags={[
                  { label: 'Örorkulífeyri', variant: 'blue' },
                  { label: 'Ellilífeyri', variant: 'blue' },
                ]}
                cta={{ label: 'Nánari upplýsingar', href: '/...' }}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </IntroWrapperV2>
  )
}

export default Overview
