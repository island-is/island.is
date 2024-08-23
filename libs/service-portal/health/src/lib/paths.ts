export enum HealthPaths {
  HealthRoot = '/heilsa',

  HealthOverview = '/heilsa/yfirlit',

  HealthOrganDonation = '/heilsa/liffaeragjof',
  HealthOrganDonationRegistration = '/heilsa/liffaeragjof/skraning',

  HealthTherapies = '/heilsa/thjalfun',
  HealthTherapiesPhysical = '/heilsa/thjalfun/sjukrathjalfun',
  HealthTherapiesSpeech = '/heilsa/thjalfun/talthjalfun',
  HealthTherapiesOccupational = '/heilsa/thjalfun/idjuthjalfun',

  HealthPayments = '/heilsa/greidslur',
  HealthPaymentParticipation = '/heilsa/greidslur/greidsluthatttaka',
  HealthPaymentOverview = '/heilsa/greidslur/greidsluyfirlit',

  HealthAidsAndNutrition = '/heilsa/hjalpartaeki-og-naering',

  HealthDentists = '/heilsa/tannlaeknar',
  HealthDentistRegistration = '/heilsa/tannlaeknar/skraning',

  HealthMedicine = '/heilsa/lyf',
  HealthMedicinePurchase = '/heilsa/lyf/lyfjakaup',
  HealthMedicineCalculator = '/heilsa/lyf/lyfjareiknivel',
  HealthMedicineCertificates = '/heilsa/lyf/lyfjaskirteini',
  HealthMedicineCertificate = '/heilsa/lyf/lyfjaskirteini/:name/:id',

  HealthCenter = '/heilsa/heilsugaesla',
  HealthCenterRegistration = '/heilsa/heilsugaesla/skraning',

  HealthVaccinations = '/heilsa/bolusetningar',
  HealthVaccinationsGeneral = '/heilsa/bolusetningar/almennar',
  HealthVaccinationsOther = '/heilsa/bolusetningar/adrar',
}
