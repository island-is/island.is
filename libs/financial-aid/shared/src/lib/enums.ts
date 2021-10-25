export enum HomeCircumstances {
  UNKNOWN = 'Unknown',
  WITHPARENTS = 'WithParents',
  WITHOTHERS = 'WithOthers',
  OWNPLACE = 'OwnPlace',
  REGISTEREDLEASE = 'RegisteredLease',
  OTHER = 'Other',
}

export enum Employment {
  WORKING = 'Working',
  UNEMPLOYED = 'Unemployed',
  CANNOTWORK = 'CannotWork',
  OTHER = 'Other',
}

export enum ApplicationState {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  DATANEEDED = 'DataNeeded',
  REJECTED = 'Rejected',
  APPROVED = 'Approved',
}

export enum ApplicationStateUrl {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  PROCESSED = 'Processed',
}

export enum ApplicationEventType {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  DATANEEDED = 'DataNeeded',
  REJECTED = 'Rejected',
  APPROVED = 'Approved',
  STAFFCOMMENT = 'StaffComment',
  USERCOMMENT = 'UserComment',
  FILEUPLOAD = 'FileUpload',
  ASSIGNCASE = 'AssignCase',
}

export enum RolesRule {
  OSK = 'osk',
  VEITA = 'veita',
}

export enum FileType {
  TAXRETURN = 'TaxReturn',
  INCOME = 'Income',
  OTHER = 'Other',
  SPOUSEFILES = 'SpouseFiles',
}

export enum StaffRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
}

export enum FamilyStatus {
  UNKNOWN = 'Unknown',
  SINGLE = 'Single',
  COHABITATION = 'Cohabitation',
  UNREGISTERED_COBAHITATION = 'UnregisteredCohabitation',
  MARRIED = 'Married',
  MARRIED_NOT_LIVING_TOGETHER = 'MarriedNotLivingTogether',
  NOT_INFORMED = 'NotInformed',
}

export enum AidType {
  INDIVIDUAL = 'Individual',
  COHABITATION = 'Cohabitation',
}

export enum MartialStatusType {
  MARRIED = 'Married',
  SINGLE = 'Single',
}
