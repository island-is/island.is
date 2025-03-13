import {
  PassData,
  PassDataInput,
  PassRevocationData,
  PassVerificationData,
  Result,
} from '../../licenseClient.type'

export abstract class BaseLicenseUpdateClientV2 {
  abstract pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
    requestId?: string,
  ): Promise<Result<PassData | undefined>>

  abstract pullUpdate(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<PassData | undefined>>

  abstract revoke(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<PassRevocationData>>

  abstract verify(
    inputData: string,
    requestId?: string,
  ): Promise<Result<PassVerificationData>>
}
