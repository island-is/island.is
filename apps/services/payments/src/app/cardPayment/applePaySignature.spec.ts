import crypto from 'crypto'
import forge from 'node-forge'

import {
  ApplePayPaymentDataForVerify,
  verifyApplePaySignature,
} from './applePaySignature'

const APPLE_PAY_LEAF_OID = '1.2.840.113635.100.6.29'
const APPLE_PAY_INTERMEDIATE_OID = '1.2.840.113635.100.6.2.14'

interface KeyPairPem {
  publicKeyPem: string
  privateKeyPem: string
}

const generateRsaKeyPairPem = (bits = 2048): KeyPairPem => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: bits,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  })
  return { publicKeyPem: publicKey, privateKeyPem: privateKey }
}

const buildExtNullValue = (): string =>
  forge.asn1
    .toDer(
      forge.asn1.create(
        forge.asn1.Class.UNIVERSAL,
        forge.asn1.Type.NULL,
        false,
        '',
      ),
    )
    .getBytes()

const createCert = ({
  subjectCN,
  issuerCert,
  issuerPrivateKeyPem,
  subjectPublicKeyPem,
  subjectPrivateKeyPem,
  isCa,
  customExtensionOid,
  notBefore,
  notAfter,
}: {
  subjectCN: string
  issuerCert?: forge.pki.Certificate
  issuerPrivateKeyPem: string
  subjectPublicKeyPem: string
  subjectPrivateKeyPem: string
  isCa: boolean
  customExtensionOid?: string
  notBefore?: Date
  notAfter?: Date
}): forge.pki.Certificate => {
  const cert = forge.pki.createCertificate()
  cert.publicKey = forge.pki.publicKeyFromPem(subjectPublicKeyPem)
  cert.serialNumber = crypto.randomBytes(8).toString('hex')
  cert.validity.notBefore = notBefore ?? new Date(Date.now() - 60_000)
  cert.validity.notAfter =
    notAfter ?? new Date(Date.now() + 365 * 24 * 60 * 60_000)
  const subjectAttrs = [{ shortName: 'CN', value: subjectCN }]
  cert.setSubject(subjectAttrs)
  cert.setIssuer(issuerCert ? issuerCert.subject.attributes : subjectAttrs)
  const extensions: Array<{
    name?: string
    id?: string
    critical?: boolean
    cA?: boolean
    keyCertSign?: boolean
    digitalSignature?: boolean
    value?: string
  }> = [{ name: 'basicConstraints', cA: isCa, critical: true }]
  if (isCa) {
    extensions.push({ name: 'keyUsage', keyCertSign: true, critical: true })
  } else {
    extensions.push({
      name: 'keyUsage',
      digitalSignature: true,
      critical: true,
    })
  }
  if (customExtensionOid) {
    extensions.push({
      id: customExtensionOid,
      critical: false,
      value: buildExtNullValue(),
    })
  }
  cert.setExtensions(extensions as forge.pki.CertificateExtension[])
  cert.sign(
    forge.pki.privateKeyFromPem(issuerPrivateKeyPem),
    forge.md.sha256.create(),
  )
  // suppress unused warning
  void subjectPrivateKeyPem
  return cert
}

interface ChainFixtures {
  rootPem: string
  intermediateCert: forge.pki.Certificate
  intermediateKeyPem: string
  leafCert: forge.pki.Certificate
  leafKeyPem: string
}

const buildChain = (overrides?: {
  leafExtensionOid?: string | null
  intermediateExtensionOid?: string | null
}): ChainFixtures => {
  const root = generateRsaKeyPairPem()
  const intermediate = generateRsaKeyPairPem()
  const leaf = generateRsaKeyPairPem()

  const rootCert = createCert({
    subjectCN: 'Test Root CA',
    issuerPrivateKeyPem: root.privateKeyPem,
    subjectPublicKeyPem: root.publicKeyPem,
    subjectPrivateKeyPem: root.privateKeyPem,
    isCa: true,
  })
  const intermediateCert = createCert({
    subjectCN: 'Test Apple Pay Intermediate',
    issuerCert: rootCert,
    issuerPrivateKeyPem: root.privateKeyPem,
    subjectPublicKeyPem: intermediate.publicKeyPem,
    subjectPrivateKeyPem: intermediate.privateKeyPem,
    isCa: true,
    customExtensionOid:
      overrides?.intermediateExtensionOid === null
        ? undefined
        : overrides?.intermediateExtensionOid ?? APPLE_PAY_INTERMEDIATE_OID,
  })
  const leafCert = createCert({
    subjectCN: 'Test Apple Pay Leaf',
    issuerCert: intermediateCert,
    issuerPrivateKeyPem: intermediate.privateKeyPem,
    subjectPublicKeyPem: leaf.publicKeyPem,
    subjectPrivateKeyPem: leaf.privateKeyPem,
    isCa: false,
    customExtensionOid:
      overrides?.leafExtensionOid === null
        ? undefined
        : overrides?.leafExtensionOid ?? APPLE_PAY_LEAF_OID,
  })

  return {
    rootPem: forge.pki.certificateToPem(rootCert),
    intermediateCert,
    intermediateKeyPem: intermediate.privateKeyPem,
    leafCert,
    leafKeyPem: leaf.privateKeyPem,
  }
}

interface SyntheticToken {
  paymentData: ApplePayPaymentDataForVerify
  paymentProcessingKeyPem: string
  trustedRootPem: string
  signingTimeMs: number
}

const buildSyntheticToken = (opts?: {
  applicationData?: Buffer | null
  signingTimeMs?: number
  chain?: ChainFixtures
  ephemeralPublicKey?: Buffer
  data?: Buffer
  transactionId?: Buffer
  publicKeyHashOverride?: Buffer
  signedMessageOverride?: Buffer
}): SyntheticToken => {
  const chain = opts?.chain ?? buildChain()
  const ephemeralPublicKey =
    opts?.ephemeralPublicKey ?? Buffer.from('test-ephemeral-spki-bytes')
  const data = opts?.data ?? Buffer.from('test-encrypted-data')
  // 32 bytes = 64 hex chars, matches Apple's canonical transactionId.
  const transactionId = opts?.transactionId ?? crypto.randomBytes(32)
  const applicationData = opts?.applicationData ?? Buffer.alloc(0)

  const merchantKeyPem = generateRsaKeyPairPem().privateKeyPem
  const merchantSpkiDer = crypto
    .createPublicKey(merchantKeyPem)
    .export({ format: 'der', type: 'spki' }) as Buffer
  const publicKeyHash =
    opts?.publicKeyHashOverride ??
    crypto.createHash('sha256').update(merchantSpkiDer).digest()

  const signingTimeMs = opts?.signingTimeMs ?? Date.now()

  const messageBuffer =
    opts?.signedMessageOverride ??
    Buffer.concat([ephemeralPublicKey, data, transactionId, applicationData])

  const p7 = forge.pkcs7.createSignedData()
  p7.content = forge.util.createBuffer(messageBuffer.toString('binary'))
  p7.addCertificate(chain.leafCert)
  p7.addCertificate(chain.intermediateCert)
  p7.addSigner({
    key: chain.leafKeyPem,
    certificate: chain.leafCert,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      { type: forge.pki.oids.signingTime, value: new Date(signingTimeMs) },
    ],
  })
  p7.sign({ detached: true })

  const signatureDer = forge.asn1.toDer(p7.toAsn1()).getBytes()
  const signatureBase64 = Buffer.from(signatureDer, 'binary').toString('base64')

  return {
    paymentData: {
      version: 'EC_v1',
      data: data.toString('base64'),
      signature: signatureBase64,
      header: {
        ephemeralPublicKey: ephemeralPublicKey.toString('base64'),
        publicKeyHash: publicKeyHash.toString('base64'),
        transactionId: transactionId.toString('hex'),
        ...(opts?.applicationData
          ? { applicationData: opts.applicationData.toString('base64') }
          : {}),
      },
    },
    paymentProcessingKeyPem: merchantKeyPem,
    trustedRootPem: chain.rootPem,
    signingTimeMs,
  }
}

describe('verifyApplePaySignature', () => {
  it('accepts a valid synthetic Apple Pay signature', () => {
    const token = buildSyntheticToken()
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).not.toThrow()
  })

  it('accepts a token with applicationData included in signed bytes', () => {
    const applicationData = Buffer.from('order-id=12345', 'utf8')
    const token = buildSyntheticToken({ applicationData })
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).not.toThrow()
  })

  it('rejects when applicationData is omitted from header but was signed', () => {
    const applicationData = Buffer.from('order-id=12345', 'utf8')
    const token = buildSyntheticToken({ applicationData })
    delete token.paymentData.header.applicationData
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=message-digest/)
  })

  it('rejects tampered data field', () => {
    const token = buildSyntheticToken()
    token.paymentData.data = Buffer.from('tampered').toString('base64')
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=message-digest/)
  })

  it('rejects tampered ephemeralPublicKey', () => {
    const token = buildSyntheticToken()
    token.paymentData.header.ephemeralPublicKey =
      Buffer.from('tampered').toString('base64')
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=message-digest/)
  })

  it('rejects tampered transactionId', () => {
    const token = buildSyntheticToken()
    token.paymentData.header.transactionId = crypto
      .randomBytes(32)
      .toString('hex')
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=message-digest/)
  })

  it('rejects when signingTime is more than tolerance in the past', () => {
    const signingTimeMs = Date.now() - 10 * 60 * 1000
    const token = buildSyntheticToken({ signingTimeMs })
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: Date.now(),
      }),
    ).toThrow(/stage=signing-time/)
  })

  it('rejects when signingTime is more than tolerance in the future', () => {
    const signingTimeMs = Date.now() + 10 * 60 * 1000
    const token = buildSyntheticToken({ signingTimeMs })
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: Date.now(),
      }),
    ).toThrow(/stage=signing-time/)
  })

  it('rejects when leaf cert lacks the Apple Pay leaf OID', () => {
    const chain = buildChain({ leafExtensionOid: null })
    const token = buildSyntheticToken({ chain })
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=leaf-oid/)
  })

  it('rejects when intermediate cert lacks the Apple Pay intermediate OID', () => {
    const chain = buildChain({ intermediateExtensionOid: null })
    const token = buildSyntheticToken({ chain })
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=intermediate-oid/)
  })

  it('rejects when chain is anchored at a different root', () => {
    const token = buildSyntheticToken()
    const otherRoot = buildChain().rootPem
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: otherRoot,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=chain/)
  })

  it('rejects when header.publicKeyHash does not match merchant SPKI hash', () => {
    const token = buildSyntheticToken({
      publicKeyHashOverride: crypto.randomBytes(32),
    })
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=public-key-hash/)
  })

  it('rejects an empty signature payload', () => {
    const token = buildSyntheticToken()
    token.paymentData.signature = ''
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=decode-signature/)
  })

  it('rejects unsupported token versions', () => {
    const token = buildSyntheticToken()
    token.paymentData.version = 'RSA_v1'
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=version/)
  })

  it('rejects transactionId that is not exactly 64 hex chars', () => {
    const token = buildSyntheticToken()
    // Odd length would silently truncate in Buffer.from(s, 'hex'), so
    // any non-canonical form must fail closed at this stage.
    token.paymentData.header.transactionId = 'abcdef0123456789'
    expect(() =>
      verifyApplePaySignature({
        paymentData: token.paymentData,
        paymentProcessingKey: token.paymentProcessingKeyPem,
        trustedRootPem: token.trustedRootPem,
        now: token.signingTimeMs,
      }),
    ).toThrow(/stage=transaction-id/)
  })
})
