import { Breadcrumbs, GridContainer, Tabs } from '@island.is/island-ui/core'
import { linkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { AflamarkCalculator } from './components/AflamarkCalculator'
import { Dashboard } from './components/Dashboard'
import { DeilistofnaCalculator } from './components/DeilistofnaCalculator'

// TODO: stop using tabs component
const tabs = [
  { label: 'Mælaborð', content: <Dashboard /> },
  { label: 'Reiknivél aflamarks', content: <AflamarkCalculator /> },
  { label: 'Reiknivél deilistofna', content: <DeilistofnaCalculator /> },
]

const breadcrumbItems = [
  {
    title: 'Ísland.is',
    href: linkResolver('homepage').href,
  },
  {
    title: 'Fiskistofa',
    href: linkResolver('organizationpage', ['fiskistofa']).href,
  },
]

const Calculator = () => {
  return (
    <>
      <GridContainer>
        <Breadcrumbs items={breadcrumbItems} />
      </GridContainer>

      <Tabs contentBackground="white" label="Valin sýn" tabs={tabs} />
    </>
  )
}

export default withMainLayout(Calculator)
