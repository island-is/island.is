import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { messages as hm } from './lib/messages'
import { HealthPaths } from './lib/paths'

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
    },
    {
      name: hm.basicInformation,
      path: HealthPaths.HealthBasicOld,
      element: <Navigate to={HealthPaths.HealthOverview} replace />,
    },
    {
      name: hm.overviewTitle,
      path: HealthPaths.HealthOverview,
      enabled: userInfo.scopes.includes(ApiScope.healthRightsStatus),
      element: <HealthOverview />,
    },
    {
      name: hm.therapyTitle,
      path: HealthPaths.HealthTherapies,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <Navigate to={HealthPaths.HealthTherapiesPhysical} replace />,
    },
    {
      name: hm.physicalTherapy,
      path: HealthPaths.HealthTherapiesPhysical,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <TherapiesPhysical />,
    },
    {
      name: hm.speechTherapy,
      path: HealthPaths.HealthTherapiesSpeech,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <TherapiesSpeech />,
    },
    {
      name: hm.occupationalTherapy,
      path: HealthPaths.HealthTherapiesOccupational,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <TherapiesOccupational />,
    },
    {
      name: hm.aidsAndNutritionTitle,
      path: HealthPaths.HealthAidsAndNutrition,
      enabled: userInfo.scopes.includes(ApiScope.healthAssistiveAndNutrition),
      element: <AidsAndNutrition />,
    },
    {
      name: hm.payments,
      path: HealthPaths.HealthPayments,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <Navigate to={HealthPaths.HealthPaymentParticipation} replace />,
    },
    {
      name: hm.paymentParticipation,
      path: HealthPaths.HealthPaymentParticipation,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <PaymentParticipation />,
    },
    {
      name: hm.paymentOverview,
      path: HealthPaths.HealthPaymentOverview,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <PaymentOverview />,
    },
    {
      name: hm.paymentOverview,
      path: HealthPaths.HealthPaymentOverviewInvoices,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <PaymentOverview />,
    },
    {
      name: hm.paymentOverviewTotals,
      path: HealthPaths.HealthPaymentOverviewTotals,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <PaymentOverviewTotals />,
    },
    {
      name: hm.rights,
      path: HealthPaths.HealthPaymentRights,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <Rights />,
    },
    {
      name: hm.dentistsTitle,
      path: HealthPaths.HealthDentists,
      enabled: userInfo.scopes.includes(ApiScope.healthDentists),
      element: <Dentists />,
    },
    {
      name: hm.dentistsTitle,
      path: HealthPaths.HealthDentistsOld,
      enabled: userInfo.scopes.includes(ApiScope.healthDentists),
      element: <Navigate to={HealthPaths.HealthDentists} replace />,
    },
    {
      name: hm.healthCenterTitle,
      path: HealthPaths.HealthCenter,
      enabled: userInfo.scopes.includes(ApiScope.healthHealthcare),
      element: <HealthCenter />,
    },
    {
      name: hm.healthCenterTitle,
      path: HealthPaths.HealthCenterOld,
      enabled: userInfo.scopes.includes(ApiScope.healthHealthcare),
      element: <Navigate to={HealthPaths.HealthCenter} replace />,
    },
    {
      name: hm.medicineTitle,
      path: HealthPaths.HealthMedicine,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: (
        <Navigate to={HealthPaths.HealthMedicinePaymentParticipation} replace />
      ),
    },
    {
      name: hm.medicinePrescriptions,
      path: HealthPaths.HealthMedicinePrescription,
      key: MEDICINE_LANDLAEKNIR_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePrescriptions />,
    },
    {
      name: hm.medicinePrescriptionHistory,
      path: HealthPaths.HealthMedicinePrescriptionHistory,
      key: MEDICINE_LANDLAEKNIR_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePrescriptionHistory />,
    },
    {
      name: hm.medicineDelegation,
      path: HealthPaths.HealthMedicineDelegation,
      key: MEDICINE_DELEGATION_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <MedicineDelegation />,
    },
    {
      name: hm.medicineDelegation,
      path: HealthPaths.HealthMedicineDelegationDetail,
      key: MEDICINE_DELEGATION_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <MedicineDelegationDetail />,
    },
    {
      name: hm.medicineDelegation,
      path: HealthPaths.HealthMedicineDelegationAdd,
      key: MEDICINE_DELEGATION_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <NewMedicineDelegation />,
    },
    {
      name: hm.medicinePaymentParticipation,
      path: HealthPaths.HealthMedicinePaymentParticipation,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePurchase />,
    },
    {
      name: hm.medicinePurchaseTitle,
      path: HealthPaths.HealthMedicinePurchase,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePurchase />,
    },
    {
      name: hm.medicineCalculatorTitle,
      path: HealthPaths.HealthMedicineCalculator,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicineCalculator />,
    },
    {
      name: hm.medicineLicenseTitle,
      path: HealthPaths.HealthMedicineCertificates,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicineLicence />,
    },
    {
      name: hm.medicineLicenseTitle,
      path: HealthPaths.HealthMedicineCertificate,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicineCertificate />,
    },
    {
      name: hm.healthCenterRegistrationTitle,
      path: HealthPaths.HealthCenterRegistration,
      enabled: userInfo.scopes.includes(ApiScope.healthHealthcare),
      element: <HealthCenterRegistration />,
    },
    {
      name: hm.healthCenterRegistrationTitle,
      path: HealthPaths.HealthCenterRegistrationOld,
      enabled: userInfo.scopes.includes(ApiScope.healthHealthcare),
      element: <Navigate to={HealthPaths.HealthCenterRegistration} replace />,
    },
    {
      name: hm.dentistRegisterationPageTitle,
      path: HealthPaths.HealthDentistRegistration,
      enabled: userInfo.scopes.includes(ApiScope.healthDentists),
      element: <DentistRegistration />,
    },
    {
      name: hm.dentistRegisterationPageTitle,
      path: HealthPaths.HealthDentistRegistrationOld,
      enabled: userInfo.scopes.includes(ApiScope.healthDentists),
      element: <Navigate to={HealthPaths.HealthDentistRegistration} replace />,
    },
    {
      name: hm.organDonation,
      path: HealthPaths.HealthOrganDonation,
      enabled: userInfo.scopes.includes(ApiScope.healthOrganDonation),
      element: <OrganDonation />,
    },
    {
      name: hm.organDonation,
      path: HealthPaths.HealthOrganDonationOld,
      enabled: userInfo.scopes.includes(ApiScope.healthOrganDonation),
      element: <Navigate to={HealthPaths.HealthOrganDonation} replace />,
    },
    {
      name: hm.organDonation,
      path: HealthPaths.HealthOrganDonationRegistration,
      enabled: userInfo.scopes.includes(ApiScope.healthOrganDonation),
      element: <OrganDonationRegistration />,
    },
    {
      name: hm.organDonation,
      path: HealthPaths.HealthOrganDonationRegistrationOld,
      enabled: userInfo.scopes.includes(ApiScope.healthOrganDonation),
      element: (
        <Navigate to={HealthPaths.HealthOrganDonationRegistration} replace />
      ),
    },
    {
      name: hm.vaccinations,
      path: HealthPaths.HealthVaccinations,
      enabled: userInfo.scopes.includes(ApiScope.healthVaccinations),
      element: <Vaccinations />,
    },

    {
      name: hm.bloodtype,
      path: HealthPaths.HealthBloodtype,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Bloodtype />,
    },
    {
      name: hm.referrals,
      path: HealthPaths.HealthReferrals,
      key: 'Referrals',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Referrals />,
    },
    {
      name: hm.referrals,
      path: HealthPaths.HealthReferralsDetail,
      key: 'Referrals',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <ReferralsDetail />,
    },
    {
      name: hm.waitlists,
      path: HealthPaths.HealthWaitlists,
      key: 'HealthWaitlists',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Waitlist />,
    },
    {
      name: hm.waitlists,
      path: HealthPaths.HealthWaitlistsDetail,
      key: 'HealthWaitlists',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <WaitlistDetail />,
    },
    {
      name: hm.questionnaires,
      path: HealthPaths.HealthQuestionnaires,
      key: 'HealthQuestionnaires',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Questionnaires />,
    },
    {
      name: hm.questionnaires,
      path: HealthPaths.HealthQuestionnairesDetail,
      key: 'HealthQuestionnaires',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <QuestionnairesDetail />,
    },
    {
      name: hm.questionnaire,
      path: HealthPaths.HealthQuestionnairesAnswer,
      key: 'HealthQuestionnaires',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <QuestionnairesAnswer />,
    },
    {
      name: hm.questionnaire,
      path: HealthPaths.HealthQuestionnairesAnswered,
      key: 'HealthQuestionnaires',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <QuestionnairesAnswered />,
    },
    {
      name: hm.patientData,
      path: HealthPaths.HealthPatientDataOverview,
      key: 'HealthPatientPermits',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <PatientData />,
    },
    {
      name: hm.patientDataPermit,
      path: HealthPaths.HealthPatientDataPermits,
      key: 'HealthPatientPermits',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <PatientDataPermits />,
    },
    {
      name: hm.permit,
      path: HealthPaths.HealthPatientDataPermitsDetail,
      key: 'HealthPatientPermits',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <PatientDataPermitsDetail />,
    },
    {
      name: hm.addPermit,
      path: HealthPaths.HealthPatientDataPermitsAdd,
      key: 'HealthPatientPermits',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <PatientDataNewPermit />,
    },
    {
      name: hm.appointments,
      path: HealthPaths.HealthAppointments,
      key: 'HealthAppointments',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <Appointments />,
    },
    {
      name: hm.appointmentDetail,
      path: HealthPaths.HealthAppointmentDetail,
      key: 'HealthAppointments',
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.health),
      element: <AppointmentDetail />,
    },
  ],
}
