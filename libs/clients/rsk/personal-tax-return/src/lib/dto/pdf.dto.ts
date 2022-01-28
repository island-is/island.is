export interface PdfDto {
  success: boolean
  errorText: string
  content: string
}

export interface PdfResponse {
  's:Envelope': {
    's:Body': [
      {
        SaekjaPDFAfritFramtalsEinstaklingsResponse: [
          {
            'b:Tokst': [boolean]
            'b:Villubod': [string]
            'b:PDFAfritFramtals': [string]
          },
        ]
      },
    ]
  }
}
