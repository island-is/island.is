import { ApplicationFiltersEnum } from '@island.is/financial-aid/shared/lib'

export const navigationItems = [
  {
    group: 'Innhólf',
    label: 'Ný mál',
    link: `/nymal`,
    applicationState: [ApplicationFiltersEnum.NEW],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða' },
      { title: 'Tími án umsjár' },
      { title: 'Tímabil' },
      { title: 'Umsjá' },
    ],
  },
  {
    group: 'Mitt',
    label: 'Mál í vinnslu',
    link: `/vinnslu`,
    applicationState: [ApplicationFiltersEnum.MYCASES],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða' },
      { title: 'Síðast uppfært' },
      { title: 'Tímabil' },
      { title: 'Unnið af' },
    ],
  },
  {
    group: 'Teymið',
    label: 'Öll mál í vinnslu',
    link: `/teymid`,
    applicationState: [
      ApplicationFiltersEnum.INPROGRESS,
      ApplicationFiltersEnum.DATANEEDED,
    ],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða' },
      { title: 'Úrlausnartími' },
      { title: 'Tímabil' },
      { title: 'Unnið af' },
    ],
  },
  {
    label: 'Afgreidd mál',
    link: `/afgreidd`,
    applicationState: [
      ApplicationFiltersEnum.APPROVED,
      ApplicationFiltersEnum.REJECTED,
    ],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða' },
      { title: 'Úrlausnartími' },
      { title: 'Tímabil' },
      { title: 'Unnið af' },
    ],
  },
]
