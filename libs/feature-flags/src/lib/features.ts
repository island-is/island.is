export enum Features {
  // Shows delegation picker in Identity Server and the Service Portal.
  delegationsEnabled = 'identityserverDelegationsEnabled',

  // Toggles the different kinds of delegations.
  customDelegations = 'isServicePortalAccessControlModuleEnabled',
  companyDelegations = 'identityserverCompanyDelegations',
  legalGuardianDelegations = 'identityserverLegalGuardianDelegations',
  personalRepresentativeDelegations = 'identityserverPersonalRepresentative',
  personalInformation = 'isServicePortalPersonalInformationModuleEnabled',

  // Application visibility flags
  exampleApplication = 'isExampleApplicationEnabled',
  accidentNotification = 'isAccidentNotificationEnabled',
}
