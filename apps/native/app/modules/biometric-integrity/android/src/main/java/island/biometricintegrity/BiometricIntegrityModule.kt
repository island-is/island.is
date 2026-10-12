package island.biometricintegrity

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyPermanentlyInvalidatedException
import android.security.keystore.KeyProperties
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.security.KeyStore
import java.security.UnrecoverableKeyException
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey

// Detects when the set of enrolled biometrics changes after the user opted in.
// Android exposes no enrollment fingerprint, so a Keystore key that the system
// invalidates on biometric enrollment changes stands in for one:
// an invalidated key (KeyPermanentlyInvalidatedException, or
// UnrecoverableKeyException from getKey on some devices) means the enrolled
// biometrics changed. Other failures return "unknown".
class BiometricIntegrityModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("BiometricIntegrity")

    Function("enroll") {
      enroll()
    }

    // "missing" | "unchanged" | "changed" | "unknown"
    Function("check") {
      check()
    }

    Function("reset") {
      deleteKey()
    }
  }

  private fun keyStore(): KeyStore =
    KeyStore.getInstance(KEYSTORE).apply { load(null) }

  private fun enroll(): Boolean {
    return try {
      deleteKey()
      val spec = KeyGenParameterSpec.Builder(
        KEY_ALIAS,
        KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT,
      )
        .setBlockModes(KeyProperties.BLOCK_MODE_CBC)
        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_PKCS7)
        .setUserAuthenticationRequired(true)
        .setInvalidatedByBiometricEnrollment(true)
        .build()
      KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, KEYSTORE).run {
        init(spec)
        generateKey()
      }
      true
    } catch (e: Exception) {
      // Generation fails when no strong biometric is enrolled.
      false
    }
  }

  private fun check(): String {
    val key = try {
      keyStore().getKey(KEY_ALIAS, null) as? SecretKey
    } catch (e: KeyPermanentlyInvalidatedException) {
      return "changed"
    } catch (e: UnrecoverableKeyException) {
      // Some devices report an invalidated key here rather than on
      // Cipher.init. Treat it as a change: biometrics get turned off and the
      // user re-enables them, which is safer than keeping them on.
      return "changed"
    } catch (e: Exception) {
      return "unknown"
    } ?: return "missing"

    return try {
      Cipher.getInstance(TRANSFORMATION).init(Cipher.ENCRYPT_MODE, key)
      "unchanged"
    } catch (e: KeyPermanentlyInvalidatedException) {
      "changed"
    } catch (e: Exception) {
      "unknown"
    }
  }

  private fun deleteKey() {
    try {
      keyStore().deleteEntry(KEY_ALIAS)
    } catch (e: Exception) {
      // Nothing to delete.
    }
  }

  companion object {
    private const val KEYSTORE = "AndroidKeyStore"
    private const val KEY_ALIAS = "is.island.biometric-integrity"
    private const val TRANSFORMATION =
      "${KeyProperties.KEY_ALGORITHM_AES}/${KeyProperties.BLOCK_MODE_CBC}/${KeyProperties.ENCRYPTION_PADDING_PKCS7}"
  }
}
