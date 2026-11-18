import CryptoKit
import DeviceCheck
import ExpoModulesCore
import LocalAuthentication
import Security

// Hardware-bound P-256 keys for device-bound auth. Private keys are created
// in the Secure Enclave and never leave it. Where there is no Secure Enclave
// (the simulator) a software key is created instead and reported as such.
//
// The biometric key uses .biometryCurrentSet, so iOS makes it unusable once
// the enrolled biometrics change. The biometry domain state at creation is
// stored next to it so a change is reported before showing a prompt that
// could never succeed.
public class DeviceKeysModule: Module {
  private static let service = "is.island.device-keys"
  private static let domainStateAccount = "biometric-domain-state"
  private static let appAttestKeyIdAccount = "app-attest-key-id"

  public func definition() -> ModuleDefinition {
    Name("DeviceKeys")

    AsyncFunction("generateKey") { (alias: DeviceKeyAlias, _: GenerateKeyOptions) -> [String: Any] in
      try Self.generateKey(alias)
    }

    Function("getKey") { (alias: DeviceKeyAlias) -> [String: Any]? in
      guard let key = Self.loadPrivateKey(alias) else {
        return nil
      }
      return try Self.describe(key)
    }

    Function("deleteKey") { (alias: DeviceKeyAlias) in
      Self.deleteKey(alias)
    }

    AsyncFunction("signWithInstallKey") { (data: String) -> String in
      guard let key = Self.loadPrivateKey(.install) else {
        throw Self.exception("NOT_FOUND", "No install key")
      }
      return try Self.sign(data, with: key)
    }

    AsyncFunction("signWithBiometricKey") { (data: String, prompt: BiometricPromptOptions, promise: Promise) in
      guard let baseline = Self.readItem(Self.domainStateAccount), Self.loadPrivateKey(.biometric) != nil else {
        promise.reject(Self.exception("NOT_FOUND", "No biometric key"))
        return
      }

      switch Self.currentBiometry() {
      case .available(let state) where state != baseline:
        promise.reject(Self.exception("INVALIDATED", "The enrolled biometrics changed"))
        return
      case .notEnrolled:
        promise.reject(Self.exception("INVALIDATED", "The enrolled biometrics were removed"))
        return
      case .lockedOut:
        promise.reject(Self.exception("LOCKOUT", "Biometrics are locked out"))
        return
      case .unavailable:
        promise.reject(Self.exception("BIOMETRICS_UNAVAILABLE", "Biometrics are not available"))
        return
      case .available:
        break
      }

      let context = LAContext()
      // Biometrics only: hides the "Enter Passcode" fallback button.
      context.localizedFallbackTitle = ""
      context.localizedCancelTitle = prompt.cancel
      context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: prompt.title) { success, error in
        guard success else {
          promise.reject(Self.exception(for: error))
          return
        }
        do {
          // Signing with the evaluated context doesn't prompt a second time.
          guard let key = Self.loadPrivateKey(.biometric, context: context) else {
            throw Self.exception("NOT_FOUND", "No biometric key")
          }
          promise.resolve(try Self.sign(data, with: key))
        } catch {
          promise.reject(error)
        }
      }
    }

    // iOS attests through App Attest rather than a certificate chain.
    Function("getAttestationChain") { (_: DeviceKeyAlias) -> [String]? in
      nil
    }

    // False on the simulator.
    Function("isAppAttestSupported") { () -> Bool in
      DCAppAttestService.shared.isSupported
    }

    AsyncFunction("attestWithAppAttest") { (clientData: String, promise: Promise) in
      Self.attestWithAppAttest(clientData, promise: promise)
    }

    Function("getAppAttestKeyId") { () -> String? in
      Self.readItem(Self.appAttestKeyIdAccount).flatMap { String(data: $0, encoding: .utf8) }
    }
  }

  // MARK: - Keys

  private static func tag(_ alias: DeviceKeyAlias) -> Data {
    Data("\(service).\(alias.rawValue)".utf8)
  }

  private static func generateKey(_ alias: DeviceKeyAlias) throws -> [String: Any] {
    var domainState: Data?
    if alias == .biometric {
      switch currentBiometry() {
      case .available(let state):
        domainState = state
      case .lockedOut:
        throw exception("LOCKOUT", "Biometrics are locked out")
      case .notEnrolled, .unavailable:
        throw exception("BIOMETRICS_UNAVAILABLE", "No biometrics are enrolled")
      }
    }

    deleteKey(alias)

    let secureEnclave = SecureEnclave.isAvailable
    var flags: SecAccessControlCreateFlags = secureEnclave ? [.privateKeyUsage] : []
    if alias == .biometric {
      flags.insert(.biometryCurrentSet)
    }

    var error: Unmanaged<CFError>?
    guard let access = SecAccessControlCreateWithFlags(
      nil,
      kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly,
      flags,
      &error
    ) else {
      throw failure("Could not create the key access control", error)
    }

    var attributes: [String: Any] = [
      kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
      kSecAttrKeySizeInBits as String: 256,
      kSecPrivateKeyAttrs as String: [
        kSecAttrIsPermanent as String: true,
        kSecAttrApplicationTag as String: tag(alias),
        kSecAttrAccessControl as String: access,
      ],
    ]
    if secureEnclave {
      attributes[kSecAttrTokenID as String] = kSecAttrTokenIDSecureEnclave
    }

    guard let key = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
      throw failure("Could not create the key", error)
    }

    if let domainState, !storeItem(domainState, account: domainStateAccount) {
      deleteKey(alias)
      throw exception("FAILED", "Could not store the biometry state")
    }

    return try describe(key)
  }

  private static func loadPrivateKey(_ alias: DeviceKeyAlias, context: LAContext? = nil) -> SecKey? {
    var query: [String: Any] = [
      kSecClass as String: kSecClassKey,
      kSecAttrKeyClass as String: kSecAttrKeyClassPrivate,
      kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
      kSecAttrApplicationTag as String: tag(alias),
      kSecReturnRef as String: true,
    ]
    if let context {
      query[kSecUseAuthenticationContext as String] = context
    }
    var result: AnyObject?
    guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess, let result else {
      return nil
    }
    // CF types can't be cast conditionally; kSecReturnRef guarantees a SecKey.
    return (result as! SecKey)
  }

  private static func deleteKey(_ alias: DeviceKeyAlias) {
    SecItemDelete([
      kSecClass as String: kSecClassKey,
      kSecAttrKeyClass as String: kSecAttrKeyClassPrivate,
      kSecAttrApplicationTag as String: tag(alias),
    ] as CFDictionary)
    switch alias {
    case .install:
      deleteItem(appAttestKeyIdAccount)
    case .biometric:
      deleteItem(domainStateAccount)
    }
  }

  private static func describe(_ privateKey: SecKey) throws -> [String: Any] {
    var error: Unmanaged<CFError>?
    guard
      let publicKey = SecKeyCopyPublicKey(privateKey),
      let point = SecKeyCopyExternalRepresentation(publicKey, &error) as Data?,
      // Uncompressed point: 0x04 || x || y
      point.count == 65
    else {
      throw failure("Could not read the public key", error)
    }

    let x = base64url(point.subdata(in: 1..<33))
    let y = base64url(point.subdata(in: 33..<65))
    // RFC 7638: required members only, in lexicographic order, no whitespace.
    let canonical = #"{"crv":"P-256","kty":"EC","x":"\#(x)","y":"\#(y)"}"#
    let thumbprint = base64url(Data(SHA256.hash(data: Data(canonical.utf8))))

    let attributes = SecKeyCopyAttributes(privateKey) as? [String: Any]
    let tokenID = attributes?[kSecAttrTokenID as String] as? String
    let securityLevel = tokenID == (kSecAttrTokenIDSecureEnclave as String) ? "secureEnclave" : "software"

    return [
      "publicJwk": ["kty": "EC", "crv": "P-256", "x": x, "y": y],
      "thumbprint": thumbprint,
      "securityLevel": securityLevel,
    ]
  }

  private static func sign(_ data: String, with key: SecKey) throws -> String {
    var error: Unmanaged<CFError>?
    guard let der = SecKeyCreateSignature(
      key,
      .ecdsaSignatureMessageX962SHA256,
      Data(data.utf8) as CFData,
      &error
    ) as Data? else {
      throw failure("Could not sign", error)
    }
    // Security returns DER; JWS (ES256) needs the fixed-length r || s form.
    let signature = try P256.Signing.ECDSASignature(derRepresentation: der)
    return base64url(signature.rawRepresentation)
  }

  // MARK: - Biometry

  private enum Biometry {
    case available(Data)
    // Biometrics or the device passcode were removed.
    case notEnrolled
    case lockedOut
    case unavailable
  }

  private static func currentBiometry() -> Biometry {
    let context = LAContext()
    var error: NSError?
    // Domain state is only populated after canEvaluatePolicy succeeds.
    guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
      switch (error as? LAError)?.code {
      case .biometryNotEnrolled?, .passcodeNotSet?:
        return .notEnrolled
      case .biometryLockout?:
        return .lockedOut
      default:
        return .unavailable
      }
    }

    let state: Data?
    if #available(iOS 18.0, *) {
      state = context.domainState.biometry.stateHash
    } else {
      state = context.evaluatedPolicyDomainState
    }

    guard let state else {
      return .unavailable
    }
    return .available(state)
  }

  // MARK: - App Attest

  // App Attest can't sign arbitrary data, so it attests a key of its own and
  // the client data ties that attestation to the install key. The key is
  // attested once; IAS renews the client attestation without new evidence.
  // IAS keeps the App Attest key for assertions later, so its id is stored
  // next to the install key and lives and dies with it.
  private static func attestWithAppAttest(_ clientData: String, promise: Promise) {
    let appAttest = DCAppAttestService.shared
    guard appAttest.isSupported else {
      promise.reject(exception("ATTESTATION_UNSUPPORTED", "App Attest is not supported on this device"))
      return
    }

    appAttest.generateKey { keyId, error in
      guard let keyId else {
        promise.reject(appAttestException("ATTESTATION_KEY_FAILED", "Could not create the App Attest key", error))
        return
      }

      let clientDataHash = Data(SHA256.hash(data: Data(clientData.utf8)))
      appAttest.attestKey(keyId, clientDataHash: clientDataHash) { attestationObject, error in
        guard let attestationObject else {
          promise.reject(appAttestException("FAILED", "App Attest failed", error))
          return
        }
        guard storeItem(Data(keyId.utf8), account: appAttestKeyIdAccount) else {
          promise.reject(exception("FAILED", "Could not store the App Attest key id"))
          return
        }
        promise.resolve([
          "keyId": keyId,
          "attestationObject": attestationObject.base64EncodedString(),
        ])
      }
    }
  }

  // `code` is for other failures, so the step that failed can be told apart.
  private static func appAttestException(_ code: String, _ description: String, _ error: Error?) -> Exception {
    switch (error as? DCError)?.code {
    case .featureUnsupported?:
      return exception("ATTESTATION_UNSUPPORTED", "App Attest is not supported on this device")
    case .serverUnavailable?:
      return exception("ATTESTATION_UNAVAILABLE", "App Attest is unavailable, try again later")
    default:
      return exception(code, "\(description): \(error?.localizedDescription ?? "unknown error")")
    }
  }

  // MARK: - Keychain items

  private static func itemQuery(_ account: String) -> [String: Any] {
    return [
      kSecClass as String: kSecClassGenericPassword,
      kSecAttrService as String: service,
      kSecAttrAccount as String: account,
    ]
  }

  private static func storeItem(_ data: Data, account: String) -> Bool {
    deleteItem(account)
    var query = itemQuery(account)
    query[kSecValueData as String] = data
    query[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
    return SecItemAdd(query as CFDictionary, nil) == errSecSuccess
  }

  private static func readItem(_ account: String) -> Data? {
    var query = itemQuery(account)
    query[kSecReturnData as String] = true
    query[kSecMatchLimit as String] = kSecMatchLimitOne
    var result: AnyObject?
    guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess else {
      return nil
    }
    return result as? Data
  }

  private static func deleteItem(_ account: String) {
    SecItemDelete(itemQuery(account) as CFDictionary)
  }

  // MARK: - Helpers

  private static func base64url(_ data: Data) -> String {
    data.base64EncodedString()
      .replacingOccurrences(of: "+", with: "-")
      .replacingOccurrences(of: "/", with: "_")
      .replacingOccurrences(of: "=", with: "")
  }

  private static func exception(_ code: String, _ description: String) -> Exception {
    Exception(name: "DeviceKeyException", description: description, code: "ERR_DEVICE_KEY_\(code)")
  }

  private static func failure(_ description: String, _ error: Unmanaged<CFError>?) -> Exception {
    guard let error = error?.takeRetainedValue() else {
      return exception("FAILED", description)
    }
    return exception("FAILED", "\(description): \(error.localizedDescription)")
  }

  private static func exception(for error: Error?) -> Exception {
    switch (error as? LAError)?.code {
    case .userCancel?, .systemCancel?, .appCancel?, .userFallback?:
      return exception("CANCELLED", "Biometric prompt cancelled")
    case .biometryLockout?:
      return exception("LOCKOUT", "Biometrics are locked out")
    case .biometryNotEnrolled?, .biometryNotAvailable?, .passcodeNotSet?:
      return exception("BIOMETRICS_UNAVAILABLE", "Biometrics are not available")
    default:
      return exception("FAILED", error?.localizedDescription ?? "Biometric authentication failed")
    }
  }
}

enum DeviceKeyAlias: String, Enumerable {
  case install
  case biometric
}

struct GenerateKeyOptions: Record {
  // Android only.
  @Field var attestationChallenge: String?
}

struct BiometricPromptOptions: Record {
  @Field var title: String = ""
  // Android only.
  @Field var subtitle: String?
  @Field var cancel: String = ""
}
