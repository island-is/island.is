export interface Juristiction {
  id: number
  name: string
  zip: number
}

export interface QualityPhotoResult {
  success: boolean
  qualityPhoto: string | null
  errorMessage: string | null
}
