export interface GetSjukratryggdurTypeDto {
  SjukratryggdurType: SjukratryggdurType
}
interface SjukratryggdurType {
  radnumer_si: number
  sjukratryggdur: number
  dags?: Date
  a_bidtima?: number
}
