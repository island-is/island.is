import { ApplicationState } from '@island.is/financial-aid/shared'

export const navigationItems = [
  {
    label: 'Ný mál',
    link: '/nymal',
    applicationState: [ApplicationState.NEW],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða', filterBy: 'state' },
      { title: 'Tími án umsjár', filterBy: 'modified' },
      { title: 'Tímabil' },
    ],
  },
  {
    label: 'Mál í vinnslu',
    link: '/vinnslu',
    applicationState: [
      ApplicationState.INPROGRESS,
      ApplicationState.DATANEEDED,
    ],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða', filterBy: 'state' },
      { title: 'Síðast uppfært', filterBy: 'modified' },
      { title: 'Tímabil' },
    ],
  },
  {
    label: 'Afgreidd mál',
    link: '/afgreidd',
    applicationState: [ApplicationState.APPROVED, ApplicationState.REJECTED],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða', filterBy: 'state' },
      { title: 'Úrlausnartími', filterBy: 'modified' },
      { title: 'Tímabil' },
    ],
  },
]
