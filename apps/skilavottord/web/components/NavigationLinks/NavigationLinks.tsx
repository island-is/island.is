import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '../Sidenav/Sidenav'
import { UserContext } from '@island.is/skilavottord-web/context'
import { useContext } from 'react'
import { Role } from '@island.is/skilavottord-web/graphql/schema'

export const NavigationLinks = ({
  activeSection,
}: {
  activeSection: number
}) => {
  const {
    t: { recyclingFundSidenav: sidenavText, routes },
  } = useI18n()

  const { user } = useContext(UserContext)

  let title = sidenavText.title
  if (user?.role === Role.municipality) {
    title = sidenavText.municipalityTitle
  }

  return (
    <Sidenav
      title={title}
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
          hidden: user?.role === Role.municipality,
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
