export interface Actor {
  id: number
  name: string
  nationalId: string
  subjectIds: number[]
}

export type ActorDto = Omit<Actor, 'id' | 'subjectIds'>
