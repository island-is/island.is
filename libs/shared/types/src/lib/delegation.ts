export enum AuthDelegationType {
  ProcurationHolder = 'ProcurationHolder',
  LegalGuardian = 'LegalGuardian',
  Custom = 'Custom',
  PersonalRepresentative = 'PersonalRepresentative',
}

export enum AuthDelegationProvider {
  NationalRegistry = 'thjodskra',
  CompanyRegistry = 'fyrirtaekjaskra',
  PersonalRepresentativeRegistry = 'talsmannagrunnur',
  Custom = 'delegationdb',
}
