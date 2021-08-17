import { ApplicationStatus } from "./enums/application-status.enum";
import { InitialInfo } from "./initial-info";

export class ApplicationData {
    initialInfo: InitialInfo
    status: ApplicationStatus
}