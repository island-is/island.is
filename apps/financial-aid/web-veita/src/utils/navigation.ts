import {
  ApplicationFiltersEnum,
  ApplicationHeaderSortByEnum,
} from '@island.is/financial-aid/shared/lib'

export const navigationItems = [
  {
    group: 'Innhólf',
    label: 'Ný mál',
    link: `/nymal`,
    applicationState: [ApplicationFiltersEnum.NEW],
    headers: [
      { title: 'Nafn', sortBy: 'name' },
      { title: 'Staða', sortBy: 'state' },
      { title: 'Tími án umsjár', sortBy: 'modified' },
      { title: 'Tímabil', sortBy: 'created' },
      { title: 'Umsjá', sortBy: 'name' },
    ],
    defaultHeaderSort: ApplicationHeaderSortByEnum.CREATED,
  },
  {
    group: 'Mitt',
    label: 'Mál í vinnslu',
    link: `/vinnslu`,
    applicationState: [ApplicationFiltersEnum.MYCASES],
    headers: [
      { title: 'Nafn', sortBy: 'name' },
      { title: 'Staða', sortBy: 'state' },
      { title: 'Síðast uppfært', sortBy: 'modified' },
      { title: 'Tímabil', sortBy: 'created' },
      { title: 'Unnið af', sortBy: 'name' },
    ],
    defaultHeaderSort: ApplicationHeaderSortByEnum.MODIFIED,
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
      { title: 'Nafn', sortBy: 'name' },
      { title: 'Staða', sortBy: 'state' },
      { title: 'Úrlausnartími', sortBy: 'modified' },
      { title: 'Tímabil', sortBy: 'created' },
      { title: 'Unnið af', sortBy: 'name' },
    ],
    defaultHeaderSort: ApplicationHeaderSortByEnum.MODIFIED,
  },
  {
    label: 'Afgreidd mál',
    link: `/afgreidd`,
    applicationState: [
      ApplicationFiltersEnum.APPROVED,
      ApplicationFiltersEnum.REJECTED,
    ],
    headers: [
      { title: 'Nafn', sortBy: 'name' },
      { title: 'Staða', sortBy: 'state' },
      { title: 'Úrlausnartími', sortBy: 'modified' },
      { title: 'Tímabil', sortBy: 'created' },
      { title: 'Unnið af', sortBy: 'name' },
    ],
    defaultHeaderSort: ApplicationHeaderSortByEnum.MODIFIED,
  },
]
