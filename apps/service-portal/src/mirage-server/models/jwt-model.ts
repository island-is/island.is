/* eslint-disable @typescript-eslint/camelcase */
export class JwtToken {
  id_token: string
  session_state: string
  access_token: string
  expires_in: number
  token_type: string
  refresh_token: string
  scope: string
  profile: {
    s_hash: string
    sid: string
    sub: string
    auth_time: number
    idp: string
    amr: string[]
    name: string
    natreg: string
    nat: string
  }
  expires_at: number

  constructor() {
    const dateNow = new Date().getTime()
    this.id_token =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IkY3NUMwMjdENzQyNUU2NzhDMTc3NUVCMDRDRkExMTMzIiwidHlwIjoiSldUIn0.eyJuYmYiOjE1OTgyODMwMDYsImV4cCI6MTU5ODI4MzMwNiwiaXNzIjoiaHR0cHM6Ly9zaWlkZW50aXR5c2VydmVyd2ViMjAyMDA4MDUwMjA3MzIuYXp1cmV3ZWJzaXRlcy5uZXQiLCJhdWQiOiJpc2xhbmQtaXMtMSIsImlhdCI6MTU5ODI4MzAwNiwiYXRfaGFzbCI6ImY5Z19XYnNCU0FzU2lDMk9UdkRpeEEiLCJzX2hhc2giOiIyOVl6UFdkRURMcTNhZk9TeEhJNHpRIiwic2lkIjoiNjExMDk5NDdBMDJGQzQ1MzE5QTcxRjYzRDVDMkE1MTkiLCJzdWIiOiJGNDA0QkQzM0RGQ0E1MDVFNDFFQzM1QjkwMTRFRTNCMzEzREU3MUQ2NkU0QTI1OTdEQzE3MzU5RUVBMTA3Qzc3IiwiYXV0aF90aW1lIjoxNTk4MjgyODQ1LCJpZHAiOiJpc2x5a2lsbCIsImFtciI6WyJleHRlcm5hbCJdfQ.VfjcxEPdZfC703-pRvc_9ciFij4t-ig6Y7g6nXW6ie2tcPr8aOg-TPXz9HVoOf25O3e98p7cbv4688P8DqVk470lsV2nEgCnV_SQ-bLVjwl9JellcoMNuu5XQZuCCaRsU_0VCCP_QPBChxW3A3RZV3pLSmgJV1Z9kMMvuqFEGVT7037uIDuhMK7tzjG3WOCJkN6tnYDozzh4u-_BpjPJBjUPkrHlBc8Tw9Bv-MJTQi9oDIDby2hYwzTMg0C8c2DiedPx2XDyIGihZIYaHfHNTcOlpf9xkCnS1fCncAuPMaO9-MnkDx9SVHINHXLINOcLLJEGSgcpAhzbtHdvdK5uuA'
    this.session_state =
      'V47mx2tWdi5MX4xBsPrmnT6UzvPPk1y2MmKD_5l65SM.0388E85019B424BD64CFCD14D19F8CE5'
    this.access_token =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IkY3NUMwMjdQyNUU2NzhDMTc3NUVCMDRDRkExMTMzIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE1OTgyODMwMDYsImV4cCI6MTU5ODI4NjYwNiwiaXNzIjoiaHR0cHM6Ly9zaWlkZW50aXR5c2VydmVyd2ViMjAyMDA4MDUwMjA3MzIuYXp1cmV3ZWJzaXRlcy5uZXQiLCJjbGllbnRfaWQiOiJpc2xhbmQtaXMtMSIsInN1YiI6IkY0MDRCRDMzREZDQTUwNUU0MUVDMzVCOTAxNEVFM0IzMTNERTcxRDY2RTRBMjU5N0RDMTczNTlFRUExMDdDNzciLCJhdXRoX3RpbWUiOjE1OTgyODI4NDUsImlkcCI6ImlzbHlraWxsIiwianRpIjoiNEFDMjg5RjZFNUI3MTI5NkM3OEM3NjIxMjY0MDlFNjciLCJzaWQiOiI2MTEwOTk0N0EwMkZDNDUzMTlBNzFGNjNENUMyQTUxOSIsImlhdCI6MTU5ODI4MzAwNiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJleHRlcm5hbCJ.FWV5dVGeyC1_kU6PHLo43LMqT3XJHHdaL5UqUC_BP-3E61NAO8tpSYx04J_O0B9HhX76NZlMaVP_k1EKCEoRGjeLUzGGpDCVQPTCaAKoJVoWb9D1c6CH9RyMLT41RQXrYJdKnvO5Iv0v31YwGCZxykDxHH8JTfr9Vskm8O5YHZ6-oWoHjj-GXqAPzzCXoTCd7zYQ-7LPN5nV_B8g1BuV_54zRfd1gxF5vWaaTxJKm_YPaFA7Y1IUvxicXKL45Nr6nS9fzELQLFlQFKu8KlotaqpDMha98HHGh7YDYktmzc0kHV2QJGlIy0IyITL6OBDecKayoPH-_e4hNBzEQ'
    this.expires_in = 3600
    this.token_type = 'Bearer'
    this.refresh_token =
      'F567C4D2B58029435ED025768BA98EC634F67D6437DBE02ADD682F32D9ABBC88'
    this.scope = 'openid profile offline_access'
    this.profile = {
      s_hash: '29YzPWdEDLq3afOSxHI4zQ',
      sid: '61109947A02FC45319A71F63D5C2A519',
      sub: 'F404BD33DFCA505E41EC35B9014EE3B313DE71D66E4A2597DC17359EEA107C77',
      auth_time: dateNow,
      idp: 'islykill',
      amr: ['external'],
      name: 'Tester Testerson',
      natreg: '1234561234',
      nat: 'IS',
    }
    this.expires_at = dateNow + 2 * 60 * 60 * 1000
  }
}
