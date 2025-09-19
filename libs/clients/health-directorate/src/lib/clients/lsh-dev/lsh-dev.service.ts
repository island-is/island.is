import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  AppInfoApi,
  BookAppointmentApi,
  FeedbackApi,
  FoodApi,
  PatientPropertiesApi,
  AppVersionInfo,
  PatientProperties,
  AvailableResources,
  AppointmentList,
  PatientFeedback,
  Menu,
  MessageCategory,
  TableReport,
  Form,
} from './gen/fetch'

@Injectable()
export class LshDevService {
  constructor(
    private readonly appInfoApi: AppInfoApi,
    private readonly bookAppointmentApi: BookAppointmentApi,
    private readonly feedbackApi: FeedbackApi,
    private readonly foodApi: FoodApi,
    private readonly patientPropertiesApi: PatientPropertiesApi,
  ) {}

  // Helper methods to create API instances with authentication middleware
  private appInfoApiWithAuth = (auth: Auth) =>
    this.appInfoApi.withMiddleware(new AuthMiddleware(auth))

  private bookAppointmentApiWithAuth = (auth: Auth) =>
    this.bookAppointmentApi.withMiddleware(new AuthMiddleware(auth))

  private feedbackApiWithAuth = (auth: Auth) =>
    this.feedbackApi.withMiddleware(new AuthMiddleware(auth))

  private foodApiWithAuth = (auth: Auth) =>
    this.foodApi.withMiddleware(new AuthMiddleware(auth))

  private patientPropertiesApiWithAuth = (auth: Auth) =>
    this.patientPropertiesApi.withMiddleware(new AuthMiddleware(auth))

  async getPatientForms(auth: Auth): Promise<Form[]> {
    return this.patientPropertiesApiWithAuth(
      auth,
    ).apiV2PatientPropertiesGetFormListGet()
  }

  /**
   * Get patient properties
   */
  async getPatientProperties(auth: Auth): Promise<PatientProperties> {
    return this.patientPropertiesApiWithAuth(auth).apiV2PatientPropertiesGet()
  }

  /**
   * Get available resources for booking appointments
   */
  async getAvailableResources(auth: Auth): Promise<AvailableResources> {
    return this.bookAppointmentApiWithAuth(
      auth,
    ).apiV2BookAppointmentGetAvailableResourcesGet()
  }

  /**
   * Get patient appointments by ID
   */
  async getAppointments(auth: Auth, id: string): Promise<AppointmentList> {
    return this.bookAppointmentApiWithAuth(
      auth,
    ).apiV2BookAppointmentGetAppointmentsIDGet({
      iD: id,
    })
  }

  /**
   * Get table report from patient properties
   */
  async getPatientTableReport(
    auth: Auth,
    reportCode?: string,
  ): Promise<TableReport> {
    return this.patientPropertiesApiWithAuth(
      auth,
    ).apiV2PatientPropertiesGetTableReportGet({
      reportCode,
    })
  }

  /**
   * Check if patient has data
   */
  async hasDataForPatient(auth: Auth) {
    return this.patientPropertiesApiWithAuth(
      auth,
    ).apiV2PatientPropertiesHasDataForPatientGet()
  }
}
