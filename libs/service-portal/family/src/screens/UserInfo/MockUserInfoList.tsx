export interface userInfoItem {
  headingMessageId: string
  headingDefaultMessage: string
  subtextId: string
  subtextDefaultMessage: string
  link: string
  image: string
}

export const MockUserInfoList: userInfoItem[] = [
  {
    headingMessageId: 'service.portal:my-info-my-info',
    headingDefaultMessage: 'Mínar upplýsingar',
    subtextId: 'service.portal:my-info-my-info-subtext',
    subtextDefaultMessage:
      'Við viljum að stafræn þjónusta sé aðgengileg, sniðin að notandanum og með skýra framtíðarsýn. Hér fyrir neðan getur þú lesið okkar helstu.',
    link: '',
    image: '/assets/images/individuals.jpg',
  },
  {
    headingMessageId: 'service.portal:my-info-family',
    headingDefaultMessage: 'Fjölskyldan',
    subtextId: 'service.portal:my-info-family-subtext',
    subtextDefaultMessage:
      'Hönnunarkerfi Ísland.is auðveldar okkur að setja nýja þjónustu í loftið á stuttum tíma, og einfaldar rekstur og viðhald stafrænnar þjónustu hins opinbera til.',
    link: '',
    image: '/assets/images/baby.jpg',
  },
  {
    headingMessageId: 'service.portal:my-info-housing',
    headingDefaultMessage: 'Fasteignir',
    subtextId: 'service.portal:my-info-housing-subtext',
    subtextDefaultMessage:
      'Markmið verkefnisins er að smíða kerfi, Viskuausuna, sem veitir upplýsingar um gögn og vefþjónustur ríkisins til notenda.',
    link: '',
    image: '/assets/images/moving.jpg',
  },
  {
    headingMessageId: 'service.portal:my-info-vehicles',
    headingDefaultMessage: 'Ökutæki',
    subtextId: 'service.portal:my-info-vehicles-subtext',
    subtextDefaultMessage:
      'Markmið verkefnisins er að smíða kerfi, Viskuausuna, sem veitir upplýsingar um gögn og vefþjónustur ríkisins til notenda.',
    link: '',
    image: '/assets/images/jobs.jpg',
  },
]
