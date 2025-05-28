import { Roles, States } from './enums'

export interface DemoInterface {
  name: string
  age: number
  applicationState: States
  roles: Array<Roles>
}
