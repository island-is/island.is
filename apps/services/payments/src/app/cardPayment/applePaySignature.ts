import crypto from 'crypto'
import forge from 'node-forge'

import { APPLE_ROOT_CA_G3_PEM } from './applePayRootCa'

/**
 * Apple Pay PassKit EC_v1 detached-signature verifier.
 *
 * Verifies the PKCS#7/CMS SignedData blob carried in `paymentData.signature`
 * per Apple's PassKit Payment Token Format Reference:
 * https://developer.apple.com/documentation/passkit/payment-token-format-reference
 *
 * All of the following must hold for a token to be accepted:
 *   1. The signature parses as CMS SignedData with exactly 2 embedded certs
 *      and 1 SignerInfo.
 *   2. The two certs can be identified as the Apple Pay leaf + intermediate
 *      via Apple's marker OID extensions (see constants below).
 *   3. The chain terminates at the bundled Apple Root CA G3 trust anchor and
 *      every cert is currently within its validity window.
 *   4. The CMS signature verifies under the leaf's public key over the
 *      DER-encoded SignedAttributes SET (NOT the [0] IMPLICIT form on the
 *      wire — see RFC 5652 §5.4).
 *   5. signedAttrs.messageDigest equals SHA-256 of
 *      `ephemeralPublicKey || data || transactionId || applicationData?`
 *      (Apple's signed-bytes recipe; raw bytes after base64/hex decode).
 *   6. signedAttrs.signingTime is within ±5 minutes of `now`.
 *   7. header.publicKeyHash equals SHA-256 of our payment-processing public
 *      key SPKI — proves the token was encrypted to OUR keypair.
 *
 * Library split: node-forge handles ASN.1/CMS parsing; Node's native
 * `crypto.X509Certificate` + `crypto.verify` handles the actual signature
 * math (forge's ECDSA support is weak and Apple uses ECDSA P-256).
 */

// Apple-specific X.509 certificate-extension marker OIDs assigned under the
// Apple PEN (1.2.840.113635). Apple stamps these on the certs in the Apple
// Pay signing chain so verifiers can identify which cert plays which role.
// Sourced from Apple's PassKit Payment Token Format Reference, "Signature".
// They are NOT generic — only Apple Pay processing certs carry them.
const APPLE_PAY_LEAF_OID = '1.2.840.113635.100.6.29'
const APPLE_PAY_INTERMEDIATE_OID = '1.2.840.113635.100.6.2.14'

// CMS / PKCS#9 standard OIDs used inside SignerInfo.signedAttrs. Defined in
// RFC 5652 (CMS, §11) and RFC 2985 (PKCS#9). The arc 1.2.840.113549.1.9 is
// the PKCS#9 attribute branch; 1.2.840.113549.1.7 is PKCS#7 content types.
// Hardcoded here for readability at the call sites; node-forge also exposes
// these as forge.pki.oids.{contentType,messageDigest,signingTime,data}.
const CONTENT_TYPE_OID = '1.2.840.113549.1.9.3'
const MESSAGE_DIGEST_OID = '1.2.840.113549.1.9.4'
const SIGNING_TIME_OID = '1.2.840.113549.1.9.5'
const ID_DATA_OID = '1.2.840.113549.1.7.1'

// Apple's spec recommends a 5-minute tolerance on the signingTime attribute:
// wide enough to absorb device/server clock skew, tight enough that replay
// of an old captured token is impractical.
const DEFAULT_SIGNING_TIME_TOLERANCE_MS = 5 * 60 * 1000

export interface ApplePayPaymentDataForVerify {
  version: string
  data: string
  signature: string
  header: {
    ephemeralPublicKey: string
    publicKeyHash: string
    transactionId: string
    applicationData?: string
  }
}

export interface ApplePayVerifyTraceEvent {
  stage: string
  data: Record<string, unknown>
}

const verifyError = (stage: string, message: string): Error =>
  new Error(`Apple Pay verify [stage=${stage}] ${message}`)

const certHasOid = (cert: forge.pki.Certificate, oid: string): boolean => {
  const exts = (cert as unknown as { extensions: Array<{ id: string }> })
    .extensions
  return Array.isArray(exts) && exts.some((e) => e.id === oid)
}

const forgeCertToDer = (cert: forge.pki.Certificate): Buffer =>
  Buffer.from(
    forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes(),
    'binary',
  )

const parseSigningTime = (asn1Node: forge.asn1.Asn1): number => {
  const value = asn1Node.value as string
  if (asn1Node.type === forge.asn1.Type.UTCTIME) {
    return forge.asn1.utcTimeToDate(value).getTime()
  }
  if (asn1Node.type === forge.asn1.Type.GENERALIZEDTIME) {
    return forge.asn1.generalizedTimeToDate(value).getTime()
  }
  throw new Error(`unsupported signingTime ASN.1 type ${asn1Node.type}`)
}

export const verifyApplePaySignature = ({
  paymentData,
  paymentProcessingKey,
  signingTimeToleranceMs = DEFAULT_SIGNING_TIME_TOLERANCE_MS,
  trustedRootPem = APPLE_ROOT_CA_G3_PEM,
  now = Date.now(),
  onTrace,
}: {
  paymentData: ApplePayPaymentDataForVerify
  paymentProcessingKey: string
  signingTimeToleranceMs?: number
  trustedRootPem?: string
  now?: number
  onTrace?: (event: ApplePayVerifyTraceEvent) => void
}): void => {
  const trace = (stage: string, data: Record<string, unknown>): void => {
    if (onTrace) {
      try {
        onTrace({ stage, data })
      } catch {
        // never let logging break verification
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 1: decode signature and parse the CMS SignedData envelope.
  // The wire format is base64(DER(ContentInfo{ SignedData })). Apple uses
  // a *detached* signature — the signed content (the bytes whose digest
  // appears in signedAttrs.messageDigest) is NOT inside the envelope; we
  // reconstruct it locally in step 5.
  // ──────────────────────────────────────────────────────────────────
  const signatureBytes = Buffer.from(paymentData.signature, 'base64')
  trace('decode-signature', { signatureBytesLen: signatureBytes.length })
  if (signatureBytes.length === 0) {
    throw verifyError('decode-signature', 'signature is empty')
  }

  let asn1Root: forge.asn1.Asn1
  try {
    asn1Root = forge.asn1.fromDer(
      forge.util.createBuffer(signatureBytes.toString('binary')),
    )
  } catch (e) {
    throw verifyError('parse-asn1', (e as Error).message)
  }
  trace('parse-asn1', {})

  let pkcs7Msg: {
    type: string
    certificates: forge.pki.Certificate[]
    rawCapture: { signerInfos?: forge.asn1.Asn1[] }
  }
  try {
    pkcs7Msg = forge.pkcs7.messageFromAsn1(
      asn1Root,
    ) as unknown as typeof pkcs7Msg
  } catch (e) {
    throw verifyError('parse-signed-data', (e as Error).message)
  }
  if (pkcs7Msg.type !== forge.pki.oids.signedData) {
    throw verifyError(
      'parse-signed-data',
      `expected SignedData, got OID ${pkcs7Msg.type}`,
    )
  }
  const signerInfoCount = pkcs7Msg.rawCapture?.signerInfos?.length ?? 0
  trace('parse-signed-data', {
    type: pkcs7Msg.type,
    certCount: pkcs7Msg.certificates?.length ?? 0,
    signerInfoCount,
  })

  // Apple Pay tokens always embed exactly the leaf and intermediate. A root
  // is NEVER embedded (we provide our own pinned trust anchor in step 3).
  // Anything else is malformed — fail closed.
  const certs = pkcs7Msg.certificates
  if (!Array.isArray(certs) || certs.length !== 2) {
    throw verifyError(
      'cert-count',
      `expected 2 embedded certs, got ${certs?.length ?? 0}`,
    )
  }

  const certSubjectCn = (cert: forge.pki.Certificate): string => {
    const cn = cert.subject.attributes.find(
      (a: { shortName?: string }) => a.shortName === 'CN',
    ) as { value?: string } | undefined
    return cn?.value ?? '<unknown>'
  }
  trace('cert-list', {
    certs: certs.map((c) => ({
      subject: certSubjectCn(c),
      hasLeafOid: certHasOid(c, APPLE_PAY_LEAF_OID),
      hasIntermediateOid: certHasOid(c, APPLE_PAY_INTERMEDIATE_OID),
    })),
  })

  // ──────────────────────────────────────────────────────────────────
  // Step 2: identify which embedded cert is the leaf vs the intermediate.
  // We do NOT rely on order in the SignedData (the spec doesn't guarantee
  // it). Instead we look for Apple's marker OID extensions: the leaf
  // carries 1.2.840.113635.100.6.29 and the intermediate carries
  // 1.2.840.113635.100.6.2.14. A cert that carries both, or that carries
  // neither, indicates a forged or unrelated CMS payload — fail closed.
  // ──────────────────────────────────────────────────────────────────
  let leafForge: forge.pki.Certificate | undefined
  let intermediateForge: forge.pki.Certificate | undefined
  for (const cert of certs) {
    const isLeaf = certHasOid(cert, APPLE_PAY_LEAF_OID)
    const isIntermediate = certHasOid(cert, APPLE_PAY_INTERMEDIATE_OID)
    if (isLeaf && isIntermediate) {
      throw verifyError('cert-oid', 'cert has both leaf and intermediate OIDs')
    }
    if (isLeaf) {
      if (leafForge) {
        throw verifyError('leaf-oid', 'multiple leaf candidates')
      }
      leafForge = cert
    } else if (isIntermediate) {
      if (intermediateForge) {
        throw verifyError(
          'intermediate-oid',
          'multiple intermediate candidates',
        )
      }
      intermediateForge = cert
    }
  }
  if (!leafForge) {
    throw verifyError('leaf-oid', `no cert carries OID ${APPLE_PAY_LEAF_OID}`)
  }
  if (!intermediateForge) {
    throw verifyError(
      'intermediate-oid',
      `no cert carries OID ${APPLE_PAY_INTERMEDIATE_OID}`,
    )
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 3: chain validation against the bundled Apple Root CA G3.
  // We deliberately switch from forge to Node's native X509Certificate
  // here because forge's cert-chain verification has weak ECDSA support,
  // and Apple's PKI uses ECDSA P-256 throughout. Re-encoding via DER and
  // re-loading natively is the cleanest hand-off.
  // ──────────────────────────────────────────────────────────────────
  let leaf: crypto.X509Certificate
  let intermediate: crypto.X509Certificate
  let root: crypto.X509Certificate
  try {
    leaf = new crypto.X509Certificate(forgeCertToDer(leafForge))
    intermediate = new crypto.X509Certificate(forgeCertToDer(intermediateForge))
    root = new crypto.X509Certificate(trustedRootPem)
  } catch (e) {
    throw verifyError('cert-load', (e as Error).message)
  }
  trace('cert-load', {
    leafSubject: leaf.subject,
    leafIssuer: leaf.issuer,
    leafValidFrom: leaf.validFrom,
    leafValidTo: leaf.validTo,
    intermediateSubject: intermediate.subject,
    intermediateValidTo: intermediate.validTo,
    rootSubject: root.subject,
  })

  // Reject expired or not-yet-valid certs at every level. We check root too
  // because if Apple ever rotates G3 we want a clear "anchor expired" error
  // rather than an opaque chain failure later.
  const nowDate = new Date(now)
  for (const [name, cert] of [
    ['leaf', leaf],
    ['intermediate', intermediate],
    ['root', root],
  ] as const) {
    const validFrom = new Date(cert.validFrom)
    const validTo = new Date(cert.validTo)
    if (nowDate < validFrom || nowDate > validTo) {
      throw verifyError(
        'cert-validity',
        `${name} cert outside validity window (now=${nowDate.toISOString()}, validFrom=${validFrom.toISOString()}, validTo=${validTo.toISOString()})`,
      )
    }
  }

  // Walk leaf → intermediate → trusted root. checkIssued() compares Issuer
  // DNs and AKI/SKI; verify(publicKey) checks the actual signature. Both
  // must hold at each link or the chain is broken.
  const leafIssuedByIntermediate = leaf.checkIssued(intermediate)
  const leafSigOk =
    leafIssuedByIntermediate && leaf.verify(intermediate.publicKey)
  trace('chain.leaf', { leafIssuedByIntermediate, leafSigOk })
  if (!leafSigOk) {
    throw verifyError(
      'chain',
      `leaf is not signed by the embedded intermediate (issuedCheck=${leafIssuedByIntermediate})`,
    )
  }
  const intIssuedByRoot = intermediate.checkIssued(root)
  const intSigOk = intIssuedByRoot && intermediate.verify(root.publicKey)
  trace('chain.intermediate', { intIssuedByRoot, intSigOk })
  if (!intSigOk) {
    throw verifyError(
      'chain',
      `intermediate is not signed by the trusted root (issuedCheck=${intIssuedByRoot})`,
    )
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 4: extract the SignerInfo fields by walking the parsed ASN.1.
  // node-forge's pkcs7 module parses SignedData but doesn't expose a
  // friendly per-signer API on read (only on write), so we walk the SET
  // ourselves. SignerInfo per RFC 5652 §5.3:
  //   SEQUENCE {
  //     version, sid, digestAlgorithm,
  //     signedAttrs       [0] IMPLICIT SET OF Attribute OPTIONAL,
  //     signatureAlgorithm,
  //     signature,
  //     unsignedAttrs     [1] IMPLICIT SET OF Attribute OPTIONAL
  //   }
  // Apple Pay always includes signedAttrs, omits unsignedAttrs, uses
  // issuerAndSerialNumber for the SignerIdentifier, and uses SHA-256.
  // ──────────────────────────────────────────────────────────────────
  const signerInfos = pkcs7Msg.rawCapture.signerInfos
  if (!Array.isArray(signerInfos) || signerInfos.length !== 1) {
    throw verifyError(
      'signer-info',
      `expected 1 signerInfo, got ${signerInfos?.length ?? 0}`,
    )
  }
  const signerInfoAsn1 = signerInfos[0]
  if (!signerInfoAsn1.constructed) {
    throw verifyError('signer-info', 'signerInfo is not constructed')
  }
  const signerFields = signerInfoAsn1.value as forge.asn1.Asn1[]

  let pos = 0
  // version
  pos++
  // SignerIdentifier (issuerAndSerialNumber SEQUENCE for Apple Pay)
  pos++
  const digestAlgAsn1 = signerFields[pos++]
  if (
    !digestAlgAsn1?.constructed ||
    !Array.isArray(digestAlgAsn1.value) ||
    digestAlgAsn1.value.length === 0
  ) {
    throw verifyError('signer-info', 'malformed digestAlgorithm')
  }
  const digestAlgOid = forge.asn1.derToOid(
    (digestAlgAsn1.value[0] as forge.asn1.Asn1).value as string,
  )
  if (digestAlgOid !== forge.pki.oids.sha256) {
    throw verifyError(
      'digest-algo',
      `unsupported digest OID ${digestAlgOid} (only SHA-256 accepted)`,
    )
  }

  const signedAttrsAsn1 = signerFields[pos]
  if (
    !signedAttrsAsn1 ||
    signedAttrsAsn1.tagClass !== forge.asn1.Class.CONTEXT_SPECIFIC ||
    signedAttrsAsn1.type !== 0
  ) {
    throw verifyError(
      'signed-attrs',
      'signedAttrs SET is required for Apple Pay',
    )
  }
  pos++

  const sigAlgAsn1 = signerFields[pos++]
  if (
    !sigAlgAsn1?.constructed ||
    !Array.isArray(sigAlgAsn1.value) ||
    sigAlgAsn1.value.length === 0
  ) {
    throw verifyError('signer-info', 'malformed signatureAlgorithm')
  }
  const sigAlgOid = forge.asn1.derToOid(
    (sigAlgAsn1.value[0] as forge.asn1.Asn1).value as string,
  )

  const signatureAsn1 = signerFields[pos++]
  if (!signatureAsn1 || signatureAsn1.type !== forge.asn1.Type.OCTETSTRING) {
    throw verifyError('signer-info', 'malformed signature octet string')
  }
  const signatureRaw = Buffer.from(signatureAsn1.value as string, 'binary')
  trace('signer-info', {
    digestAlgOid,
    sigAlgOid,
    signatureLen: signatureRaw.length,
    leafKeyType: leaf.publicKey.asymmetricKeyType,
  })

  // ──────────────────────────────────────────────────────────────────
  // Step 5: verify the CMS signature.
  //
  // Subtle but important: per RFC 5652 §5.4, the signature is computed
  // over the DER encoding of signedAttrs encoded as a SET (universal tag
  // 0x31), NOT the [0] IMPLICIT context-specific encoding (0xA0) that
  // appears on the wire. Same value bytes, different outer tag. We
  // rebuild the same children under a SET tag and re-encode.
  //
  // crypto.verify dispatches algorithm based on the leaf's public key
  // type, so this works for both ECDSA and RSA leaves; Apple uses
  // ECDSA P-256 in production.
  // ──────────────────────────────────────────────────────────────────
  const signedAttrsAsSet = forge.asn1.create(
    forge.asn1.Class.UNIVERSAL,
    forge.asn1.Type.SET,
    true,
    signedAttrsAsn1.value as forge.asn1.Asn1[],
  )
  const signedAttrsDer = Buffer.from(
    forge.asn1.toDer(signedAttrsAsSet).getBytes(),
    'binary',
  )
  trace('signed-attrs.encoded', { signedAttrsDerLen: signedAttrsDer.length })

  let signatureOk: boolean
  try {
    signatureOk = crypto.verify(
      'sha256',
      signedAttrsDer,
      leaf.publicKey,
      signatureRaw,
    )
  } catch (e) {
    throw verifyError('signature-verify', (e as Error).message)
  }
  trace('signature-verify', { signatureOk })
  if (!signatureOk) {
    throw verifyError('signature-verify', 'CMS signature did not verify')
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 6: parse the signed attributes into a map for the value checks.
  // The CMS signature only proves these attributes were not tampered with;
  // we still have to inspect their values to make sure they describe the
  // payload we actually received (steps 7-9).
  // ──────────────────────────────────────────────────────────────────
  const attrByOid = new Map<string, forge.asn1.Asn1>()
  for (const attrSeq of signedAttrsAsn1.value as forge.asn1.Asn1[]) {
    if (
      !attrSeq.constructed ||
      attrSeq.type !== forge.asn1.Type.SEQUENCE ||
      !Array.isArray(attrSeq.value) ||
      attrSeq.value.length < 2
    ) {
      throw verifyError('signed-attrs', 'malformed attribute SEQUENCE')
    }
    const oidNode = attrSeq.value[0] as forge.asn1.Asn1
    const valuesNode = attrSeq.value[1] as forge.asn1.Asn1
    if (
      oidNode.type !== forge.asn1.Type.OID ||
      valuesNode.type !== forge.asn1.Type.SET ||
      !Array.isArray(valuesNode.value) ||
      valuesNode.value.length === 0
    ) {
      throw verifyError('signed-attrs', 'malformed attribute structure')
    }
    const oid = forge.asn1.derToOid(oidNode.value as string)
    attrByOid.set(oid, valuesNode.value[0] as forge.asn1.Asn1)
  }
  trace('signed-attrs.parsed', { attributeOids: Array.from(attrByOid.keys()) })

  // contentType MUST be id-data per Apple's spec — anything else means
  // the signature was for a different kind of payload entirely.
  const contentTypeAttr = attrByOid.get(CONTENT_TYPE_OID)
  if (!contentTypeAttr || contentTypeAttr.type !== forge.asn1.Type.OID) {
    throw verifyError('content-type', 'missing or malformed contentType')
  }
  const contentTypeOid = forge.asn1.derToOid(contentTypeAttr.value as string)
  trace('content-type', { contentTypeOid })
  if (contentTypeOid !== ID_DATA_OID) {
    throw verifyError(
      'content-type',
      `unexpected contentType ${contentTypeOid}`,
    )
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 7: verify signedAttrs.messageDigest binds the signature to the
  // payment payload we actually received.
  //
  // The signature in step 5 only proved signedAttrs is authentic. This
  // step proves signedAttrs describes THIS token. Per Apple's spec the
  // signed bytes are the concatenation:
  //
  //   ephemeralPublicKey || data || transactionId || applicationData?
  //
  // — taken in the *raw decoded* form (base64-decoded for ephemeral/
  // data/applicationData; hex-decoded for transactionId). applicationData
  // is optional and absent for almost all merchants; when it's not set
  // we feed in zero bytes (Apple omits it from the concat in that case,
  // which is equivalent).
  //
  // We use timingSafeEqual to compare the digests so an attacker can't
  // mount a timing side-channel attack, even though that's largely
  // theoretical for a non-secret value.
  // ──────────────────────────────────────────────────────────────────
  const messageDigestAttr = attrByOid.get(MESSAGE_DIGEST_OID)
  if (
    !messageDigestAttr ||
    messageDigestAttr.type !== forge.asn1.Type.OCTETSTRING
  ) {
    throw verifyError('message-digest', 'missing or malformed messageDigest')
  }
  const claimedDigest = Buffer.from(
    messageDigestAttr.value as string,
    'binary',
  )

  if (!/^[0-9a-fA-F]*$/.test(paymentData.header.transactionId)) {
    throw verifyError('transaction-id', 'transactionId is not hex')
  }
  const ephemeralPublicKey = Buffer.from(
    paymentData.header.ephemeralPublicKey,
    'base64',
  )
  const dataBytes = Buffer.from(paymentData.data, 'base64')
  const transactionId = Buffer.from(paymentData.header.transactionId, 'hex')
  const applicationData = paymentData.header.applicationData
    ? Buffer.from(paymentData.header.applicationData, 'base64')
    : Buffer.alloc(0)

  const computedDigest = crypto
    .createHash('sha256')
    .update(ephemeralPublicKey)
    .update(dataBytes)
    .update(transactionId)
    .update(applicationData)
    .digest()

  const digestMatch =
    claimedDigest.length === computedDigest.length &&
    crypto.timingSafeEqual(claimedDigest, computedDigest)
  trace('message-digest', {
    claimedDigestLen: claimedDigest.length,
    computedDigestLen: computedDigest.length,
    ephemeralPublicKeyLen: ephemeralPublicKey.length,
    dataLen: dataBytes.length,
    transactionIdLen: transactionId.length,
    applicationDataLen: applicationData.length,
    hasApplicationData: !!paymentData.header.applicationData,
    match: digestMatch,
  })
  if (!digestMatch) {
    throw verifyError(
      'message-digest',
      'computed digest does not match signedAttrs.messageDigest',
    )
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 8: signingTime freshness check.
  //
  // The signingTime attribute is a timestamp the device put inside
  // signedAttrs (so it's covered by the signature in step 5). Bounding
  // it relative to `now` prevents an attacker from replaying an old but
  // otherwise valid token weeks/months later.
  //
  // The replay cache in cardPayment.service.ts handles the more
  // immediate "same request twice" case — this is the longer-horizon
  // backstop. Apple's recommended tolerance is 5 minutes.
  // ──────────────────────────────────────────────────────────────────
  const signingTimeAttr = attrByOid.get(SIGNING_TIME_OID)
  if (!signingTimeAttr) {
    throw verifyError('signing-time', 'missing signingTime attribute')
  }
  let signingTimeMs: number
  try {
    signingTimeMs = parseSigningTime(signingTimeAttr)
  } catch (e) {
    throw verifyError('signing-time', (e as Error).message)
  }
  const skewMs = Math.abs(now - signingTimeMs)
  trace('signing-time', {
    signingTimeIso: new Date(signingTimeMs).toISOString(),
    nowIso: new Date(now).toISOString(),
    skewMs,
    toleranceMs: signingTimeToleranceMs,
  })
  if (skewMs > signingTimeToleranceMs) {
    throw verifyError(
      'signing-time',
      `${skewMs}ms outside ${signingTimeToleranceMs}ms tolerance`,
    )
  }

  // ──────────────────────────────────────────────────────────────────
  // Step 9: prove this token was encrypted to OUR keypair.
  //
  // Apple includes header.publicKeyHash = SHA-256(merchant payment
  // processing public key SPKI). We derive the matching SPKI by loading
  // OUR private key (createPublicKey accepts a PrivateKey PEM and returns
  // the corresponding public key) and hashing it the same way. A match
  // means the device encrypted the payment data toward our specific key,
  // not someone else's — which both ties the token to us and confirms
  // we can actually decrypt it in step 10 of the charge flow.
  // ──────────────────────────────────────────────────────────────────
  let merchantSpkiDer: Buffer
  try {
    merchantSpkiDer = crypto
      .createPublicKey(paymentProcessingKey)
      .export({ format: 'der', type: 'spki' }) as Buffer
  } catch (e) {
    throw verifyError(
      'public-key-hash',
      `cannot derive merchant SPKI from processing key: ${
        (e as Error).message
      }`,
    )
  }
  const computedHash = crypto
    .createHash('sha256')
    .update(merchantSpkiDer)
    .digest()
  const claimedHash = Buffer.from(paymentData.header.publicKeyHash, 'base64')
  const hashMatch =
    claimedHash.length === computedHash.length &&
    crypto.timingSafeEqual(claimedHash, computedHash)
  trace('public-key-hash', {
    claimedHashLen: claimedHash.length,
    computedHashLen: computedHash.length,
    merchantSpkiLen: merchantSpkiDer.length,
    match: hashMatch,
  })
  if (!hashMatch) {
    throw verifyError(
      'public-key-hash',
      'header.publicKeyHash does not match SHA-256 of merchant SPKI',
    )
  }
}
