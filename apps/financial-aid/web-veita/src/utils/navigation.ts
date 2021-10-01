import {
  ApplicationState,
  ApplicationStateUrl,
} from '@island.is/financial-aid/shared/lib'

export const navigationItems = [
  {
    label: 'Ný mál',
    link: `/${ApplicationStateUrl.NEW}`,
    applicationState: [ApplicationState.NEW],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða' },
      { title: 'Tími án umsjár' },
      { title: 'Tímabil' },
      { title: 'Umsjá' },
    ],
  },
  {
    label: 'Mál í vinnslu',
    link: `/${ApplicationStateUrl.INPROGRESS}`,
    applicationState: [
      ApplicationState.INPROGRESS,
      ApplicationState.DATANEEDED,
    ],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða' },
      { title: 'Síðast uppfært' },
      { title: 'Tímabil' },
      { title: 'Unnið af' },
    ],
  },
  {
    label: 'Afgreidd mál',
    link: `/${ApplicationStateUrl.PROCESSED}`,
    applicationState: [ApplicationState.APPROVED, ApplicationState.REJECTED],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða' },
      { title: 'Úrlausnartími' },
      { title: 'Tímabil' },
      { title: 'Unnið af' },
    ],
  },
]
