// ATTENTION -> When adding or changing paths, please always make sure to redirect old paths. The app is using links to navigate
const basicInformation = '/heilsa/grunnupplysingar'
export enum HealthPaths {
  HealthRoot = '/heilsa',

  HealthBasicOld = '/heilsa/yfirlit',
  HealthBasicInformation = `${basicInformation}`,
  HealthOverview = `${basicInformation}/yfirlit`,

  HealthDentists = `${basicInformation}/tannlaeknar`,
  HealthDentistRegistration = `${basicInformation}/tannlaeknar/skraning`,

  HealthOrganDonation = `${basicInformation}/liffaeragjof`,
  HealthOrganDonationRegistration = `${basicInformation}/liffaeragjof/skraning`,

  HealthInsurance = `${basicInformation}/sjukratryggingar`,

  HealthCenter = `${basicInformation}/heilsugaesla`,
  HealthCenterRegistration = `${basicInformation}/heilsugaesla/skraning`,

  HealthDentistsOld = '/heilsa/tannlaeknar',
  HealthDentistRegistrationOld = '/heilsa/tannlaeknar/skraning',

  HealthOrganDonationOld = '/heilsa/liffaeragjof',
  HealthOrganDonationRegistrationOld = '/heilsa/liffaeragjof/skraning',

  HealthCenterOld = '/heilsa/heilsugaesla',
  HealthCenterRegistrationOld = '/heilsa/heilsugaesla/skraning',

  HealthTherapies = '/heilsa/thjalfun',
  HealthTherapiesPhysical = '/heilsa/thjalfun/sjukrathjalfun',
  HealthTherapiesSpeech = '/heilsa/thjalfun/talthjalfun',
  HealthTherapiesOccupational = '/heilsa/thjalfun/idjuthjalfun',

  HealthPayments = '/heilsa/greidslur',
  HealthPaymentParticipation = '/heilsa/greidslur/greidsluthatttaka',
  HealthPaymentOverview = '/heilsa/greidslur/greidsluyfirlit',
  HealthPaymentRights = '/heilsa/greidslur/rettindi',

  HealthAidsAndNutrition = '/heilsa/hjalpartaeki-og-naering',

  HealthMedicine = '/heilsa/lyf',
  HealthMedicinePaymentParticipation = '/heilsa/lyf/greidsluthatttaka',
  HealthMedicinePurchase = '/heilsa/lyf/greidsluthatttaka/lyfjakaup',
  HealthMedicineCalculator = '/heilsa/lyf/greidsluthatttaka/lyfjareiknivel',
  HealthMedicineCertificates = '/heilsa/lyf/lyfjaskirteini',
  HealthMedicineCertificate = '/heilsa/lyf/lyfjaskirteini/:name/:id',
  HealthMedicinePrescription = '/heilsa/lyf/lyfjaavisanir',
  HealthMedicinePrescriptionOverview = '/heilsa/lyf/lyfjaavisanir/yfirlit',
  HealthMedicinePrescriptionHistory = '/heilsa/lyf/lyfjasaga',
  HealthMedicineDelegation = '/heilsa/lyf/lyfjaumbod',
  HealthMedicineDelegationDetail = '/heilsa/lyf/lyfjaumbod/:id',
  HealthMedicineDelegationAdd = '/heilsa/lyf/lyfjaumbod/nytt-lyfjaumbod',

  HealthVaccinations = '/heilsa/bolusetningar',
  HealthVaccinationsGeneral = '/heilsa/bolusetningar/almennar',
  HealthVaccinationsOther = '/heilsa/bolusetningar/adrar',

  HealthBloodtype = '/heilsa/blodflokkur',

  HealthReferrals = '/heilsa/tilvisanir',
  HealthReferralsDetail = '/heilsa/tilvisanir/:id',

  HealthWaitlists = '/heilsa/bidlistar',
  HealthWaitlistsDetail = '/heilsa/bidlistar/:id',

  HealthPatientData = '/heilsa/sjukraskra',
  HealthPatientDataOverview = '/heilsa/sjukraskra/yfirlit',
  HealthPatientDataPermits = '/heilsa/sjukraskra/heimildir',
  HealthPatientDataPermitsDetail = '/heilsa/sjukraskra/heimildir/:id',
  HealthPatientDataPermitsAdd = '/heilsa/sjukraskra/heimildir/ny-heimild',
}
