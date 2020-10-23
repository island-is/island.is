import { ServicePortalPath } from '@island.is/service-portal/core'
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
    heading: defineMessage({
      id: 'service.portal:user-info',
      defaultMessage: 'Mínar upplýsingar',
    }),
    subtext: defineMessage({
      id: 'sp.family:user-info-card-description',
      defaultMessage:
        'Við viljum að stafræn þjónusta sé aðgengileg, sniðin að notandanum og með skýra framtíðarsýn. Hér fyrir neðan getur þú lesið okkar helstu.',
    }),
    link: ServicePortalPath.UserInfo,
    image: '/assets/images/individuals.jpg',
  },
  // {
  //   heading: defineMessage({
  //     id: 'service.portal:my-info-family',
  //     defaultMessage: 'Fjölskyldan',
  //   }),
  //   subtext: defineMessage({
  //     id: 'service.portal:my-info-family-subtext',
  //     defaultMessage:
  //       'Hönnunarkerfi Ísland.is auðveldar okkur að setja nýja þjónustu í loftið á stuttum tíma, og einfaldar rekstur og viðhald stafrænnar þjónustu hins opinbera til.',
  //   }),
  //   link: '',
  //   image: '/assets/images/baby.jpg',
  // },
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
  //   image: '/assets/images/moving.jpg',
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
  //   image: '/assets/images/jobs.jpg',
  // },
]
