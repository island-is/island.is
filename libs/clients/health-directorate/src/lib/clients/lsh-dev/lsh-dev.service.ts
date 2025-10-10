import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  AppInfoApi,
  BookAppointmentApi,
  FeedbackApi,
  FoodApi,
  Form,
  PatientPropertiesApi,
} from './gen/fetch'

// Example of posting form answers
// .. rest of question
// "CurrentValues": {
//    "Label": "Label1;Label3",
//    "Value": "Value1;Value3;"
// },
interface postPatientForm {
  CurrentValues: {
    Label: string
    Value: string
  }
  EntryID: string
}
@Injectable()
export class LshDevService {
  constructor(
    private readonly appInfoApi: AppInfoApi,
    private readonly bookAppointmentApi: BookAppointmentApi,
    private readonly feedbackApi: FeedbackApi,
    private readonly foodApi: FoodApi,
    private readonly patientPropertiesApi: PatientPropertiesApi,
  ) {}

  private patientPropertiesApiWithAuth = (auth: Auth) =>
    this.patientPropertiesApi.withMiddleware(new AuthMiddleware(auth))

  async getPatientForms(auth: Auth): Promise<Form[]> {
    const data = await this.patientPropertiesApiWithAuth(
      auth,
    ).apiV2PatientPropertiesGetFormListGet()
    return data
  }

  async postPatientForm(auth: Auth, form: any): Promise<boolean> {
    return await this.patientPropertiesApiWithAuth(
      auth,
    ).apiV2PatientPropertiesSubmitFormAnswersPost(form)
  }
}
