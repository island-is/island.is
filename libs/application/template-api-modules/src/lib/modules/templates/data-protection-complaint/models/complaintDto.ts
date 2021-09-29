export interface ComplaintDto {
  applicantInfo: {
    name: string,
    nationalId: string
  },
  onBehalf: string//"myself | myself and others | others | stofnanir og felagsamtok",
  agency: {
    files: string[],
    persons: Agency[]
  } | null,
  contactInfo: {
    name: string,
    nationalId: string,
    type: string, //person | felag/samtok,
    address: string,
    email: string,
    phone: string,
    postalCode: string,
    city: string
  },
  targetsOfComplaint: TargetOfComplaint[],
  complaintCategories: string[],
  description: string,
  attachments: [],
  applicationPdf: string
}

export interface TargetOfComplaint {
  name: string,
  address: string,
  nationalId: string,
  operatesWithinEurope: boolean, //yes | no,
  countryOfOperation: string,
}

export interface Agency {
  name: string,
  nationalId: string,
}
