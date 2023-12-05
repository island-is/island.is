import {
  ApplicationFiltersEnum,
  ApplicationHeaderSortByEnum,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

export const navigationItems = [
  {
    group: 'Innhólf',
    label: 'Ný mál',
    link: `/nymal`,
    applicationState: [ApplicationFiltersEnum.NEW],
    headers: [
      { title: 'Nafn', sortBy: ApplicationHeaderSortByEnum.NAME },
      { title: 'Staða', sortBy: ApplicationHeaderSortByEnum.STATE },
      { title: 'Tími án umsjár', sortBy: ApplicationHeaderSortByEnum.MODIFIED },
      { title: 'Tímabil', sortBy: ApplicationHeaderSortByEnum.CREATED },
      { title: 'Umsjá', sortBy: ApplicationHeaderSortByEnum.STAFF },
    ],
    defaultHeaderSort: ApplicationHeaderSortByEnum.CREATED,
  },
  {
    group: 'Mitt',
    label: 'Mál í vinnslu',
    link: `/vinnslu`,
    applicationState: [ApplicationFiltersEnum.MYCASES],
    headers: [
      { title: 'Nafn', sortBy: ApplicationHeaderSortByEnum.NAME },
      { title: 'Staða', sortBy: ApplicationHeaderSortByEnum.STATE },
      { title: 'Síðast uppfært', sortBy: ApplicationHeaderSortByEnum.MODIFIED },
      { title: 'Tímabil', sortBy: ApplicationHeaderSortByEnum.CREATED },
      { title: 'Unnið af', sortBy: ApplicationHeaderSortByEnum.STAFF },
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
    filterStates: [ApplicationState.INPROGRESS, ApplicationState.DATANEEDED],
    headers: [
      { title: 'Nafn', sortBy: ApplicationHeaderSortByEnum.NAME },
      { title: 'Staða', sortBy: ApplicationHeaderSortByEnum.STATE },
      { title: 'Úrlausnartími', sortBy: ApplicationHeaderSortByEnum.MODIFIED },
      { title: 'Tímabil', sortBy: ApplicationHeaderSortByEnum.CREATED },
      { title: 'Unnið af', sortBy: ApplicationHeaderSortByEnum.STAFF },
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
    filterStates: [ApplicationState.APPROVED, ApplicationState.REJECTED],
    headers: [
      { title: 'Nafn', sortBy: ApplicationHeaderSortByEnum.NAME },
      { title: 'Staða', sortBy: ApplicationHeaderSortByEnum.STATE },
      { title: 'Úrlausnartími', sortBy: ApplicationHeaderSortByEnum.MODIFIED },
      { title: 'Tímabil', sortBy: ApplicationHeaderSortByEnum.CREATED },
      { title: 'Unnið af', sortBy: ApplicationHeaderSortByEnum.STAFF },
    ],
    defaultHeaderSort: ApplicationHeaderSortByEnum.MODIFIED,
  },
]
