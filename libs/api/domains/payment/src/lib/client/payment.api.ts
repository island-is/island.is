// import fetch from 'node-fetch'

// import type { User } from '@island.is/auth-nest-tools'

// export class DrivingLicenseApi {
//   private readonly xroadApiUrl: string
//   private readonly xroadClientId: string
//   private readonly secret: string

//   constructor(xroadBaseUrl: string, xroadClientId: string, secret: string) {
//     // WRONG XROAD
//     const xroadPath =
//       'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1'
//     this.xroadApiUrl = `${xroadBaseUrl}/${xroadPath}`
//     this.xroadClientId = xroadClientId
//     this.secret = secret
//   }

//   headers() {
//     return {
//       'X-Road-Client': this.xroadClientId,
//       SECRET: this.secret,
//       Accept: 'application/json',
//     }
//   }

//   async postApi(url: string, body: {}) {
//     const res = await fetch(`${this.xroadApiUrl}/${url}`, {
//       headers: {
//         ...this.headers(),
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//       body: JSON.stringify(body),
//     })
//     return res.json()
//   }

//   async requestApi(url: string) {
//     const res = await fetch(`${this.xroadApiUrl}/${url}`, {
//       headers: this.headers(),
//     })
//     return res.json()
//   }

//   async newChargeCreated(
//     nationalId: User['nationalId'],
//     input: NewDrivingLicenseInput,
//   ): Promise<NewDrivingLicenseResult> {
//     const response = await this.drivingLicenseApi.newDrivingLicense({
//       authorityNumber: input.juristictionId,
//       needsToPresentHealthCertificate: input.needsToPresentHealthCertificate
//         ? 1
//         : 0,
//       personIdNumber: nationalId,
//     })

//     // Service returns string on error, number on successful/not successful
//     const responseIsString = typeof response !== 'string'
//     const success = responseIsString && response === 1

//     return {
//       success,
//       errorMessage: responseIsString
//         ? (response as string)
//         : 'Result not 1 when creating license',
//     }
//   }
// }