export enum HealthPaths {
  HealthRoot = '/heilsa',

  HealthTherapies = '/heilsa/thjalfun',
  HealthTherapiesPhysical = '/heilsa/thjalfun/sjukrathjalfun',
  HealthTherapiesSpeech = '/heilsa/thjalfun/talthjalfun',
  HealthTherapiesOccupational = '/heilsa/thjalfun/idjuthjalfun',

  HealthPayments = '/heilsa/greidslur',
  HealthPaymentParticipation = '/heilsa/greidslur/greidsluthattaka',
  HealthPaymentOverview = '/heilsa/greidslur/greidsluyfirlit',

  HealthAidsAndNutrition = '/heilsa/hjalpartaeki-og-naering',

  HealthDentists = '/heilsa/tannlaeknar',
  HealthDentistRegistration = '/heilsa/tannlaeknar/skraning',

  HealthMedicine = '/heilsa/lyf',
  HealthMedicinePurchase = '/heilsa/lyf/lyfjakaup',
  HealthMedicineCalculator = '/heilsa/lyf/lyfjareiknivel',
  HealthMedicineCertificates = '/heilsa/lyf/lyfjaskyrteini',
  HealthMedicineCertificate = '/heilsa/lyf/lyfjaskyrteini/:name/:id',

  HealthCenter = '/heilsa/heilusgaesla',
  HealthCenterRegistration = '/heilsa/heilsugaesla/skraning',
}
