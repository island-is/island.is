import { ServiceOffice } from "./common";

export interface OtherInformation {
    fullTimeJob: boolean;
    workArea?: ServiceOffice[];
    canStart: Date;
}