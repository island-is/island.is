export interface ContentfulImportData {
  [key: string]: {
    value: any
    type: string
  }
}

export interface ContentfulImportOptions {
  accessToken: string
  spaceId: string
  environmentId: string
}
