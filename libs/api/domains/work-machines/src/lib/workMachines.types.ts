export enum Action {
  OWNER_CHANGE = 'ownerChange',
  REQUEST_INSPECTION = 'requestInspection',
  REGISTER_FOR_TRAFFIC = 'registerForTraffic',
  SUPERVISOR_CHANGE = 'supervisorChange',
  CHANGE_STATUS = 'changeStatus',
}

export enum ExternalLink {
  SELF = 'self',
  NEXT_PAGE = 'nextPage',
  EXCEL = 'excel',
  CSV = 'csv',
}

export enum FileType {
  CSV = 'csv',
  EXCEL = 'excel',
}

export enum LinkType {
  OWNER_CHANGE,
  REQUEST_INSPECTION,
  REGISTER_FOR_TRAFFIC,
  SUPERVISOR_CHANGE,
  CHANGE_STATUS,
  SELF,
  NEXT_PAGE,
  CSV,
  EXCEL,
}

export enum LinkCategory {
  ACTION,
  META,
  DOWNLOAD,
}
