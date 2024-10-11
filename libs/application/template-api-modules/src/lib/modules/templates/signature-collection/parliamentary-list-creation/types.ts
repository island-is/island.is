export type Area = {
  id: string
  name: string
  min: number
}
export type SignatureCollection = {
  areas: Area[]
  endTime: Date
  id: string
  name: string
  startTime: Date
}
