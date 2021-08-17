export interface CalculationParameters {
  JobPercentage: number,  // ProsStarfs
  DateOfFirstUnemploymentPayment: Date, //DagsByrAtvL
  DateOfCurrentUnemploymentInterval: Date,  // DagsGrMan
  NumberOfChildren: number, // FjBarna
  FormerSalary: number, // UpphVmTekju
  PartialJobPayment: number,  // HlStTekjur
  PercentageOfPartialJob: number, // ProsHlSt
  SocialSecurityBenefits: number, // LifGrTR
  PersionPayment: number, // LifGrLifSj
  CapitalGainsPayment: number,  // FjarmTekj
//  PrivatePensionPayment: number,  // GrSereign

};

export function makeCalculations(params: CalculationParameters) {
  const constants = {
    BaseUnemploymentBenefitAmount: 307430, // GrU
    MaximumUnemploymentBenefitSalaryConnected: 472835, // MaxTekjTeng
    PercentOfSalaryConnected: 0.7, // PrTekjTeng
    PercentPerChildWithBaseUnemploymentBenefits: 0.06, //PrBbGr
    PercentPerChildWithSalaryConnectedBenefits: 0.04, // PrBbTekjuTeng
    MaximumAllowedEarningsWithoutBenefitCut: 71262, // FriTekjMark
    DateUntilSalaryConnectedBenefitsIsSixMonths : "2021-09-30",  // 2021-09-30  -- ath
  }
  
  // Calculations

  let BenefitRate = 0.0,  // Botarettur
  AmountSalaryConnectedBenefits = 0.0,  // UpphTekjTRett
  NumberOfMonthsWithBenefitSalaryConnected = 0, // FjManTekjTRett
  UnemploymentBenefitAmout = 0,  // UpphBota
  BenefitAmountForChildren = 0,  // GrBarna
  BenefitDeduction = 0   // Skerding
  ;
 
  if ( params.JobPercentage == 100 ) {
    BenefitRate = 1;
  }
  else if ( params.JobPercentage >= 75 ) {
    BenefitRate = 0.75;
  }
  else if ( params.JobPercentage >= 50 ) {
    BenefitRate = 0.5;
  }
  else if ( params.JobPercentage >= 25 ) {
    BenefitRate = 0.25;
  };
  
  AmountSalaryConnectedBenefits = constants.BaseUnemploymentBenefitAmount;
  if ( params.FormerSalary*constants.PercentOfSalaryConnected >= constants.MaximumUnemploymentBenefitSalaryConnected ) {
    AmountSalaryConnectedBenefits = constants.MaximumUnemploymentBenefitSalaryConnected;
  }
  else if ( params.FormerSalary*constants.PercentOfSalaryConnected >= constants.BaseUnemploymentBenefitAmount ) {
    AmountSalaryConnectedBenefits = params.FormerSalary*constants.PercentOfSalaryConnected;
  };

  if( 1 == 1 ) { // params.DateOfFirstUnemploymentPayment.toISOString <= constants.DateUntilSalaryConnectedBenefitsIsSixMonths ) {
    NumberOfMonthsWithBenefitSalaryConnected = 6;
  } else {
    NumberOfMonthsWithBenefitSalaryConnected = 3;
  }

  if( AmountSalaryConnectedBenefits == constants.BaseUnemploymentBenefitAmount
      //  || DagsGrMan - DagsByrAtvL > FjManTekjTRett
     ) {
  UnemploymentBenefitAmout = constants.BaseUnemploymentBenefitAmount;
  BenefitAmountForChildren = params.NumberOfChildren * constants.BaseUnemploymentBenefitAmount * constants.PercentPerChildWithBaseUnemploymentBenefits;
     }

}
