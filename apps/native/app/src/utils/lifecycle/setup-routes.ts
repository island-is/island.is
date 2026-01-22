import {
  Navigation,
  Options,
  OptionsModalPresentationStyle,
} from 'react-native-navigation'
import { bundleId } from '../../config'
import { addRoute, addScheme } from '../../lib/deep-linking'
import { DocumentDetailScreen } from '../../screens/document-detail/document-detail'
import { preferencesStore } from '../../stores/preferences-store'
import { uiStore } from '../../stores/ui-store'
import {
  ComponentRegistry,
  MainBottomTabs,
  StackRegistry,
} from '../component-registry'

const selectTab = (currentTabIndex: number) => {
  // Selected Tab navigation event wont fire for this. Need to manually set in ui store.
  const { selectedTab } = uiStore.getState()
  uiStore.setState({ unselectedTab: selectedTab, selectedTab: currentTabIndex })
  // switch tab
  Navigation.mergeOptions(MainBottomTabs, {
    bottomTabs: {
      currentTabIndex,
    },
  })
}

export function setupRoutes() {
  // Setup app scheme (is.island.app://)
  addScheme(`${bundleId}://`)

  // Routes
  addRoute('/', () => {
    Navigation.dismissAllModals()
    selectTab(2)
  })

  addRoute('/inbox', () => {
    Navigation.dismissAllModals()
    selectTab(0)
  })

  addRoute('/wallet', () => {
    Navigation.dismissAllModals()
    selectTab(1)
  })

  addRoute('/profile', () => {
    Navigation.dismissAllModals()
    selectTab(4)
  })

  addRoute('/applications', async () => {
    Navigation.dismissAllModals()
    selectTab(3)
  })

  addRoute('/applications-completed', async (passProps) => {
    Navigation.dismissAllModals()
    selectTab(3)
    await Navigation.popToRoot(StackRegistry.ApplicationsStack)
    await Navigation.push(ComponentRegistry.ApplicationsScreen, {
      component: {
        name: ComponentRegistry.ApplicationsCompletedScreen,
        passProps,
      },
    })
  })

  addRoute('/applications-in-progress', async (passProps) => {
    Navigation.dismissAllModals()
    selectTab(3)
    await Navigation.popToRoot(StackRegistry.ApplicationsStack)
    await Navigation.push(ComponentRegistry.ApplicationsScreen, {
      component: {
        name: ComponentRegistry.ApplicationsInProgressScreen,
        passProps,
      },
    })
  })

  addRoute('/applications-incomplete', async (passProps) => {
    Navigation.dismissAllModals()
    selectTab(3)
    await Navigation.popToRoot(StackRegistry.ApplicationsStack)
    await Navigation.push(ComponentRegistry.ApplicationsScreen, {
      component: {
        name: ComponentRegistry.ApplicationsIncompleteScreen,
        passProps,
      },
    })
  })

  addRoute('/vehicles', async (passProps) => {
    selectTab(4)
    await Navigation.dismissAllModals()
    await Navigation.popToRoot(StackRegistry.MoreStack)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.VehiclesScreen,
        passProps,
      },
    })
  })

  addRoute('/home-options', async (passProps) => {
    Navigation.dismissAllModals()
    selectTab(2)
    await Navigation.popToRoot(StackRegistry.HomeStack)
    await Navigation.push(StackRegistry.HomeStack, {
      component: {
        name: ComponentRegistry.HomeOptionsScreen,
        passProps,
      },
    })
  })

  addRoute('/assets', async (passProps) => {
    await Navigation.dismissAllModals()
    await Navigation.popToRoot(StackRegistry.MoreStack)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.AssetsOverviewScreen,
        passProps,
      },
    })
  })

  addRoute('/family', async (passProps) => {
    await Navigation.dismissAllModals()
    await Navigation.popToRoot(StackRegistry.MoreStack)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.FamilyScreen,
        passProps,
      },
    })
  })

  addRoute('/air-discount', async (passProps) => {
    await Navigation.dismissAllModals()
    selectTab(4)
    await Navigation.popToRoot(StackRegistry.MoreStack)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.AirDiscountScreen,
        passProps,
      },
    })
  })

  addRoute('/health-overview', async (passProps) => {
    await Navigation.dismissAllModals()
    selectTab(4)
    await Navigation.popToRoot(StackRegistry.MoreStack)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.HealthOverviewScreen,
        passProps,
      },
    })
  })

  addRoute('/vaccinations', async (passProps) => {
    await Navigation.dismissAllModals()
    selectTab(4)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.VaccinationsScreen,
        passProps,
      },
    })
  })

  addRoute('/questionnaires', async (passProps) => {
    await Navigation.dismissAllModals()
    selectTab(4)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.QuestionnairesScreen,
        passProps,
      },
    })
  })

  addRoute('/medicine-delegation/add', async (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.MedicineDelegationFormScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/medicine-delegation/detail', async (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.MedicineDelegationDetailScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/medicine-delegation', async (passProps) => {
    await Navigation.dismissAllModals()
    selectTab(4)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.MedicineDelegationScreen,
        passProps,
      },
    })
  })

  addRoute('/prescriptions', async (passProps) => {
    await Navigation.dismissAllModals()
    selectTab(4)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.PrescriptionsScreen,
        passProps,
      },
    })
  })

  addRoute('/prescriptions/medicine-history', async (passProps) => {
    await Navigation.dismissAllModals()
    selectTab(4)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.MedicineHistoryScreen,
        passProps,
      },
    })
  })

  addRoute('/prescriptions/dispensation', (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.MedicineHistoryDetailScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/personalinfo', async (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.PersonalInfoScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/passkey', async (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.PasskeyScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/update-app', async (passProps) => {
    Navigation.showModal({
      stack: {
        options: {
          modal: {
            swipeToDismiss: false,
          },
        },
        children: [
          {
            component: {
              name: ComponentRegistry.UpdateAppScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/settings', async (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.SettingsScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/editemail', async (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.EditEmailScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/editphone', async (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.EditPhoneScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/editbankinfo', async (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.EditBankInfoScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/editconfirm/:type', async (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.EditConfirmScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/vehicle/:id', async (passProps: any) => {
    await Navigation.dismissAllModals()
    selectTab(4)
    Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.VehicleDetailScreen,
        passProps,
        options: {
          topBar: {
            title: {
              text: passProps.title,
            },
          },
        },
      },
    })
  })

  addRoute('/vehicle-mileage/:id', (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.VehicleMileageScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/asset/:id', (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.AssetsDetailScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/finance', async (passProps) => {
    await Navigation.dismissAllModals()
    await Navigation.popToRoot(StackRegistry.MoreStack)
    selectTab(4)
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.FinanceScreen,
        passProps,
      },
    })
  })

  addRoute('/finance/status/:orgId/:chargeTypeId/:index', async (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.FinanceStatusDetailScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/family/:type/:nationalId', (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.FamilyDetailScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute(
    '/wallet/:licenseType/:passId',
    async ({ passId, licenseType, fromId, toId, item, ...rest }: any) => {
      await Navigation.dismissAllModals()
      selectTab(1)
      await Navigation.popToRoot(StackRegistry.WalletStack)
      Navigation.push(StackRegistry.WalletStack, {
        component: {
          name: ComponentRegistry.WalletPassScreen,
          passProps: {
            id: passId,
            type: licenseType,
            item,
            ...rest,
          },
        },
      })
    },
  )

  addRoute('/license-scanner', async () => {
    Navigation.showModal({
      stack: {
        id: StackRegistry.LicenseScannerStack,
        options: {
          modalPresentationStyle: OptionsModalPresentationStyle.fullScreen,
        },
        children: [
          {
            component: {
              name: ComponentRegistry.LicenseScannerScreen,
            },
          },
        ],
      },
    })
  })

  addRoute('/inbox/:docId', async (passProps) => {
    selectTab(0)

    // ensure INBOX_SCREEN doesn't already have same screen with same componentId etc.
    await Navigation.dismissAllModals()
    await Navigation.popToRoot(StackRegistry.InboxStack)
    await Navigation.push(StackRegistry.InboxStack, {
      component: {
        name: ComponentRegistry.DocumentDetailScreen,
        passProps,
        options: DocumentDetailScreen.options as Options,
      },
    })
  })

  addRoute('/inbox-filter', async (passProps) => {
    selectTab(0)
    await Navigation.popToRoot(StackRegistry.InboxStack)
    await Navigation.push(StackRegistry.InboxStack, {
      component: {
        name: ComponentRegistry.InboxFilterScreen,
        passProps,
      },
    })
  })

  addRoute('/user', () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.PersonalInfoScreen,
            },
          },
        ],
      },
    })
  })

  addRoute('/notifications', () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.NotificationsScreen,
            },
          },
        ],
      },
    })
  })

  addRoute('/webview', (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.WebViewScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/e2e/disable-applock', () => {
    preferencesStore.setState({ dev__useLockScreen: false })
  })
}
