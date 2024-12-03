import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '../Sidenav/Sidenav'

export const NavigationLinks = ({
  activeSection,
}: {
  activeSection: number
}) => {
  const {
    t: { recyclingFundSidenav: sidenavText, routes },
  } = useI18n()

  return (
    <Sidenav
      title={sidenavText.title}
      sections={[
        {
          icon: 'car',
          title: `${sidenavText.recycled}`,
          link: `${routes.recycledVehicles}`,
        },
        {
          icon: 'people',
          title: `${sidenavText.municipalities}`,
          link: `${routes.municipalities.baseRoute}`,
        },
        {
          icon: 'business',
          title: `${sidenavText.companies}`,
          link: `${routes.recyclingCompanies.baseRoute}`,
        },
        {
          icon: 'lockClosed',
          title: `${sidenavText.accessControl}`,
          link: `${routes.accessControl}`,
        },
      ]}
      activeSection={activeSection}
    />
  )
}
export default NavigationLinks
