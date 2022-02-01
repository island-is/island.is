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
            SaekjaPDFAfritFramtalsEinstaklingsResult: [
              {
                'b:Tokst': [boolean]
                'b:Villubod': [string]
                'b:PDFAfritFramtals': [string]
              },
            ]
          },
        ]
      },
    ]
  }
}
