import { PatientBlood } from '../../../gen/fetch'

export interface BloodTypeDto {
  nationalId: string
  type: string
  // ISO8601
  registered?: string
  bloodInfo?: {
    description: string
    //url to information page
    page?: string
  }
}

export const mapBloodTypeDto = (data: PatientBlood): BloodTypeDto | null => {
  if (!data.nationalId || !data.type) {
    return null
  }
  return {
    nationalId: data.nationalId,
    type: data.type,
    registered: data.registerd ? data.registerd.toISOString() : undefined,
    bloodInfo:
      data.bloodInfo && data.bloodInfo.descripton
        ? {
            description: data.bloodInfo.descripton,
            page: data.bloodInfo.page ?? undefined,
          }
        : undefined,
  }
}
