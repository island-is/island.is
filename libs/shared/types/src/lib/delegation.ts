export enum AuthDelegationType {
  ProcurationHolder = 'ProcurationHolder',
  LegalGuardian = 'LegalGuardian',
  Custom = 'Custom',
  PersonalRepresentative = 'PersonalRepresentative',
  LegalRepresentative = 'LegalRepresentative',
}

export enum AuthDelegationProvider {
  NationalRegistry = 'thjodskra',
  CompanyRegistry = 'fyrirtaekjaskra',
  PersonalRepresentativeRegistry = 'talsmannagrunnur',
  Custom = 'delegationdb',
  DistrictCommissionersRegistry = 'syslumenn',
}
