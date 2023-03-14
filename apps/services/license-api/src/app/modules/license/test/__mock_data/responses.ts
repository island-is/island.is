import { UpdateLicenseResponse } from '../../dto/updateLicense.dto'
import { RevokeLicenseResponse } from '../../dto/revokeLicense.dto'
import { VerifyLicenseResponse } from '../../dto/verifyLicense.dto'

export const UPDATE_PASS_RESPONSE: UpdateLicenseResponse = {
  updateSuccess: true,
}

export const REVOKE_PASS_RESPONSE: RevokeLicenseResponse = {
  revokeSuccess: true,
}

export const VERIFY_PASS_RESPONSE: VerifyLicenseResponse = {
  valid: true,
}
