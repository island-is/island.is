import {
  Box,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapperV2 } from '@island.is/portals/my-pages/core'
import { Link } from 'react-router-dom'
import { moduleMessages as m } from '../../lib/messages'
import { SupportMaintenancePaths } from '../../lib/paths'
import { SupportMaintenanceCard } from '../../components'

// Framfærsla – yfirlit
const Overview = () => {
  useNamespaces('sp.support-maintenance')
  const { formatMessage } = useLocale()

  return (
    <IntroWrapperV2
      title={formatMessage(m.supportMaintenanceRootTitle)}
      intro={formatMessage(m.supportMaintenanceIntro)}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12']}>
            <Box display={'flex'} flexDirection={'column'} rowGap={2}>
              <SupportMaintenanceCard
                logo="./assets/images/skjaldarmerki.svg"
                heading="Atvinnuleysisbætur"
                text="Yfirlit yfir þínar atvinnuleysisbætur, réttindi og annað sem tengist atvinnuleitinni"
                tag={{ label: 'Frestun: Vantar gögn', variant: 'purple' }}
                cta={{
                  label: 'Skoða nánar',
                  href: SupportMaintenancePaths.SupportMaintenanceUnemploymentRoot,
                }}
              />
              <SupportMaintenanceCard
                logo="./assets/images/skjaldarmerki.svg"
                heading="Atvinnuleysisbætur"
                text="Yfirlit yfir þínar atvinnuleysisbætur, réttindi og annað sem tengist atvinnuleitinni"
                tag={{ label: 'Frestun: Vantar gögn', variant: 'purple' }}
                cta={{
                  label: 'Skoða nánar',
                  href: SupportMaintenancePaths.SupportMaintenanceUnemploymentRoot,
                }}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </IntroWrapperV2>
  )
}

export default Overview
