import { ServiceOffice } from "./common";

export interface PersonalInfo {
    name: string;
    address: string;
    postalCode: number;
    city: string;
    socialSecurityNumber: string;
    serviceOffice: ServiceOffice[];
    email: string;
    mobile: number;
    phone?: number;
    communicationSecret: string;
}