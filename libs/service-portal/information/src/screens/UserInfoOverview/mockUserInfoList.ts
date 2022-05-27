import { ServicePortalPath, m } from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { MessageDescriptor } from 'react-intl'

export type UserInfoItem = {
  heading: MessageDescriptor | string
  subtext: MessageDescriptor | string
  link: string
  image: string
}

export const mockUserInfoList: UserInfoItem[] = [
  {
    heading: m.userInfo,
    subtext: defineMessage({
      id: 'sp.family:user-info-card-description',
      defaultMessage:
        'Við viljum að stafræn þjónusta sé aðgengileg, sniðin að notandanum og með skýra framtíðarsýn.',
    }),
    link: ServicePortalPath.UserInfo,
    image: '/assets/images/individualsGrid.svg',
  },
  {
    heading: m.family,
    subtext:
      'Hönnunarkerfi Ísland.is auðveldar okkur að setja nýja þjónustu í loftið á stuttum tíma, og einfaldar rekstur og viðhald stafrænnar þjónustu hins opinbera til.',
    link: ServicePortalPath.FamilyRoot,
    image: '/assets/images/familyGrid.svg',
  },
  // {
  //   heading: defineMessage({
  //     id: 'service.portal:my-info-housing',
  //     defaultMessage: 'Fasteignir',
  //   }),
  //   subtext: defineMessage({
  //     id: 'service.portal:my-info-housing-subtext',
  //     defaultMessage:
  //       'Markmið verkefnisins er að smíða kerfi, Viskuausuna, sem veitir upplýsingar um gögn og vefþjónustur ríkisins til notenda.',
  //   }),
  //   link: '',
  //   image: '/assets/images/sofa.svg',
  // },
  // {
  //   heading: defineMessage({
  //     id: 'service.portal:my-info-vehicles',
  //     defaultMessage: 'Ökutæki',
  //   }),
  //   subtext: defineMessage({
  //     id: 'service.portal:my-info-vehicles-subtext',
  //     defaultMessage:
  //       'Markmið verkefnisins er að smíða kerfi, Viskuausuna, sem veitir upplýsingar um gögn og vefþjónustur ríkisins til notenda.',
  //   }),
  //   link: '',
  //   image: '/assets/images/movingTruck.svg',
  // },
]
