import { Breadcrumbs, GridContainer, Tabs } from '@island.is/island-ui/core'
import { linkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import AflamarkCalculator from './components/AflamarkCalculator'

const tabs = [
  { label: 'Mælaborð', content: () => null },
  { label: 'Reiknivél aflamarks', content: <AflamarkCalculator /> },
  { label: 'Reiknivél deilistofna', content: () => null },
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

      <Tabs
        contentBackground="white"
        label="fiskistofa-calculator-tabs"
        tabs={tabs}
      />
    </>
  )
}

export default withMainLayout(Calculator)
