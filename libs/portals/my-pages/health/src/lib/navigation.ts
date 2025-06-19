import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages as s } from '@island.is/portals/my-pages/core'
import { messages } from './messages'
import { HealthPaths } from './paths'

export const healthNavigation: PortalNavigationItem = {
  name: m.health,
  description: m.healthDescription,
  intro: m.healthIntro,
  searchTags: [s.healthShorter],
  path: HealthPaths.HealthRoot,
  icon: {
    icon: 'heart',
  },
  children: [
    {
      name: m.health,
      navHide: true,
      searchHide: true,
      path: HealthPaths.HealthRoot,
    },
    {
      name: messages.myHealthOverview,
      searchHide: true,
      path: HealthPaths.HealthOverview,
    },
    {
      name: messages.referrals,
      path: HealthPaths.HealthReferrals,
      searchTags: [s.healthReferrals],
      children: [
        {
          name: messages.singleReferral,
          path: HealthPaths.HealthReferralsDetail,
          navHide: true,
        },
      ],
    },

    {
      name: messages.paymentsAndRights,
      description: m.paymentsIntro,
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
      name: m.medicine,
      path: HealthPaths.HealthMedicine,
      children: [
        {
          name: m.medicinePrescriptions,
          description: m.medicinePrescriptionsIntro,
          path: HealthPaths.HealthMedicinePrescription,
        },

        {
          name: m.medicineDelegation,
          path: HealthPaths.HealthMedicineDelegation,
        },
        {
          name: m.medicinePaymentParticipation,
          description: m.medicinePaymentParticipationIntro,
          path: HealthPaths.HealthMedicinePaymentParticipation,
          children: [
            {
              name: m.medicinePurchaseTitle,
              path: HealthPaths.HealthMedicinePurchase,
              activeIfExact: true,
              navHide: true,
            },
            {
              name: m.medicineCalculatorTitle,
              path: HealthPaths.HealthMedicineCalculator,
              activeIfExact: true,
              navHide: true,
            },
          ],
        },
        {
          name: m.medicineLicenseTitle,
          description: m.medicineLicenseIntro,
          path: HealthPaths.HealthMedicineCertificates,
          children: [
            {
              name: m.medicineLicenseTitle,
              path: HealthPaths.HealthMedicineCertificate,
              navHide: true,
              breadcrumbHide: true,
            },
          ],
        },
        {
          name: m.medicinePrescriptionHistory,
          description: m.medicinePrescriptionHistoryIntro,
          path: HealthPaths.HealthMedicinePrescriptionHistory,
        },
      ],
    },
    {
      name: m.aidsAndNutrition,
      description: m.aidsAndNutritionIntro,
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

    {
      name: m.vaccinations,
      description: m.vaccinationsIntro,
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
      name: messages.waitlists,
      path: HealthPaths.HealthWaitlists,
      searchTags: [s.healthWaiting],
      children: [
        {
          name: messages.singleWaitlist,
          path: HealthPaths.HealthWaitlistsDetail,
          navHide: true,
        },
      ],
    },
    {
      name: messages.basicInformation,
      path: HealthPaths.HealthBasicInformation,
      searchHide: true,
      children: [
        {
          name: m.healthCenter,
          description: m.healthCenterIntro,
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
          description: m.dentistsIntro,
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
          name: m.organDonation,
          description: m.organDonationIntro,
          path: HealthPaths.HealthOrganDonation,
          children: [
            {
              name: m.organDonation,
              path: HealthPaths.HealthOrganDonationRegistration,
            },
          ],
        },
        {
          name: m.bloodtype,
          description: m.bloodtype,
          path: HealthPaths.HealthBloodtype,
        },
      ],
    },
  ],
}
