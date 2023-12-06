export enum HomeCircumstances {
  UNKNOWN = 'Unknown',
  WITHPARENTS = 'WithParents',
  WITHOTHERS = 'WithOthers',
  OWNPLACE = 'OwnPlace',
  REGISTEREDLEASE = 'RegisteredLease',
  UNREGISTEREDLEASE = 'UnregisteredLease',
  OTHER = 'Other',
}

export enum AidTypeHomeCircumstances {
  OWNPLACE = 'OwnPlace',
  REGISTEREDLEASE = 'RegisteredLease',
  UNREGISTEREDLEASE = 'UnregisteredLease',
  WITHOTHERS = 'WithOthers',
  WITHPARENTS = 'WithParents',
  UNKNOWN = 'Unknown',
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

export enum ApplicationFiltersEnum {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  DATANEEDED = 'DataNeeded',
  REJECTED = 'Rejected',
  APPROVED = 'Approved',
  MYCASES = 'MyCases',
}

export enum ApplicationHeaderSortByEnum {
  NAME = 'name',
  STATE = 'state',
  MODIFIED = 'modified',
  CREATED = 'created',
  STAFF = 'staff',
}

export enum ApplicationStateUrl {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  MYCASES = 'MyCases',
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
  SPOUSEFILEUPLOAD = 'SpouseFileUpload',
  ASSIGNCASE = 'AssignCase',
}

export enum FileType {
  TAXRETURN = 'TaxReturn',
  INCOME = 'Income',
  OTHER = 'Other',
  SPOUSEFILES = 'SpouseFiles',
}

export enum StaffRole {
  SUPERADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
}

export enum FamilyStatus {
  COHABITATION = 'Cohabitation',
  UNREGISTERED_COBAHITATION = 'UnregisteredCohabitation',
  MARRIED = 'Married',
  MARRIED_NOT_LIVING_TOGETHER = 'MarriedNotLivingTogether',
  NOT_COHABITATION = 'NotCohabitation',
}

export enum AidType {
  INDIVIDUAL = 'Individual',
  COHABITATION = 'Cohabitation',
}

export enum MartialStatusType {
  MARRIED = 'Married',
  SINGLE = 'Single',
}

export enum AmountModal {
  ESTIMATED = 'Estimated',
  PROVIDED = 'Provided',
}

export enum UserType {
  APPLICANT = 'Applicant',
  SPOUSE = 'Spouse',
}

export enum AidName {
  OWNPLACE = 'ownPlace',
  REGISTEREDRENTING = 'registeredRenting',
  UNREGISTEREDRENTING = 'unregisteredRenting',
  WITHOTHERS = 'withOthers',
  LIVESWITHPARENTS = 'livesWithParents',
  UNKNOWN = 'unknown',
}
