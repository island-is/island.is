import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
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
      name: m.health,
      navHide: true,
      path: HealthPaths.HealthRoot,
    },
    {
      name: m.baseInfo,
      path: HealthPaths.HealthOverview,
      children: [
        {
          name: messages.healthOverview,
          path: HealthPaths.HealthOverview,
        },
        {
          name: messages.healthCenter,
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
          name: messages.organDonation,
          path: HealthPaths.HealthOrganDonation,
          children: [
            {
              name: messages.changeRegistration,
              path: HealthPaths.HealthOrganDonationRegistration,
              navHide: true,
            },
          ],
        },
        {
          name: messages.hasHealthInsurance,
          path: HealthPaths.HealthInsurance,
        },
      ],
    },

    {
      name: messages.medicineTitle,
      path: HealthPaths.HealthMedicine,
      children: [
        {
          name: messages.medicinePrescriptions,
          path: HealthPaths.HealthMedicinePrescription,
        },

        {
          name: messages.medicineDelegation,
          path: HealthPaths.HealthMedicineDelegation,
        },

        {
          name: messages.medicineLicenseTitle,
          path: HealthPaths.HealthMedicineCertificates,
          children: [
            {
              name: messages.medicineLicenseTitle,
              path: HealthPaths.HealthMedicineCertificate,
              navHide: true,
              breadcrumbHide: true,
            },
          ],
        },
        {
          name: messages.medicinePrescriptionHistory,
          path: HealthPaths.HealthMedicinePrescriptionHistory,
        },
      ],
    },
    {
      name: messages.vaccinations,
      path: HealthPaths.HealthVaccinations,
      children: [
        {
          name: messages.generalVaccinations,
          path: HealthPaths.HealthVaccinationsGeneral,
          navHide: true,
        },
        {
          name: messages.otherVaccinations,
          path: HealthPaths.HealthVaccinationsOther,
          navHide: true,
        },
      ],
    },
    {
      name: messages.paymentsAndRights,
      path: HealthPaths.HealthPayments,
      children: [
        {
          name: messages.paymentParticipation,
          path: HealthPaths.HealthPaymentParticipation,
          navHide: true,
        },
        {
          name: messages.paymentOverview,
          path: HealthPaths.HealthPaymentOverview,
          navHide: true,
        },
      ],
    },
    {
      name: m.aidsAndNutrition,
      path: HealthPaths.HealthAidsAndNutrition,
    },
    {
      name: m.therapies,
      path: HealthPaths.HealthTherapies,
      children: [
        {
          name: messages.physicalTherapy,
          path: HealthPaths.HealthTherapiesPhysical,
          navHide: true,
        },
        {
          name: messages.speechTherapy,
          path: HealthPaths.HealthTherapiesSpeech,
          navHide: true,
        },
        {
          name: messages.occupationalTherapy,
          path: HealthPaths.HealthTherapiesOccupational,
          navHide: true,
        },
      ],
    },
  ],
  description: m.healthDescription,
}
