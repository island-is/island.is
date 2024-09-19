import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { messages } from './messages'
import { HealthPaths } from './paths'

export const healthNavigation: PortalNavigationItem = {
  name: m.health,
  description: m.healthDescription,
  serviceProvider: 'sjukratryggingar',
  serviceProviderTooltip: messages.healthTooltip,
  path: HealthPaths.HealthRoot,
  icon: {
    icon: 'heart',
  },
  children: [
    {
      name: messages.overviewTitle,
      intro: messages.overviewIntro,
      path: HealthPaths.HealthOverview,
    },
    {
      name: m.therapies,
      intro: messages.therapyDescription,
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
    {
      name: m.payments,
      intro: messages.paymentsIntro,
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
      intro: messages.aidsAndNutritionDescription,
      path: HealthPaths.HealthAidsAndNutrition,
    },
    {
      name: m.dentists,
      intro: messages.dentistsDescription,
      path: HealthPaths.HealthDentists,
      children: [
        {
          name: messages.dentistRegisterationPageTitle,
          intro: messages.dentistRegisterationPageDescription,
          path: HealthPaths.HealthDentistRegistration,
          navHide: true,
        },
      ],
    },
    {
      name: m.healthCenter,
      intro: messages.healthCenterDescription,
      path: HealthPaths.HealthCenter,
      children: [
        {
          name: messages.healthCenterRegistrationTitle,
          intro: messages.healthCenterRegistrationInfo,
          path: HealthPaths.HealthCenterRegistration,
          navHide: true,
        },
      ],
    },
    {
      name: messages.medicineTitle,
      intro: messages.medicineTitleIntro,
      path: HealthPaths.HealthMedicine,
      children: [
        {
          name: messages.medicinePurchaseTitle,
          path: HealthPaths.HealthMedicinePurchase,
          navHide: true,
        },
        {
          name: messages.medicineCalculatorTitle,
          path: HealthPaths.HealthMedicineCalculator,
          activeIfExact: true,
          navHide: true,
        },
        {
          name: messages.medicineLicenseIntroTitle,
          path: HealthPaths.HealthMedicineCertificates,
          activeIfExact: true,
          navHide: true,
          children: [
            {
              name: messages.medicineLicenseTitle,
              path: HealthPaths.HealthMedicineCertificate,
              activeIfExact: true,
              navHide: true,
            },
          ],
        },
      ],
    },
    {
      name: messages.vaccinations,
      intro: messages.vaccinationsIntro,
      serviceProvider: 'landlaeknir',
      serviceProviderTooltip: messages.landlaeknirVaccinationsTooltip,
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
      name: messages.organDonation,
      intro: messages.organDonationDescription,
      path: HealthPaths.HealthOrganDonation,
      children: [
        {
          name: messages.changeRegistration,
          path: HealthPaths.HealthOrganDonationRegistration,
          navHide: true,
        },
      ],
    },
  ],
}
