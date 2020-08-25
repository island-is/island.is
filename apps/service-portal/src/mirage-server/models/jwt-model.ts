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
    this.id_token = 'TestiIdToken'
    this.session_state = 'TestiSessionState'
    this.access_token = 'TestiAccessToken'
    this.expires_in = 3600
    this.token_type = 'Bearer'
    this.refresh_token = 'TestiRefreshToken'
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
