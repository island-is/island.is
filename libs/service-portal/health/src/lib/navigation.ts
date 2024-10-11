import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { messages } from './messages'
import { HealthPaths } from './paths'

export const healthNavigation: PortalNavigationItem = {
  name: m.health,
  description: m.healthDescription,
  serviceProvider: 'sjukratryggingar',
  serviceProviderTooltip: messages.healthTooltip,
  displayIntroHeader: true,
  path: HealthPaths.HealthRoot,
  icon: {
    icon: 'heart',
  },
  children: [
    {
      name: messages.overviewTitle,
      intro: messages.overviewIntro,
      displayIntroHeader: true,
      path: HealthPaths.HealthOverview,
    },
    {
      name: m.therapies,
      intro: messages.therapyDescription,
      displayIntroHeader: true,
      path: HealthPaths.HealthTherapies,
      children: [
        {
          displayIntroHeader: true,
          name: messages.physicalTherapy,
          path: HealthPaths.HealthTherapiesPhysical,
          navHide: true,
        },
        {
          name: messages.speechTherapy,
          displayIntroHeader: true,
          path: HealthPaths.HealthTherapiesSpeech,
          navHide: true,
        },
        {
          displayIntroHeader: true,
          name: messages.occupationalTherapy,
          path: HealthPaths.HealthTherapiesOccupational,
          navHide: true,
        },
      ],
    },
    {
      name: m.payments,
      displayIntroHeader: true,
      intro: messages.paymentsIntro,
      path: HealthPaths.HealthPayments,
      children: [
        {
          displayIntroHeader: true,
          name: messages.paymentParticipation,
          path: HealthPaths.HealthPaymentParticipation,
          navHide: true,
        },
        {
          displayIntroHeader: true,
          name: messages.paymentOverview,
          path: HealthPaths.HealthPaymentOverview,
          navHide: true,
        },
      ],
    },
    {
      displayIntroHeader: true,
      name: m.aidsAndNutrition,
      intro: messages.aidsAndNutritionDescription,
      path: HealthPaths.HealthAidsAndNutrition,
    },
    {
      name: m.dentists,
      intro: messages.dentistsDescription,
      displayIntroHeader: true,
      path: HealthPaths.HealthDentists,
      children: [
        {
          displayIntroHeader: true,
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
      displayIntroHeader: true,
      path: HealthPaths.HealthCenter,
      children: [
        {
          name: messages.healthCenterRegistrationTitle,
          intro: messages.healthCenterRegistrationInfo,
          displayIntroHeader: true,
          path: HealthPaths.HealthCenterRegistration,
          navHide: true,
        },
      ],
    },
    {
      name: messages.medicineTitle,
      intro: messages.medicineTitleIntro,
      displayIntroHeader: true,
      path: HealthPaths.HealthMedicine,
      children: [
        {
          name: messages.medicinePurchaseTitle,
          displayIntroHeader: true,
          path: HealthPaths.HealthMedicinePurchase,
          navHide: true,
        },
        {
          name: messages.medicineCalculatorTitle,
          path: HealthPaths.HealthMedicineCalculator,
          displayIntroHeader: true,
          activeIfExact: true,
          navHide: true,
        },
        {
          name: messages.medicineLicenseIntroTitle,
          path: HealthPaths.HealthMedicineCertificates,
          displayIntroHeader: true,
          activeIfExact: true,
          navHide: true,
          children: [
            {
              name: messages.medicineLicenseTitle,
              path: HealthPaths.HealthMedicineCertificate,
              displayIntroHeader: true,
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
      displayIntroHeader: true,
      serviceProviderTooltip: messages.landlaeknirVaccinationsTooltip,
      path: HealthPaths.HealthVaccinations,
      children: [
        {
          name: messages.generalVaccinations,
          displayIntroHeader: true,
          path: HealthPaths.HealthVaccinationsGeneral,
          navHide: true,
        },
        {
          name: messages.otherVaccinations,
          displayIntroHeader: true,
          path: HealthPaths.HealthVaccinationsOther,
          navHide: true,
        },
      ],
    },
    {
      name: messages.organDonation,
      intro: messages.organDonationDescription,
      displayIntroHeader: true,
      path: HealthPaths.HealthOrganDonation,
      children: [
        {
          name: messages.changeRegistration,
          path: HealthPaths.HealthOrganDonationRegistration,
          displayIntroHeader: true,
          navHide: true,
        },
      ],
    },
  ],
}
