export enum DataProviderTypes {
  NationalRegistry = 'NationalRegistryProvider',
  UserProfile = 'UserProfileProvider',
}

export enum FishingLicenseEnum {
  HOOKCATCHLIMIT = 'hookCatchLimit',
  CATCHLIMIT = 'catchLimit',
}

export type ShipInformationType = {
  shipName: string
  shipNumber: string
  grossTonn: string
  length: string
  homePort: string
  seaworthiness: Date
  price: number
  explanation: string
}
