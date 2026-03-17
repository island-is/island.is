import { ApiScope } from '@island.is/auth/scopes'
import {
  PortalModule,
  PortalRouteDisabledReason,
} from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { messages as hm } from './lib/messages'
import { HealthPaths } from './lib/paths'
import { BffUser } from '@island.is/shared/types'

const HealthOverview = lazy(() =>
  import('./screens/HealthOverview/HealthOverview'),
)
const TherapiesPhysical = lazy(() =>
  import('./screens/Therapies/TherapiesPhysical'),
)
const TherapiesSpeech = lazy(() =>
  import('./screens/Therapies/TherapiesSpeech'),
)
const TherapiesOccupational = lazy(() =>
  import('./screens/Therapies/TherapiesOccupational'),
)

const AidsAndNutrition = lazy(() =>
  import('./screens/AidsAndNutrition/AidsAndNutrition'),
)
const Dentists = lazy(() => import('./screens/Dentists/Dentists'))

const HealthCenter = lazy(() => import('./screens/HealthCenter/HealthCenter'))

const MedicinePurchase = lazy(() =>
  import('./screens/Medicine/MedicinePurchase'),
)

const MedicineLicence = lazy(() => import('./screens/Medicine/MedicineLicense'))

const MedicineCalculator = lazy(() =>
  import('./screens/MedicineCalculator/MedicineCalculator'),
)

const MedicinePrescriptions = lazy(() =>
  import('./screens/MedicinePrescriptions/MedicinePrescriptions'),
)
const MedicinePrescriptionHistory = lazy(() =>
  import('./screens/MedicineHistory/MedicinePrescriptionHistory'),
)
const HealthCenterRegistration = lazy(() =>
  import('./screens/HealthCenterRegistration/HealthCenterRegistration'),
)

const DentistRegistration = lazy(() =>
  import('./screens/DentistRegistration/DentistRegistration'),
)

const MedicineCertificate = lazy(() =>
  import('./screens/MedicineCertificate/MedicineCertificate'),
)

const MedicineDelegation = lazy(() =>
  import('./screens/MedicineDelegation/MedicineDelegation'),
)

const MedicineDelegationDetail = lazy(() =>
  import('./screens/MedicineDelegation/MedicineDelegationDetail'),
)

const NewMedicineDelegation = lazy(() =>
  import('./screens/MedicineDelegation/NewMedicineDelegation'),
)

const PaymentParticipation = lazy(() =>
  import('./screens/PaymentsAndRights/PaymentParticipation'),
)
const PaymentOverview = lazy(() =>
  import('./screens/PaymentsAndRights/PaymentOverview'),
)
const PaymentOverviewTotals = lazy(() =>
  import('./screens/PaymentsAndRights/PaymentOverviewTotals'),
)

const Rights = lazy(() => import('./screens/PaymentsAndRights/Rights'))

const OrganDonation = lazy(() =>
  import('./screens/OrganDonation/OrganDonation'),
)

const OrganDonationRegistration = lazy(() =>
  import('./screens/OrganDonation/components/RegistrationForm'),
)

const Vaccinations = lazy(() =>
  import('./screens/Vaccinations/VaccinationsWrapper'),
)

const Bloodtype = lazy(() => import('./screens/Bloodtype/Bloodtype'))

const Referrals = lazy(() => import('./screens/Referrals/Referrals'))

const ReferralsDetail = lazy(() =>
  import('./screens/Referrals/ReferralsDetail'),
)

const Waitlist = lazy(() => import('./screens/Waitlists/Waitlists'))

const WaitlistDetail = lazy(() => import('./screens/Waitlists/WaitlistsDetail'))

const Questionnaires = lazy(() =>
  import('./screens/Questionnaires/Questionnaires'),
)

const QuestionnairesDetail = lazy(() =>
  import('./screens/Questionnaires/QuestionnaireDetail'),
)

const QuestionnairesAnswer = lazy(() =>
  import('./screens/Questionnaires/AnswerQuestionnaire'),
)

const QuestionnairesAnswered = lazy(() =>
  import('./screens/Questionnaires/AnsweredQuestionnaire'),
)

const PatientData = lazy(() => import('./screens/PatientData/PatientData'))

const PatientDataPermits = lazy(() =>
  import('./screens/PatientDataPermits/Permits'),
)

const PatientDataPermitsDetail = lazy(() =>
  import('./screens/PatientDataPermits/PermitDetail'),
)

const PatientDataNewPermit = lazy(() =>
  import('./screens/PatientDataPermits/NewPermit'),
)

const Appointments = lazy(() =>
  import('./screens/Appointments/AppointmentsOverview'),
)

const AppointmentDetail = lazy(() =>
  import('./screens/Appointments/AppointmentDetail'),
)

const MEDICINE_LANDLAEKNIR_FLAG = 'HealthMedicineLandlaeknir'

const MEDICINE_DELEGATION_FLAG = 'HealthMedicineDelegation'

const getDisabledReason = (
  userInfo: BffUser,
  path: string,
): PortalRouteDisabledReason => {
  return 'default'
}

export const healthModule: PortalModule = {
  name: 'Heilsa',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.health,
      path: HealthPaths.HealthRoot,

      enabled: [
        ApiScope.healthPayments,
        ApiScope.healthMedicines,
        ApiScope.healthAssistiveAndNutrition,
        ApiScope.healthTherapies,
        ApiScope.healthHealthcare,
        ApiScope.healthDentists,
        ApiScope.healthRightsStatus,
      ].some((scope) => userInfo.scopes.includes(scope)),
      element: <Navigate to={HealthPaths.HealthOverview} replace />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthBasicOld),
    },
    {
      name: hm.basicInformation,
      path: HealthPaths.HealthBasicOld,
      element: <Navigate to={HealthPaths.HealthOverview} replace />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthBasicOld),
    },
    {
      name: hm.overviewTitle,
      path: HealthPaths.HealthOverview,
      enabled: userInfo.scopes.includes(ApiScope.healthRightsStatus),
      element: <HealthOverview />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthOverview),
    },
    {
      name: hm.therapyTitle,
      path: HealthPaths.HealthTherapies,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <Navigate to={HealthPaths.HealthTherapiesPhysical} replace />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthTherapies),
    },
    {
      name: hm.physicalTherapy,
      path: HealthPaths.HealthTherapiesPhysical,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <TherapiesPhysical />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthTherapiesPhysical,
      ),
    },
    {
      name: hm.speechTherapy,
      path: HealthPaths.HealthTherapiesSpeech,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <TherapiesSpeech />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthTherapiesSpeech,
      ),
    },
    {
      name: hm.occupationalTherapy,
      path: HealthPaths.HealthTherapiesOccupational,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <TherapiesOccupational />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthTherapiesOccupational,
      ),
    },
    {
      name: hm.aidsAndNutritionTitle,
      path: HealthPaths.HealthAidsAndNutrition,
      enabled: userInfo.scopes.includes(ApiScope.healthAssistiveAndNutrition),
      element: <AidsAndNutrition />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthAidsAndNutrition,
      ),
    },
    {
      name: hm.payments,
      path: HealthPaths.HealthPayments,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <Navigate to={HealthPaths.HealthPaymentParticipation} replace />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthPayments),
    },
    {
      name: hm.paymentParticipation,
      path: HealthPaths.HealthPaymentParticipation,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <PaymentParticipation />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthPaymentParticipation,
      ),
    },
    {
      name: hm.paymentOverview,
      path: HealthPaths.HealthPaymentOverview,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <PaymentOverview />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthPaymentOverview,
      ),
    },
    {
      name: hm.paymentOverview,
      path: HealthPaths.HealthPaymentOverviewInvoices,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <PaymentOverview />,
      key: 'HealthPaymentOverviewTotal',
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthPaymentOverviewInvoices,
      ),
    },
    {
      name: hm.paymentOverviewTotals,
      path: HealthPaths.HealthPaymentOverviewTotals,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <PaymentOverviewTotals />,
      key: 'HealthPaymentOverviewTotal',
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthPaymentOverviewTotals,
      ),
    },
    {
      name: hm.rights,
      path: HealthPaths.HealthPaymentRights,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <Rights />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthPaymentRights,
      ),
    },
    {
      name: hm.dentistsTitle,
      path: HealthPaths.HealthDentists,
      enabled: userInfo.scopes.includes(ApiScope.healthDentists),
      element: <Dentists />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthDentists),
    },
    {
      name: hm.dentistsTitle,
      path: HealthPaths.HealthDentistsOld,
      enabled: userInfo.scopes.includes(ApiScope.healthDentists),
      element: <Navigate to={HealthPaths.HealthDentists} replace />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthDentistsOld,
      ),
    },
    {
      name: hm.healthCenterTitle,
      path: HealthPaths.HealthCenter,
      enabled: userInfo.scopes.includes(ApiScope.healthHealthcare),
      element: <HealthCenter />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthCenter),
    },
    {
      name: hm.healthCenterTitle,
      path: HealthPaths.HealthCenterOld,
      enabled: userInfo.scopes.includes(ApiScope.healthHealthcare),
      element: <Navigate to={HealthPaths.HealthCenter} replace />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthCenterOld),
    },
    {
      name: hm.medicineTitle,
      path: HealthPaths.HealthMedicine,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: (
        <Navigate to={HealthPaths.HealthMedicinePaymentParticipation} replace />
      ),
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthMedicine),
    },
    {
      name: hm.medicinePrescriptions,
      path: HealthPaths.HealthMedicinePrescription,
      key: MEDICINE_LANDLAEKNIR_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePrescriptions />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthMedicinePrescription,
      ),
    },
    {
      name: hm.medicinePrescriptionHistory,
      path: HealthPaths.HealthMedicinePrescriptionHistory,
      key: MEDICINE_LANDLAEKNIR_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePrescriptionHistory />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthMedicinePrescriptionHistory,
      ),
    },
    {
      name: hm.medicineDelegation,
      path: HealthPaths.HealthMedicineDelegation,
      key: MEDICINE_DELEGATION_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <MedicineDelegation />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthMedicineDelegation,
      ),
    },
    {
      name: hm.medicineDelegation,
      path: HealthPaths.HealthMedicineDelegationDetail,
      key: MEDICINE_DELEGATION_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <MedicineDelegationDetail />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthMedicineDelegationDetail,
      ),
    },
    {
      name: hm.medicineDelegation,
      path: HealthPaths.HealthMedicineDelegationAdd,
      key: MEDICINE_DELEGATION_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <NewMedicineDelegation />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthMedicineDelegationAdd,
      ),
    },
    {
      name: hm.medicinePaymentParticipation,
      path: HealthPaths.HealthMedicinePaymentParticipation,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePurchase />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthMedicinePaymentParticipation,
      ),
    },
    {
      name: hm.medicinePurchaseTitle,
      path: HealthPaths.HealthMedicinePurchase,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePurchase />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthMedicinePurchase,
      ),
    },
    {
      name: hm.medicineCalculatorTitle,
      path: HealthPaths.HealthMedicineCalculator,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicineCalculator />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthMedicineCalculator,
      ),
    },
    {
      name: hm.medicineLicenseTitle,
      path: HealthPaths.HealthMedicineCertificates,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicineLicence />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthMedicineCertificates,
      ),
    },
    {
      name: hm.medicineLicenseTitle,
      path: HealthPaths.HealthMedicineCertificate,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicineCertificate />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthMedicineCertificate,
      ),
    },
    {
      name: hm.healthCenterRegistrationTitle,
      path: HealthPaths.HealthCenterRegistration,
      enabled: userInfo.scopes.includes(ApiScope.healthHealthcare),
      element: <HealthCenterRegistration />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthCenterRegistration,
      ),
    },
    {
      name: hm.healthCenterRegistrationTitle,
      path: HealthPaths.HealthCenterRegistrationOld,
      enabled: userInfo.scopes.includes(ApiScope.healthHealthcare),
      element: <Navigate to={HealthPaths.HealthCenterRegistration} replace />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthCenterRegistrationOld,
      ),
    },
    {
      name: hm.dentistRegisterationPageTitle,
      path: HealthPaths.HealthDentistRegistration,
      enabled: userInfo.scopes.includes(ApiScope.healthDentists),
      element: <DentistRegistration />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthDentistRegistration,
      ),
    },
    {
      name: hm.dentistRegisterationPageTitle,
      path: HealthPaths.HealthDentistRegistrationOld,
      enabled: userInfo.scopes.includes(ApiScope.healthDentists),
      element: <Navigate to={HealthPaths.HealthDentistRegistration} replace />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthDentistRegistrationOld,
      ),
    },
    {
      name: hm.organDonation,
      path: HealthPaths.HealthOrganDonation,
      enabled: userInfo.scopes.includes(ApiScope.healthOrganDonation),
      element: <OrganDonation />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthOrganDonation,
      ),
    },
    {
      name: hm.organDonation,
      path: HealthPaths.HealthOrganDonationOld,
      enabled: userInfo.scopes.includes(ApiScope.healthOrganDonation),
      element: <Navigate to={HealthPaths.HealthOrganDonation} replace />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthOrganDonationOld,
      ),
    },
    {
      name: hm.organDonation,
      path: HealthPaths.HealthOrganDonationRegistration,
      enabled: userInfo.scopes.includes(ApiScope.healthOrganDonation),
      element: <OrganDonationRegistration />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthOrganDonationRegistration,
      ),
    },
    {
      name: hm.organDonation,
      path: HealthPaths.HealthOrganDonationRegistrationOld,
      enabled: userInfo.scopes.includes(ApiScope.healthOrganDonation),
      element: (
        <Navigate to={HealthPaths.HealthOrganDonationRegistration} replace />
      ),
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthOrganDonationRegistrationOld,
      ),
    },
    {
      name: hm.vaccinations,
      path: HealthPaths.HealthVaccinations,
      enabled: userInfo.scopes.includes(ApiScope.healthVaccinations),
      element: <Vaccinations />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthVaccinations,
      ),
    },

    {
      name: hm.bloodtype,
      path: HealthPaths.HealthBloodtype,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Bloodtype />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthBloodtype),
    },
    {
      name: hm.referrals,
      path: HealthPaths.HealthReferrals,
      key: 'Referrals',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Referrals />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthReferrals),
    },
    {
      name: hm.referrals,
      path: HealthPaths.HealthReferralsDetail,
      key: 'Referrals',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <ReferralsDetail />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthReferralsDetail,
      ),
    },
    {
      name: hm.waitlists,
      path: HealthPaths.HealthWaitlists,
      key: 'HealthWaitlists',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Waitlist />,
      disabledReason: getDisabledReason(userInfo, HealthPaths.HealthWaitlists),
    },
    {
      name: hm.waitlists,
      path: HealthPaths.HealthWaitlistsDetail,
      key: 'HealthWaitlists',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <WaitlistDetail />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthWaitlistsDetail,
      ),
    },
    {
      name: hm.questionnaires,
      path: HealthPaths.HealthQuestionnaires,
      key: 'HealthQuestionnaires',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Questionnaires />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthQuestionnaires,
      ),
    },
    {
      name: hm.questionnaires,
      path: HealthPaths.HealthQuestionnairesDetail,
      key: 'HealthQuestionnaires',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <QuestionnairesDetail />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthQuestionnairesDetail,
      ),
    },
    {
      name: hm.questionnaire,
      path: HealthPaths.HealthQuestionnairesAnswer,
      key: 'HealthQuestionnaires',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <QuestionnairesAnswer />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthQuestionnairesAnswer,
      ),
    },
    {
      name: hm.questionnaire,
      path: HealthPaths.HealthQuestionnairesAnswered,
      key: 'HealthQuestionnaires',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <QuestionnairesAnswered />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthQuestionnairesAnswered,
      ),
    },
    {
      name: hm.patientData,
      path: HealthPaths.HealthPatientData,
      key: 'HealthPatientPermits',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <Navigate to={HealthPaths.HealthPatientDataOverview} replace />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthPatientData,
      ),
    },
    {
      name: hm.patientData,
      path: HealthPaths.HealthPatientDataOverview,
      key: 'HealthPatientPermits',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <PatientData />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthPatientDataOverview,
      ),
    },
    {
      name: hm.patientDataPermit,
      path: HealthPaths.HealthPatientDataPermits,
      key: 'HealthPatientPermits',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <PatientDataPermits />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthPatientDataPermits,
      ),
    },
    {
      name: hm.permit,
      path: HealthPaths.HealthPatientDataPermitsDetail,
      key: 'HealthPatientPermits',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <PatientDataPermitsDetail />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthPatientDataPermitsDetail,
      ),
    },
    {
      name: hm.addPermit,
      path: HealthPaths.HealthPatientDataPermitsAdd,
      key: 'HealthPatientPermits',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <PatientDataNewPermit />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthPatientDataPermitsAdd,
      ),
    },
    {
      name: hm.appointments,
      path: HealthPaths.HealthAppointments,
      key: 'HealthAppointments',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <Appointments />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthAppointments,
      ),
    },
    {
      name: hm.appointmentDetail,
      path: HealthPaths.HealthAppointmentDetail,
      key: 'HealthAppointments',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <AppointmentDetail />,
      disabledReason: getDisabledReason(
        userInfo,
        HealthPaths.HealthAppointmentDetail,
      ),
    },
  ],
}
