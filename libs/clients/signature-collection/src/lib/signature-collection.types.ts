export interface GetListInput {
  areaId?: string
  nationalId?: string
}

export interface OwnerInput {
  nationalId: string
  name: string
  phone: string
  email: string
}
export interface AreaInput {
  areaId: string

}

export interface CreateListInput {
  collectionId: string
  owner: OwnerInput
  areas?: AreaInput[]
}