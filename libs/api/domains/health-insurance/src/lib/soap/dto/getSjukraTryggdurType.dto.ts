export interface GetSjukratryggdurTypeDto {
  SjukratryggdurType: SjukratryggdurType
}
interface SjukratryggdurType {
  radnumer_si: number
  sjukratryggdur: number
  dags?: string
  a_bidtima?: number
}
