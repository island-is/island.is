export enum AuthDelegationType {
  ProcurationHolder = 'ProcurationHolder',
  LegalGuardian = 'LegalGuardian',
  Custom = 'Custom',
  PersonalRepresentative = 'PersonalRepresentative',
  LegalGuardianMinor = 'LegalGuardianMinor',
  LegalRepresentative = 'LegalRepresentative',
  GeneralMandate = 'GeneralMandate',
  ExecutiveDirector = 'ExecutiveDirector',
}

export enum AuthDelegationProvider {
  NationalRegistry = 'thjodskra',
  CompanyRegistry = 'fyrirtaekjaskra',
  PersonalRepresentativeRegistry = 'talsmannagrunnur',
  Custom = 'delegationdb',
  DistrictCommissionersRegistry = 'syslumenn',
}
