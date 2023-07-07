export interface Major {
  id?: number
  name?: string
  credits?: number
  // outcome?: string
  majorTypeKey?: string
  // title?: string
  departmentId?: number
  // creditsType?: string
  years?: number
  courseRegistrationBegins?: Date
  courseRegistrationEnds?: Date
}

export interface Department {
  id?: number
  name?: string
}
