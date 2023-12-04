import { Certificate } from '@fidm/x509'
import base45 from 'base45-js'
import { Buffer } from 'buffer'
import cbor from 'cbor'
import cose from 'cose-js'
import pako from 'pako'
import publicKeys from '../../../data/eudcc-public-keys.json'

export interface DecodedEudcc {
  verify(): Promise<boolean>
  issuer: string | null
  issuedAt: Date
  expiresAt: Date
  version: string
  givenName: string
  familyName: string
  dateOfBirth: string

  vaccinations?: Array<{
    disease: 'COVID-19' | string
    vaccineType: string
    vaccineProduct: string
    vaccineManufacturer: string
    doseNumber: number
    totalDoses: number
    date: Date
    country: string
    issuer: string
    certificateId: string
  }>

  tests?: Array<{
    disease: 'COVID-19' | string
    testType: string
    testName: string
    testManufacturer: string
    testDate: Date
    testResult: string
    testCenter: string
    country: string
    issuer: string
    certificateId: string
  }>

  recoveries?: Array<{
    disease: 'COVID-19' | string
    firstPositiveTest: Date
    country: string
    issuer: string
    validFrom: Date
    validUntil: Date
    certificateId: string
  }>
}

export type RecoveryGroup = {
  /** Disease or agent from which the holder has recovered */
  tg: string
  /** Date of the holder’s first positive NAAT test result */
  fr: string
  /** Member State or third country in which test was carried out */
  co: string
  /** Certificate issuer */
  is: string
  /** Certificate valid from */
  df: string
  /** Certificate valid until */
  du: string
  /** Unique certificate identifier */
  ci: string
}

export type TestGroup = {
  /** Disease or Agent Targeted */
  tg: string
  /** The type of test */
  tt: string
  /** Test name (nucleic acid amplification tests only) */
  nm: string
  /** Test device identifier (rapid antigen tests only) */
  ma: string
  /** Date and time of the test sample collection */
  sc: string
  /** Result of the test */
  tr: string
  /** Testing centre or facility */
  tc: string
  /** Member State or third country in which the test was carried out */
  co: string
  /** Certificate issuer */
  is: string
  /** Unique certificate identifier */
  ci: string
}

export type VaccinationGroup = {
  /** Disease or Agent Targeted */
  tg: string
  /** Vaccine or Prophylaxis */
  vp: string
  /** Vaccine Medicinal Product */
  mp: string
  /** Marketing Authorization Holder */
  ma: string
  /** Dose Number */
  dn: string
  /** Total Series of Doses */
  sd: string
  /** Date of Vaccination */
  dt: string
  /** Country of Vaccination */
  co: string
  /** Certificate Issuer */
  is: string
  /** Unique Certificate Identifier */
  ci: string
}

export type CertificateContent = {
  ver: string
  nam: {
    fn: string
    gn: string
    fnt: string
    gnt: string
  }
  dob: string
  v?: VaccinationGroup[]
  t?: TestGroup[]
  r?: RecoveryGroup[]
}

export enum CBOR_STRUCTURE {
  PROTECTED_HEADER = 0,
  UNPROTECTED_HEADER = 1,
  PAYLOAD = 2,
  SIGNATURE = 3,
}

export enum ALGOS {
  ECDSA_256 = -7,
  RSA_PSS_256 = -37,
}

export enum HEADER_KEYS {
  ALGORITHM = 1,
  KID = 4,
}

export enum PAYLOAD_KEYS {
  ISSUER = 1,
  ISSUED_AT = 6,
  EXPIRES_AT = 4,
  CONTENT = -260,
}

export type CertificateType = {
  [PAYLOAD_KEYS.ISSUER]: string
  [PAYLOAD_KEYS.EXPIRES_AT]: number
  [PAYLOAD_KEYS.ISSUED_AT]: number
  [PAYLOAD_KEYS.CONTENT]: {
    1: CertificateContent
  }
}

const messages: { [key: string]: string } = {
  // tt
  'LP6464-4': 'Nucleic acid amplification with probe detection',
  'LP217198-3': 'Rapid immunoassay',
  // ma
  '1833': 'AAZ-LMB, COVID-VIRO',
  '1232': 'Abbott Rapid Diagnostics, Panbio COVID-19 Ag Rapid Test',
  '1468': 'ACON Laboratories, Inc, Flowflex SARS-CoV-2 Antigen rapid test',
  '1304': 'AMEDA Labordiagnostik GmbH, AMP Rapid Test SARS-CoV-2 Ag',
  '1822':
    'Anbio (Xiamen) Biotechnology Co., Ltd, Rapid COVID-19 Antigen Test(Colloidal Gold)',
  '1815':
    'Anhui Deep Blue Medical Technology Co., Ltd, COVID-19 (SARS-CoV-2) Antigen Test Kit (Colloidal Gold) - Nasal Swab',
  '1736':
    'Anhui Deep Blue Medical Technology Co., Ltd, COVID-19 (SARS-CoV-2) Antigen Test Kit(Colloidal Gold)',
  '768': 'ArcDia International Ltd, mariPOC SARS-CoV-2',
  '1654': 'Asan Pharmaceutical CO., LTD, Asan Easy Test COVID-19 Ag',
  '2010':
    'Atlas Link Technology Co., Ltd., NOVA Test® SARS-CoV-2 Antigen Rapid Test Kit (Colloidal Gold Immunochromatography)',
  '1906': 'Azure Biotech Inc, COVID-19 Antigen Rapid Test Device',
  '1870':
    'Beijing Hotgen Biotech Co., Ltd, Novel Coronavirus 2019-nCoV Antigen Test (Colloidal Gold)',
  '1331':
    'Beijing Lepu Medical Technology Co., Ltd, SARS-CoV-2 Antigen Rapid Test Kit',
  '1484':
    'Beijing Wantai Biological Pharmacy Enterprise Co., Ltd, Wantai SARS-CoV-2 Ag Rapid Test (FIA)',
  '1223': 'BIOSYNEX S.A., BIOSYNEX COVID-19 Ag BSS',
  '1236': 'BTNX Inc, Rapid Response COVID-19 Antigen Rapid Test',
  '1173': 'CerTest Biotec, CerTest SARS-CoV-2 Card test',
  '1919': 'Core Technology Co., Ltd, Coretests COVID-19 Ag Test',
  '1225': 'DDS DIAGNOSTIC, Test Rapid Covid-19 Antigen (tampon nazofaringian)',
  '1375': 'DIALAB GmbH, DIAQUICK COVID-19 Ag Cassette',
  '1244': 'GenBody, Inc, Genbody COVID-19 Ag Test',
  '1253':
    'GenSure Biotech Inc, GenSure COVID-19 Antigen Rapid Kit (REF: P2004)',
  '1144': 'Green Cross Medical Science Corp., GENEDIA W COVID-19 Ag',
  '1747':
    'Guangdong Hecin Scientific, Inc., 2019-nCoV Antigen Test Kit (colloidal gold method)',
  '1360': 'Guangdong Wesail Biotech Co., Ltd, COVID-19 Ag Test Kit',
  '1437':
    'Guangzhou Wondfo Biotech Co., Ltd, Wondfo 2019-nCoV Antigen Test (Lateral Flow Method)',
  '1256':
    'Hangzhou AllTest Biotech Co., Ltd, COVID-19 and Influenza A+B Antigen Combo Rapid Test',
  '1363': 'Hangzhou Clongene Biotech Co., Ltd, Covid-19 Antigen Rapid Test Kit',
  '1365':
    'Hangzhou Clongene Biotech Co., Ltd, COVID-19/Influenza A+B Antigen Combo Rapid Test',
  '1844':
    'Hangzhou Immuno Biotech Co.,Ltd, Immunobio SARS-CoV-2 Antigen ANTERIOR NASAL Rapid Test Kit (minimal invasive)',
  '1215':
    'Hangzhou Laihe Biotech Co., Ltd, LYHER Novel Coronavirus (COVID-19) Antigen Test Kit(Colloidal Gold)',
  '1392':
    'Hangzhou Testsea Biotechnology Co., Ltd, COVID-19 Antigen Test Cassette',
  '1767': 'Healgen Scientific, Coronavirus Ag Rapid Test Cassette',
  '1263': 'Humasis, Humasis COVID-19 Ag Test',
  '1333':
    'Joinstar Biomedical Technology Co., Ltd, COVID-19 Rapid Antigen Test (Colloidal Gold)',
  '1764':
    'JOYSBIO (Tianjin) Biotechnology Co., Ltd, SARS-CoV-2 Antigen Rapid Test Kit (Colloidal Gold)',
  '1266': 'Labnovation Technologies Inc, SARS-CoV-2 Antigen Rapid Test Kit',
  '1267': 'LumiQuick Diagnostics Inc, QuickProfile COVID-19 Antigen Test',
  '1268': 'LumiraDX, LumiraDx SARS-CoV-2 Ag Test',
  '1180': 'MEDsan GmbH, MEDsan SARS-CoV-2 Antigen Rapid Test',
  '1190': 'möLab, COVID-19 Rapid Antigen Test',
  '1481': 'MP Biomedicals, Rapid SARS-CoV-2 Antigen Test Card',
  '1162': 'Nal von minden GmbH, NADAL COVID-19 Ag Test',
  '1420': 'NanoEntek, FREND COVID-19 Ag',
  '1199': 'Oncosem Onkolojik Sistemler San. ve Tic. A.S., CAT',
  '308': 'PCL Inc, PCL COVID19 Ag Rapid FIA',
  '1271': 'Precision Biosensor, Inc, Exdia COVID-19 Ag',
  '1341':
    'Qingdao Hightop Biotech Co., Ltd, SARS-CoV-2 Antigen Rapid Test (Immunochromatography)',
  '1097': 'Quidel Corporation, Sofia SARS Antigen FIA',
  '1606': 'RapiGEN Inc, BIOCREDIT COVID-19 Ag - SARS-CoV 2 Antigen test',
  '1604': 'Roche (SD BIOSENSOR), SARS-CoV-2 Antigen Rapid Test',
  '1489':
    'Safecare Biotech (Hangzhou) Co. Ltd, COVID-19 Antigen Rapid Test Kit (Swab)',
  '1490':
    'Safecare Biotech (Hangzhou) Co. Ltd, Multi-Respiratory Virus Antigen Test Kit(Swab)  (Influenza A+B/ COVID-19)',
  '344': 'SD BIOSENSOR Inc, STANDARD F COVID-19 Ag FIA',
  '345': 'SD BIOSENSOR Inc, STANDARD Q COVID-19 Ag Test',
  '1319': 'SGA Medikal, V-Chek SARS-CoV-2 Ag Rapid Test Kit (Colloidal Gold)',
  '2017':
    'Shenzhen Ultra-Diagnostics Biotec.Co.,Ltd, SARS-CoV-2 Antigen Test Kit',
  '1246':
    'VivaChek Biotech (Hangzhou) Co., Ltd, Vivadiag SARS CoV 2 Ag Rapid Test',
  '1763':
    'Xiamen AmonMed Biotechnology Co., Ltd, COVID-19 Antigen Rapid Test Kit (Colloidal Gold)',
  '1278': 'Xiamen Boson Biotech Co. Ltd, Rapid SARS-CoV-2 Antigen Test Card',
  '1456': 'Xiamen Wiz Biotech Co., Ltd, SARS-CoV-2 Antigen Rapid Test',
  '1884':
    'Xiamen Wiz Biotech Co., Ltd, SARS-CoV-2 Antigen Rapid Test (Colloidal Gold)',
  '1296':
    'Zhejiang Anji Saianfu Biotech Co., Ltd, AndLucky COVID-19 Antigen Rapid Test',
  '1295':
    'Zhejiang Anji Saianfu Biotech Co., Ltd, reOpenTest COVID-19 Antigen Rapid Test',
  '1343':
    'Zhezhiang Orient Gene Biotech Co., Ltd, Coronavirus Ag Rapid Test Cassette (Swab)',
  // tr
  '260415000': 'Not detected',
  '260373001': 'Detected',
  // vp
  '1119349007': 'SARS-CoV-2 mRNA vaccine',
  '1119305005': 'SARS-CoV-2 antigen vaccine',
  J07BX03: 'covid-19 vaccines',
  // mp
  'EU/1/20/1528': 'Comirnaty',
  'EU/1/20/1507': 'COVID-19 Vaccine Moderna',
  'EU/1/21/1529': 'Vaxzevria',
  'EU/1/20/1525': 'COVID-19 Vaccine Janssen',
  // ma
  'ORG-100001699': 'AstraZeneca AB',
  'ORG-100030215': 'Biontech Manufacturing GmbH',
  'ORG-100001417': 'Janssen-Cilag International',
  'ORG-100031184': 'Moderna Biotech Spain S.L.',
  'ORG-100006270': 'Curevac AG',
  'ORG-100013793': 'CanSino Biologics',
  'ORG-100020693': 'China Sinopharm International Corp. - Beijing location',
  'ORG-100010771':
    'Sinopharm Weiqida Europe Pharmaceutical s.r.o. - Prague location',
  'ORG-100024420':
    'Sinopharm Zhijun (Shenzhen) Pharmaceutical Co. Ltd. - Shenzhen location',
  'ORG-100032020': 'Novavax CZ AS',
}

function mapToJSON(map: Map<any, any>) {
  if (!(map instanceof Map)) {
    return map
  }

  const out = Object.create(null)

  map.forEach((value, key) => {
    if (value instanceof Map) {
      out[key] = mapToJSON(value)
    } else {
      out[key] = value
    }
  })

  return out
}

function getCountry(cert: CertificateContent, iss?: string): string | null {
  try {
    return iss || (cert.v! || cert.t! || cert.r!)[0].co
  } catch (e) {
    return null
  }
}

function getKid(protectedHeader: any, unprotectedHeader: any): string | null {
  try {
    if (protectedHeader) {
      return protectedHeader.get(HEADER_KEYS.KID).toString('base64')
    } else {
      return unprotectedHeader.get(HEADER_KEYS.KID).toString('base64')
    }
  } catch {
    return null
  }
}

function getAlgo(protectedHeader: any, unprotectedHeader: any): ALGOS | null {
  try {
    if (protectedHeader) {
      return protectedHeader.get(HEADER_KEYS.ALGORITHM)
    } else {
      return unprotectedHeader.get(HEADER_KEYS.ALGORITHM)
    }
  } catch {
    return null
  }
}

function decodeCbor(qrCbor: any): {
  kid: string | null
  country: string | null
  issuedAt: number
  expiresAt: number
  cert: CertificateContent
  algo: ALGOS | null
} {
  const message = cbor.decodeFirstSync(Buffer.from(qrCbor))
  const protectedHeader = cbor.decodeFirstSync(
    message.value[CBOR_STRUCTURE.PROTECTED_HEADER],
  )
  const unprotectedHeader = message.value[CBOR_STRUCTURE.UNPROTECTED_HEADER]
  const content = cbor.decodeFirstSync(message.value[CBOR_STRUCTURE.PAYLOAD])

  const kid = getKid(protectedHeader, unprotectedHeader)
  const algo = getAlgo(protectedHeader, unprotectedHeader)
  const cert = mapToJSON(content.get(PAYLOAD_KEYS.CONTENT).get(1))

  return {
    kid,
    country: getCountry(cert, content.get(PAYLOAD_KEYS.ISSUER)),
    issuedAt: content.get(PAYLOAD_KEYS.ISSUED_AT),
    expiresAt: content.get(PAYLOAD_KEYS.EXPIRES_AT),
    cert,
    algo,
  }
}

export function parseEudcc(data: string | any): DecodedEudcc {
  // remove header bytes
  if (data.startsWith('HC1')) {
    data = data.substring(3)
    if (data.startsWith(':')) {
      data = data.substring(1)
    }
  }

  // convert to raw data
  let rawData = base45.decode(data)

  // possibly compressed with zlib
  if (rawData[0] === 0x78) {
    rawData = pako.inflate(rawData)
  }

  // conver to cbor schema
  const schema = cbor.decode(rawData)

  const { kid, cert, country } = decodeCbor(rawData)

  const payload = cbor.decode(schema.value[2])
  const response: DecodedEudcc = {
    async verify() {
      let verified = false
      // find usable public key
      const publicKey = publicKeys.find((pk) => pk.kid === kid)

      // verify signature
      if (publicKey) {
        const c = Certificate.fromPEM(
          `-----BEGIN CERTIFICATE-----\n${publicKey.rawData}\n-----END CERTIFICATE-----` as unknown as Buffer,
        )
        const x = Buffer.from(c.publicKey.keyRaw.slice(1, 1 + 32))
        const y = Buffer.from(c.publicKey.keyRaw.slice(33, 33 + 32))
        const verifyPayload = {
          key: {
            kid,
            x,
            y,
          },
        }

        const res = await cose.sign.verify(rawData, verifyPayload)
        if (res.equals(schema.value[2])) {
          verified = true
        } else {
          throw new Error('Signature mismatch')
        }
      } else {
        throw new Error('No public key found')
      }

      return verified
    },
    issuer: country,
    issuedAt: new Date(payload.get(6) * 1000),
    expiresAt: new Date(payload.get(4) * 1000),
    version: cert.ver,
    givenName: cert.nam.gn,
    familyName: cert.nam.fn,
    dateOfBirth: cert.dob?.split('T')[0],
  }

  response.vaccinations = cert.v?.map((v) => ({
    disease: v.tg === '840539006' ? 'COVID-19' : v.tg,
    vaccineType: messages[v.vp] ?? v.vp,
    vaccineProduct: messages[v.mp] ?? v.mp,
    vaccineManufacturer: messages[v.ma] ?? v.ma,
    doseNumber: Number(v.dn),
    totalDoses: Number(v.sd),
    date: new Date(v.dt.split('T')[0]),
    country: v.co,
    issuer: v.is,
    certificateId: v.ci,
  }))

  response.tests = cert.t?.map((t) => ({
    disease: t.tg === '840539006' ? 'COVID-19' : t.tg,
    testType: messages[t.tt] ?? t.tt,
    testName: t.nm ?? '',
    testManufacturer: messages[t.ma] ?? t.ma,
    testDate: new Date(t.sc),
    testResult: messages[t.tr] ?? t.tr,
    testCenter: t.tc,
    country: t.co,
    issuer: t.is,
    certificateId: t.ci,
  }))

  response.recoveries = cert.r?.map((r) => ({
    disease: r.tg === '840539006' ? 'COVID-19' : r.tg,
    firstPositiveTest: new Date(r.fr.split('T')[0]),
    country: r.co,
    issuer: r.is,
    validFrom: new Date(r.df.split('T')[0]),
    validUntil: new Date(r.du.split('T')[0]),
    certificateId: r.ci,
  }))

  return response
}
