export interface GetFaUmsoknSjukratryggingTypeDto {
  FaUmsoknSjukratryggingType: FaUmsoknSjukratryggingType
}

interface FaUmsoknSjukratryggingType {
  umsoknir?: Umsoknir[]
}

interface Umsoknir {
  skjalanumer: number
  stada: number
}
