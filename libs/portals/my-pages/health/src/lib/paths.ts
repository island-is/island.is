export enum HealthPaths {
  HealthRoot = '/heilsa',

  HealthBasicInformation = 'heilsa/grunnupplysingar',
  HealthOverview = '/heilsa/grunnupplysingar/yfirlit',

  HealthDentists = '/heilsa/grunnupplysingar/tannlaeknar',
  HealthDentistRegistration = '/heilsa/grunnupplysingar/tannlaeknar/skraning',

  HealthDentistsOld = '/heilsa/tannlaeknar',
  HealthDentistRegistrationOld = '/heilsa/tannlaeknar/skraning',

  HealthOrganDonation = '/heilsa/grunnupplysingar/liffaeragjof',
  HealthOrganDonationRegistration = '/heilsa/grunnupplysingar/liffaeragjof/skraning',

  HealthOrganDonationOld = '/heilsa/liffaeragjof',
  HealthOrganDonationRegistrationOld = '/heilsa/liffaeragjof/skraning',

  HealthInsurance = '/heilsa/grunnupplysingar/sjukratryggingar',

  HealthCenter = '/heilsa/grunnupplysingar/heilsugaesla',
  HealthCenterRegistration = '/heilsa/grunnupplysingar/heilsugaesla/skraning',

  HealthCenterOld = '/heilsa/heilsugaesla',
  HealthCenterRegistrationOld = '/heilsa/heilsugaesla/skraning',

  HealthTherapies = '/heilsa/thjalfun',
  HealthTherapiesPhysical = '/heilsa/thjalfun/sjukrathjalfun',
  HealthTherapiesSpeech = '/heilsa/thjalfun/talthjalfun',
  HealthTherapiesOccupational = '/heilsa/thjalfun/idjuthjalfun',

  HealthPayments = '/heilsa/greidslur',
  HealthPaymentParticipation = '/heilsa/greidslur/greidsluthatttaka',
  HealthPaymentOverview = '/heilsa/greidslur/greidsluyfirlit',

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

  HealthVaccinations = '/heilsa/bolusetningar',
  HealthVaccinationsGeneral = '/heilsa/bolusetningar/almennar',
  HealthVaccinationsOther = '/heilsa/bolusetningar/adrar',

  HealthReferrals = '/heilsa/tilvisanir',
  HealthReferralsDetail = '/heilsa/tilvisanir/:id',

  HealthWaitlists = '/heilsa/bidlistar',
  HealthWaitlistsDetail = '/heilsa/bidlistar/:id',
}
