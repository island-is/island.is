import { requireOptionalNativeModule } from 'expo'

/**
 * - missing: no baseline has been enrolled
 * - unchanged: enrolled biometrics match the baseline
 * - changed: a face/finger was added or removed since the baseline
 * - unknown: state can't be read right now (e.g. biometry lockout)
 */
export type BiometricEnrollmentStatus =
  | 'missing'
  | 'unchanged'
  | 'changed'
  | 'unknown'

interface BiometricIntegrityNativeModule {
  enroll(): boolean
  check(): BiometricEnrollmentStatus
  reset(): void
}

// Optional so a dev client built before this module existed keeps running.
const BiometricIntegrity =
  requireOptionalNativeModule<BiometricIntegrityNativeModule>(
    'BiometricIntegrity',
  )

/**
 * Snapshots the currently enrolled biometrics. Returns false when no
 * biometrics are enrolled or the snapshot could not be stored.
 */
export function enrollBiometricBaseline(): boolean {
  return BiometricIntegrity?.enroll() ?? false
}

export function checkBiometricEnrollment(): BiometricEnrollmentStatus {
  return BiometricIntegrity?.check() ?? 'unknown'
}

export function clearBiometricBaseline(): void {
  BiometricIntegrity?.reset()
}
