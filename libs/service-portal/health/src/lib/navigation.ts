import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { messages } from './messages'
import { HealthPaths } from './paths'

export const healthNavigation: PortalNavigationItem = {
  name: m.health,
  path: HealthPaths.HealthRoot,
  icon: {
    icon: 'heart',
  },
  children: [
    {
      name: m.overview,
      path: HealthPaths.HealthRoot,
    },
    {
      name: m.therapies,
      path: HealthPaths.HealthTherapies,
    },
    {
      name: m.payments,
      path: HealthPaths.HealthPayments,
    },
    {
      name: m.aidsAndNutrition,
      path: HealthPaths.HealthAidsAndNutrition,
    },
    {
      name: m.dentists,
      path: HealthPaths.HealthDentists,
      children: [
        {
          name: messages.dentistRegisterationPageTitle,
          path: HealthPaths.HealthDentistRegistration,
          navHide: true,
        },
      ],
    },
    {
      name: m.healthCenter,
      path: HealthPaths.HealthCenter,
      children: [
        {
          name: messages.healthCenterRegistrationTitle,
          path: HealthPaths.HealthCenterRegistration,
          navHide: true,
        },
      ],
    },
    {
      name: messages.medicineTitle,
      path: HealthPaths.HealthMedicinePurchase,
      children: [
        {
          name: messages.medicineCalculatorTitle,
          path: HealthPaths.HealthMedicineCalculator,
          // navHide: true,
        },
        {
          name: messages.medicineLicenseIntroTitle,
          path: HealthPaths.HealthMedicineCertificates,
          // navHide: true,
        },
        {
          name: messages.medicineLicenseTitle,
          path: HealthPaths.HealthMedicineCertificate,
          navHide: true,
        },
      ],
    },
  ],
  description: m.healthDescription,
}
