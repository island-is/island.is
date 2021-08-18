import { EndOfEmployment } from './end-of-employment'
import { ApplicationStatus } from './enums/application-status.enum'
import { PersonalInfo } from './personal-info'
import { User } from './user'

export class ApplicationData {
  initialInfo: PersonalInfo
  status: ApplicationStatus
  stepCompleted: number
  endOfEmployment: EndOfEmployment
  childrenUnderCare: { name: string; nationalId: string; id?: number }[]

  static getFromUser(user: User) {
    console.log(user)
    const obj = new ApplicationData()
    obj.initialInfo = new PersonalInfo()
    obj.initialInfo.city = 'kdkdk'
    obj.initialInfo.address = user.address
    obj.initialInfo.city = user.city
    obj.initialInfo.email = user.email
    obj.initialInfo.mobile = user.gsm
    obj.initialInfo.name = user.name
    obj.initialInfo.postalCode = user.postalCode
    obj.initialInfo.nationalId = user.nationalId

    return obj
  }
}
