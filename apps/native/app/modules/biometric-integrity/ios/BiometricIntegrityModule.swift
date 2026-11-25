import ExpoModulesCore
import LocalAuthentication
import Security

// Detects when the set of enrolled biometrics (Face ID / Touch ID) changes
// after the user opted in. A snapshot of LocalAuthentication's opaque domain
// state is stored on enroll and compared against the current one on check.
public class BiometricIntegrityModule: Module {
  private static let service = "is.island.biometric-integrity"
  private static let account = "domain-state"

  public func definition() -> ModuleDefinition {
    Name("BiometricIntegrity")

    Function("enroll") { () -> Bool in
      guard case .available(let state) = Self.currentDomainState() else {
        return false
      }
      return Self.storeBaseline(state)
    }

    // "missing" | "unchanged" | "changed" | "unknown"
    Function("check") { () -> String in
      guard let baseline = Self.readBaseline() else {
        return "missing"
      }
      switch Self.currentDomainState() {
      case .available(let state):
        return state == baseline ? "unchanged" : "changed"
      case .removed:
        return "changed"
      case .unknown:
        return "unknown"
      }
    }

    Function("reset") {
      Self.deleteBaseline()
    }
  }

  private enum DomainState {
    case available(Data)
    // Biometrics or the device passcode were removed.
    case removed
    // Temporarily unreadable (e.g. biometry lockout) — don't draw conclusions.
    case unknown
  }

  private static func currentDomainState() -> DomainState {
    let context = LAContext()
    var error: NSError?
    // Domain state is only populated after canEvaluatePolicy succeeds.
    guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
      switch (error as? LAError)?.code {
      case .biometryNotEnrolled?, .passcodeNotSet?:
        return .removed
      default:
        return .unknown
      }
    }

    let state: Data?
    if #available(iOS 18.0, *) {
      state = context.domainState.biometry.stateHash
    } else {
      state = context.evaluatedPolicyDomainState
    }

    guard let state else {
      return .unknown
    }
    return .available(state)
  }

  private static func baseQuery() -> [String: Any] {
    return [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrService as String: service,
      kSecAttrAccount as String: account,
    ]
  }

  private static func storeBaseline(_ state: Data) -> Bool {
    deleteBaseline()
    var query = baseQuery()
    query[kSecValueData as String] = state
    query[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
    return SecItemAdd(query as CFDictionary, nil) == errSecSuccess
  }

  private static func readBaseline() -> Data? {
    var query = baseQuery()
    query[kSecReturnData as String] = true
    query[kSecMatchLimit as String] = kSecMatchLimitOne
    var result: AnyObject?
    guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess else {
      return nil
    }
    return result as? Data
  }

  private static func deleteBaseline() {
    SecItemDelete(baseQuery() as CFDictionary)
  }
}
