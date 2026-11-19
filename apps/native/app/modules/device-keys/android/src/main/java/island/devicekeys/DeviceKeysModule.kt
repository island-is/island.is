package island.devicekeys

import android.os.Build
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyInfo
import android.security.keystore.KeyPermanentlyInvalidatedException
import android.security.keystore.KeyProperties
import android.util.Base64
import androidx.annotation.RequiresApi
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable
import java.math.BigInteger
import java.security.KeyFactory
import java.security.KeyPairGenerator
import java.security.KeyStore
import java.security.MessageDigest
import java.security.PrivateKey
import java.security.Signature
import java.security.UnrecoverableKeyException
import java.security.interfaces.ECPublicKey
import java.security.spec.ECGenParameterSpec

// Hardware-bound P-256 keys for device-bound auth, in StrongBox where the
// device has it and in the TEE-backed Keystore otherwise.
//
// The biometric key needs BIOMETRIC_STRONG for every signature and the system
// invalidates it when the enrolled biometrics change. Its prompt is shown here
// rather than through expo-local-authentication, because the signature has to
// be made with the prompt's CryptoObject.
class DeviceKeysModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("DeviceKeys")

    AsyncFunction("generateKey") { alias: DeviceKeyAlias, options: GenerateKeyOptions ->
      generateKey(alias, options.attestationChallenge)
    }

    Function("getKey") { alias: DeviceKeyAlias ->
      if (keyStore().containsAlias(alias.keystoreAlias)) describe(alias) else null
    }

    Function("deleteKey") { alias: DeviceKeyAlias ->
      deleteKey(alias)
    }

    AsyncFunction("signWithInstallKey") { data: String ->
      val key = loadPrivateKey(DeviceKeyAlias.INSTALL)
        ?: throw exception("NOT_FOUND", "No install key")
      val signature = Signature.getInstance(SIGNATURE_ALGORITHM).apply {
        initSign(key)
        update(data.toByteArray(Charsets.UTF_8))
      }
      base64url(derToRaw(signature.sign()))
    }

    // BiometricPrompt has to be created on the main thread.
    AsyncFunction("signWithBiometricKey") { data: String, options: BiometricPromptOptions, promise: Promise ->
      signWithBiometricKey(data, options, promise)
    }.runOnQueue(Queues.MAIN)

    // Leaf first, standard base64 DER (the JWS x5c form).
    Function("getAttestationChain") { alias: DeviceKeyAlias ->
      keyStore().getCertificateChain(alias.keystoreAlias)?.map {
        Base64.encodeToString(it.encoded, Base64.NO_WRAP)
      }
    }
  }

  private fun keyStore(): KeyStore =
    KeyStore.getInstance(KEYSTORE).apply { load(null) }

  private fun generateKey(alias: DeviceKeyAlias, attestationChallenge: String?): Map<String, Any> {
    if (alias == DeviceKeyAlias.BIOMETRIC) {
      val context = appContext.reactContext
        ?: throw exception("FAILED", "No React context")
      if (BiometricManager.from(context).canAuthenticate(BIOMETRIC_STRONG) != BiometricManager.BIOMETRIC_SUCCESS) {
        throw exception("BIOMETRICS_UNAVAILABLE", "No strong biometrics are enrolled")
      }
    }

    deleteKey(alias)

    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        generateKeyPairPreferringStrongBox(alias, attestationChallenge)
      } else {
        generateKeyPair(alias, attestationChallenge, strongBox = false)
      }
    } catch (e: Exception) {
      throw exception("FAILED", "Could not create the key", e)
    }

    return describe(alias)
  }

  // Falls back to the TEE on any StrongBox failure, not only
  // StrongBoxUnavailableException: some phones have StrongBox but fail to
  // create an attested key in it with a generic ProviderException. A TEE key
  // is accepted, and the attestation tells IAS which one it got.
  @RequiresApi(Build.VERSION_CODES.P)
  private fun generateKeyPairPreferringStrongBox(alias: DeviceKeyAlias, attestationChallenge: String?) {
    try {
      generateKeyPair(alias, attestationChallenge, strongBox = true)
    } catch (e: Exception) {
      generateKeyPair(alias, attestationChallenge, strongBox = false)
    }
  }

  private fun generateKeyPair(alias: DeviceKeyAlias, attestationChallenge: String?, strongBox: Boolean) {
    val builder = KeyGenParameterSpec.Builder(alias.keystoreAlias, KeyProperties.PURPOSE_SIGN)
      .setAlgorithmParameterSpec(ECGenParameterSpec("secp256r1"))
      .setDigests(KeyProperties.DIGEST_SHA256)

    if (alias == DeviceKeyAlias.BIOMETRIC) {
      builder
        .setUserAuthenticationRequired(true)
        .setInvalidatedByBiometricEnrollment(true)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        builder.setUserAuthenticationParameters(0, KeyProperties.AUTH_BIOMETRIC_STRONG)
      } else {
        // -1 means every use needs a biometric CryptoObject authentication.
        @Suppress("DEPRECATION")
        builder.setUserAuthenticationValidityDurationSeconds(-1)
      }
    }

    if (attestationChallenge != null) {
      builder.setAttestationChallenge(attestationChallenge.toByteArray(Charsets.UTF_8))
    }

    if (strongBox && Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      builder.setIsStrongBoxBacked(true)
    }

    KeyPairGenerator.getInstance(KeyProperties.KEY_ALGORITHM_EC, KEYSTORE).run {
      initialize(builder.build())
      generateKeyPair()
    }
  }

  private fun loadPrivateKey(alias: DeviceKeyAlias): PrivateKey? =
    keyStore().getKey(alias.keystoreAlias, null) as? PrivateKey

  private fun deleteKey(alias: DeviceKeyAlias) {
    try {
      keyStore().deleteEntry(alias.keystoreAlias)
    } catch (e: Exception) {
      // Nothing to delete.
    }
  }

  private fun describe(alias: DeviceKeyAlias): Map<String, Any> {
    val publicKey = keyStore().getCertificate(alias.keystoreAlias)?.publicKey as? ECPublicKey
      ?: throw exception("NOT_FOUND", "No ${alias.value} key")

    val x = base64url(toFixed32(publicKey.w.affineX))
    val y = base64url(toFixed32(publicKey.w.affineY))
    // RFC 7638: required members only, in lexicographic order, no whitespace.
    val canonical = """{"crv":"P-256","kty":"EC","x":"$x","y":"$y"}"""
    val thumbprint = base64url(
      MessageDigest.getInstance("SHA-256").digest(canonical.toByteArray(Charsets.UTF_8)),
    )

    return mapOf(
      "publicJwk" to mapOf("kty" to "EC", "crv" to "P-256", "x" to x, "y" to y),
      "thumbprint" to thumbprint,
      "securityLevel" to securityLevel(alias),
    )
  }

  private fun securityLevel(alias: DeviceKeyAlias): String {
    val key = try {
      loadPrivateKey(alias)
    } catch (e: UnrecoverableKeyException) {
      // Some devices report an invalidated biometric key here.
      throw exception("INVALIDATED", "The enrolled biometrics changed", e)
    } ?: throw exception("NOT_FOUND", "No ${alias.value} key")

    val info = KeyFactory.getInstance(key.algorithm, KEYSTORE).getKeySpec(key, KeyInfo::class.java)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      return when (info.securityLevel) {
        KeyProperties.SECURITY_LEVEL_STRONGBOX -> "strongBox"
        KeyProperties.SECURITY_LEVEL_TRUSTED_ENVIRONMENT,
        KeyProperties.SECURITY_LEVEL_UNKNOWN_SECURE -> "trustedEnvironment"
        else -> "software"
      }
    }
    // Before Android 12 StrongBox and the TEE can't be told apart here.
    @Suppress("DEPRECATION")
    return if (info.isInsideSecureHardware) "trustedEnvironment" else "software"
  }

  private fun signWithBiometricKey(data: String, options: BiometricPromptOptions, promise: Promise) {
    val activity = appContext.currentActivity as? FragmentActivity
      ?: return promise.reject(exception("FAILED", "No activity to show the biometric prompt in"))

    // An invalidated key fails here, before the prompt is shown.
    val signature = try {
      val key = loadPrivateKey(DeviceKeyAlias.BIOMETRIC)
        ?: return promise.reject(exception("NOT_FOUND", "No biometric key"))
      Signature.getInstance(SIGNATURE_ALGORITHM).apply { initSign(key) }
    } catch (e: KeyPermanentlyInvalidatedException) {
      return promise.reject(exception("INVALIDATED", "The enrolled biometrics changed", e))
    } catch (e: UnrecoverableKeyException) {
      return promise.reject(exception("INVALIDATED", "The enrolled biometrics changed", e))
    } catch (e: Exception) {
      return promise.reject(exception("FAILED", "Could not prepare the signature", e))
    }

    val callback = object : BiometricPrompt.AuthenticationCallback() {
      override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
        try {
          val authorized = result.cryptoObject?.signature
            ?: throw IllegalStateException("The prompt returned no signature")
          authorized.update(data.toByteArray(Charsets.UTF_8))
          promise.resolve(base64url(derToRaw(authorized.sign())))
        } catch (e: Exception) {
          promise.reject(exception("FAILED", "Could not sign", e))
        }
      }

      override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
        promise.reject(exception(promptErrorCode(errorCode), errString.toString()))
      }

      // onAuthenticationFailed is a single non-matching attempt; the prompt
      // stays open, so there is nothing to settle yet.
    }

    val promptInfo = BiometricPrompt.PromptInfo.Builder()
      .setTitle(options.title)
      .setSubtitle(options.subtitle)
      .setNegativeButtonText(options.cancel)
      .setAllowedAuthenticators(BIOMETRIC_STRONG)
      .setConfirmationRequired(false)
      .build()

    BiometricPrompt(activity, ContextCompat.getMainExecutor(activity), callback)
      .authenticate(promptInfo, BiometricPrompt.CryptoObject(signature))
  }

  private fun promptErrorCode(errorCode: Int): String = when (errorCode) {
    BiometricPrompt.ERROR_USER_CANCELED,
    BiometricPrompt.ERROR_NEGATIVE_BUTTON,
    BiometricPrompt.ERROR_CANCELED,
    BiometricPrompt.ERROR_TIMEOUT -> "CANCELLED"
    BiometricPrompt.ERROR_LOCKOUT,
    BiometricPrompt.ERROR_LOCKOUT_PERMANENT -> "LOCKOUT"
    BiometricPrompt.ERROR_NO_BIOMETRICS,
    BiometricPrompt.ERROR_HW_NOT_PRESENT,
    BiometricPrompt.ERROR_HW_UNAVAILABLE,
    BiometricPrompt.ERROR_SECURITY_UPDATE_REQUIRED -> "BIOMETRICS_UNAVAILABLE"
    else -> "FAILED"
  }

  private fun exception(code: String, message: String, cause: Throwable? = null) =
    CodedException("ERR_DEVICE_KEY_$code", message, cause)

  private fun base64url(bytes: ByteArray): String =
    Base64.encodeToString(bytes, Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING)

  // The Keystore returns ECDSA signatures as DER SEQUENCE { INTEGER r,
  // INTEGER s }. JWS (ES256) needs r and s as fixed 32-byte big-endian values.
  private fun derToRaw(der: ByteArray): ByteArray {
    var pos = 0

    fun readLength(): Int {
      val first = der[pos++].toInt() and 0xff
      if (first < 0x80) {
        return first
      }
      var length = 0
      repeat(first and 0x7f) {
        length = (length shl 8) or (der[pos++].toInt() and 0xff)
      }
      return length
    }

    fun readInteger(): BigInteger {
      check(der[pos++] == DER_INTEGER) { "Expected a DER INTEGER" }
      val length = readLength()
      val value = BigInteger(1, der.copyOfRange(pos, pos + length))
      pos += length
      return value
    }

    check(der[pos++] == DER_SEQUENCE) { "Expected a DER SEQUENCE" }
    readLength()
    return toFixed32(readInteger()) + toFixed32(readInteger())
  }

  // BigInteger.toByteArray adds a sign byte when the top bit is set and drops
  // leading zeros, so pad or trim to exactly 32 bytes.
  private fun toFixed32(value: BigInteger): ByteArray {
    val bytes = value.toByteArray()
    return when {
      bytes.size == 32 -> bytes
      bytes.size > 32 -> bytes.copyOfRange(bytes.size - 32, bytes.size)
      else -> ByteArray(32 - bytes.size) + bytes
    }
  }

  companion object {
    private const val KEYSTORE = "AndroidKeyStore"
    private const val SIGNATURE_ALGORITHM = "SHA256withECDSA"
    private const val DER_SEQUENCE: Byte = 0x30
    private const val DER_INTEGER: Byte = 0x02
  }
}

enum class DeviceKeyAlias(val value: String) : Enumerable {
  INSTALL("install"),
  BIOMETRIC("biometric");

  val keystoreAlias: String
    get() = "is.island.device-keys.$value"
}

class GenerateKeyOptions : Record {
  @Field
  val attestationChallenge: String? = null
}

class BiometricPromptOptions : Record {
  @Field
  val title: String = ""

  @Field
  val subtitle: String? = null

  @Field
  val cancel: String = ""
}
