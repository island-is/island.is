import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapperV2 } from '@island.is/portals/my-pages/core'
import { moduleMessages as m } from '../../lib/messages'

/**
 * TODO: Replace this hook with a real API query once the unemployment
 * service client is integrated (e.g. `useGetUnemploymentStatusQuery`).
 *
 * Change `isOnUnemployment` to `true` to preview the active-benefit state.
 */
const useUnemploymentStatus = () => {
  return { isOnUnemployment: true, loading: false }
}

// Atvinnuleysi – yfirlit
const UnemploymentOverview = () => {
  useNamespaces('sp.support-maintenance')
  const { formatMessage } = useLocale()
  const { isOnUnemployment, loading } = useUnemploymentStatus()

  return (
    <IntroWrapperV2
      title={formatMessage(m.unemployment)}
      intro={formatMessage(m.unemploymentDescription)}
      serviceProvider={{
        slug: 'vinnumalastofnun',
        tooltip: 'TODO Add tooltip',
      }}
      loading={loading}
    >
      {isOnUnemployment ? (
        // ── Active: user is currently receiving unemployment benefits ─────────
        <Box>ACTIVE unemployment...</Box>
      ) : (
        // ── Inactive: user is not on unemployment – show apply CTA ───────────
        <Box>NO unemployment...</Box>
      )}
    </IntroWrapperV2>
  )
}

export default UnemploymentOverview
