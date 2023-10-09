/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EstateAsset,
  EstateInfo,
  EstateMember,
} from '@island.is/clients/syslumenn'
import { estateSchema } from '@island.is/application/templates/estate'
import { infer as zinfer } from 'zod'
import { UploadData } from './types'
import PDFDocument from 'pdfkit'
import getStream from 'get-stream'

type EstateSchema = zinfer<typeof estateSchema>
type EstateData = EstateSchema['estate']
type RepeaterType<T> = T & { initial?: boolean; enabled?: boolean }

// A helper type that extracts values from an ArrayLike
export type Extract<T extends ArrayLike<any> | Record<any, any>> =
  T extends ArrayLike<any> ? T[number] : never

const estateAssetMapper = <T>(element: T) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    marketValue: '',
  }
}

const estateMemberMapper = (element: EstateMember) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    phone: '',
    email: '',
    advocate: element.advocate
      ? {
          ...element.advocate,
          phone: '',
          email: '',
        }
      : undefined,
  }
}

export const estateTransformer = (estate: EstateInfo): EstateData => {
  const assets = estate.assets.map((el) => estateAssetMapper<EstateAsset>(el))
  const flyers = estate.flyers.map((el) => estateAssetMapper<EstateAsset>(el))
  const ships = estate.ships.map((el) => estateAssetMapper<EstateAsset>(el))
  const vehicles = estate.vehicles.map((el) =>
    estateAssetMapper<EstateAsset>(el),
  )
  const guns = estate.guns.map((el) => estateAssetMapper<EstateAsset>(el))
  const estateMembers = estate.estateMembers.map((el) => estateMemberMapper(el))

  return {
    ...estate,
    estateMembers,
    assets,
    flyers,
    ships,
    vehicles,
    guns,
  }
}

export const filterAndRemoveRepeaterMetadata = <T>(
  elements: RepeaterType<Extract<NonNullable<T>>>[],
): Omit<Extract<NonNullable<T>>, 'initial' | 'enabled' | 'dummy'>[] => {
  elements.forEach((element) => {
    delete element.initial
    delete element.dummy
  })

  return elements
}

// Doing generic so the object retains attributes across the map function
const transformEmptyStrings = <T extends Record<string, unknown>>(
  object: T,
): T => {
  // We're now telling typescript that T is a Record<string, unknown> and nothing else
  // removing doubts of what T was before to the type checker.
  const typedReference: Record<string, unknown> = object
  Object.keys(typedReference).forEach((key) => {
    if (typedReference[key] === '') {
      typedReference[key] = undefined
    }
  })
  return object
}

const someValueIsSet = (object: Record<string, unknown>) => {
  return Object.values(object).some((value) => value !== undefined)
}

const moveDownBy = (n: number, doc: PDFKit.PDFDocument) => {
  for (let i = 0; i < n; i++) {
    doc.moveDown()
  }
}

export const transformUploadDataToPDFStream = async (
  data: UploadData,
  applicationId: string,
): Promise<Buffer> => {
  const doc = new PDFDocument()
  const fontSizes = {
    title: 20,
    subtitle: 16,
    text: 12,
  }

  doc.fontSize(fontSizes.title).text(data.applicationType, { align: 'center' })
  moveDownBy(3, doc)

  doc.fontSize(fontSizes.subtitle).text('Hinn látni')
  doc.fontSize(fontSizes.text)
  doc.text(`Nafn: ${data.deceased.name}`)
  doc.text(`Kennitala: ${data.deceased.ssn}`)
  doc.text(`Dánardagur: ${data.deceased.dateOfDeath}`)
  doc.text(`Heimilisfang: ${data.deceased.address}`)
  moveDownBy(2, doc)

  doc.fontSize(fontSizes.subtitle).text('Tilkynnandi')
  doc.fontSize(fontSizes.text)
  fieldWithValue(doc, 'Nafn', data.notifier.name ?? 'Nafn vantar')
  fieldWithValue(doc, 'Kennitala', data.notifier.ssn ?? 'Kennitala vantar')
  fieldWithValue(doc, 'Tengsl', data.notifier.relation ?? 'Tengsl vantar')
  fieldWithValue(
    doc,
    'Símanúmer',
    data.notifier.phoneNumber ?? 'Símanúmer vantar',
  )
  fieldWithValue(doc, 'Netfang', data.notifier.email ?? 'Netfang vantar')
  moveDownBy(2, doc)

  if (data.representative) {
    doc.fontSize(fontSizes.subtitle).text('Fulltrúi')
    doc.fontSize(fontSizes.text)

    fieldWithValue(doc, 'Nafn', data.representative.name ?? 'Nafn vantar')
    fieldWithValue(
      doc,
      'Kennitala',
      data.representative.ssn ?? 'Kennitala vantar',
    )
    fieldWithValue(
      doc,
      'Símanúmer',
      data.representative.phoneNumber ?? 'Símanúmer vantar',
    )
    fieldWithValue(
      doc,
      'Netfang',
      data.representative.email ?? 'Netfang vantar',
    )
    moveDownBy(2, doc)
  }

  data.assets
    .map(transformEmptyStrings)
    .filter(someValueIsSet)
    .forEach((asset, index) => {
      const activeInfo = asset.enabled ? '' : ' (Óvirkjað í umsókn)'
      doc.fontSize(fontSizes.subtitle).text(`Eign ${index + 1}${activeInfo}`)
      doc.fontSize(fontSizes.text)
      fieldWithValue(doc, 'Númer', asset.assetNumber ?? 'Eignanúmer vantar')
      fieldWithValue(doc, 'Lýsing', asset.description ?? 'Lýsingu vantar')
      fieldWithValue(
        doc,
        'Markaðsvirði',
        asset.marketValue?.toString() ?? 'Markaðsvirði vantar',
      )
      doc.moveDown()
    })
  doc.moveDown()

  data.bankAccounts
    .map(transformEmptyStrings)
    .filter(someValueIsSet)
    .forEach((bankAccount, index) => {
      doc.fontSize(fontSizes.subtitle).text(`Bankareikningur ${index + 1}`)
      doc.fontSize(fontSizes.text)
      fieldWithValue(
        doc,
        'Reikningsnúmer',
        bankAccount.accountNumber ?? 'Reikningsnúmer vantar',
      )
      fieldWithValue(
        doc,
        'Innistæða',
        bankAccount.balance?.toString() ?? 'Innistæðu vantar',
      )
      doc.moveDown()
    })
  moveDownBy(2, doc)

  data.debts
    .map(transformEmptyStrings)
    .filter(someValueIsSet)
    .forEach((debt, index) => {
      doc.fontSize(fontSizes.subtitle).text(`Skuld ${index + 1}`)
      doc.fontSize(fontSizes.text)
      fieldWithValue(
        doc,
        'Lánardrottinn',
        debt.creditorName ?? 'Nafn lánardrottins vantar',
      )
      fieldWithValue(
        doc,
        'Kennitala',
        debt.nationalId ?? 'Kennitölu lánardrottins vantar',
      )
      fieldWithValue(doc, 'Upphæð', debt.balance?.toString() ?? 'Upphæð vantar')
      fieldWithValue(doc, 'Lánsnúmer', debt.loanIdentity ?? 'Lánsnúmer vantar')
      doc.moveDown()
    })
  moveDownBy(2, doc)

  data.claims
    .map(transformEmptyStrings)
    .filter(someValueIsSet)
    .forEach((claim, index) => {
      doc.fontSize(fontSizes.subtitle).text(`Krafa ${index + 1}`)
      doc.fontSize(fontSizes.text)
      fieldWithValue(
        doc,
        'Kröfuhafi',
        claim.publisher ?? 'Nafn kröfuhafa vantar',
      )
      fieldWithValue(
        doc,
        'Upphæð',
        claim.value?.toString() ?? 'Upphæð kröfu vantar',
      )
      doc.moveDown()
    })
  moveDownBy(2, doc)

  data.estateMembers
    .map(transformEmptyStrings)
    .filter(someValueIsSet)
    .forEach((estateMember, index) => {
      const activeInfo = estateMember?.enabled ? '' : ' (Óvirkjað í umsókn)'
      doc.fontSize(fontSizes.subtitle).text(`Erfingi ${index + 1}${activeInfo}`)
      doc.fontSize(fontSizes.text)
      fieldWithValue(doc, 'Nafn', estateMember.name ?? 'Nafn vantar')
      fieldWithValue(
        doc,
        'Kennitala',
        estateMember.nationalId ?? 'Kennitölu vantar',
      )
      fieldWithValue(
        doc,
        'Netfang',
        estateMember.email ?? 'Netfang ekki gefið upp',
      )
      fieldWithValue(
        doc,
        'Símanúmer',
        estateMember.phone ?? 'Símanúmer ekki gefið upp',
      )
      fieldWithValue(doc, 'Tengsl', estateMember.relation ?? 'Tengsl vantar')
      doc.moveDown()
    })
  moveDownBy(2, doc)

  data.guns
    .map(transformEmptyStrings)
    .filter(someValueIsSet)
    .forEach((gun, index) => {
      const activeInfo = gun.enabled ? '' : ' (Óvirkjað í umsókn)'
      doc.fontSize(fontSizes.subtitle).text(`Vopn ${index + 1}${activeInfo}`)
      doc.fontSize(fontSizes.text)
      fieldWithValue(doc, 'Númer', gun.assetNumber ?? 'Númer vantar')
      fieldWithValue(doc, 'Lýsing', gun.description ?? 'Lýsingu vantar')
      fieldWithValue(
        doc,
        'Markaðsvirði',
        gun.marketValue?.toString() ?? 'Markaðsvirði vantar',
      )
      doc.moveDown()
    })
  moveDownBy(2, doc)

  if (data.inventory.info) {
    doc.fontSize(fontSizes.subtitle).text('Innbú')
    doc.fontSize(fontSizes.text)
    fieldWithValue(
      doc,
      'Upplýsingar',
      data.inventory.info ?? 'Upplýsingar vantar',
    )
    fieldWithValue(
      doc,
      'Verðgildi',
      data.inventory.value?.toString() ?? 'Verðgildi vantar',
    )
    moveDownBy(2, doc)
  }

  if (data.moneyAndDeposit.info) {
    doc.fontSize(fontSizes.subtitle).text('Peningar eða bankahólf')
    doc.fontSize(fontSizes.text)
    fieldWithValue(
      doc,
      'Upplýsingar',
      data.moneyAndDeposit.info ?? 'Upplýsingar vantar',
    )
    fieldWithValue(
      doc,
      'Verðgildi',
      data.moneyAndDeposit.value?.toString() ?? 'Verðgildi vantar',
    )
    moveDownBy(2, doc)
  }

  if (data.otherAssets.info) {
    doc.fontSize(fontSizes.subtitle).text('Aðrar eignir')
    doc.fontSize(fontSizes.text)
    fieldWithValue(
      doc,
      'Upplýsingar',
      data.otherAssets.info ?? 'Upplýsingar vantar',
    )
    fieldWithValue(
      doc,
      'Verðgildi',
      data.otherAssets.value?.toString() ?? 'Verðgildi vantar',
    )
    moveDownBy(2, doc)
  }

  data.stocks
    .map(transformEmptyStrings)
    .filter(someValueIsSet)
    .forEach((stock, index) => {
      doc.fontSize(fontSizes.subtitle).text(`Verðbréf ${index + 1}`)
      doc.fontSize(fontSizes.text)
      fieldWithValue(doc, 'Fyrirtæki', stock.organization ?? 'Fyrirtæki vantar')
      fieldWithValue(doc, 'Kennitala', stock.nationalId ?? 'Kennitölu vantar')
      fieldWithValue(
        doc,
        'Nafnvirði',
        stock.faceValue?.toString() ?? 'Nafnvirði vantar',
      )
      fieldWithValue(
        doc,
        'Gengi',
        stock.rateOfExchange?.toString() ?? 'Gengi vantar',
      )
      fieldWithValue(doc, 'Virði', stock.value?.toString() ?? 'Virði vantar')
      doc.moveDown()
    })
  moveDownBy(2, doc)

  data.vehicles
    .map(transformEmptyStrings)
    .filter(someValueIsSet)
    .forEach((vehicle, index) => {
      const activeInfo = vehicle?.enabled ? '' : ' (Óvirkjað í umsókn)'
      doc
        .fontSize(fontSizes.subtitle)
        .text(`Farartæki ${index + 1}${activeInfo}`)
      doc.fontSize(fontSizes.text)
      fieldWithValue(doc, 'Lýsing', vehicle.description ?? 'Lýsingu vantar')
      fieldWithValue(doc, 'Númer', vehicle.assetNumber ?? 'Númer vantar')
      fieldWithValue(
        doc,
        'Markaðsvirði',
        vehicle.marketValue?.toString() ?? 'Markaðsvirði vantar',
      )
      doc.moveDown()
    })
  moveDownBy(2, doc)

  doc.fontSize(fontSizes.subtitle).text('Annað')
  doc.fontSize(fontSizes.text)
  if (data.districtCommissionerHasWill) {
    fieldWithValue(
      doc,
      'Erfðaskrá hjá sýslumanni',
      data.districtCommissionerHasWill,
    )
  }
  if (data.settlement) {
    fieldWithValue(doc, 'Kaupmáli', data.settlement)
  }
  if (data.remarksOnTestament) {
    fieldWithValue(doc, 'Athugasemdir fyrir erfðaskrá', data.remarksOnTestament)
  }
  moveDownBy(2, doc)

  if (data.deceasedWithUndividedEstate?.spouse?.nationalId) {
    doc.fontSize(fontSizes.subtitle).text('Maki hins látna í óskiptu búi')
    doc.fontSize(fontSizes.text)

    fieldWithValue(
      doc,
      'Nafn',
      data.deceasedWithUndividedEstate.spouse.name ?? 'Nafn vantar',
    )
    fieldWithValue(
      doc,
      'Kennitala',
      data.deceasedWithUndividedEstate.spouse.nationalId,
    )
  }

  moveDownBy(2, doc)

  doc
    .text(
      'Þetta skjal var framkallað með sjálfvirkum hætti á island.is þann:' +
        new Date().toLocaleDateString('is-IS'),
    )

    .moveDown()
    .text(`Kenninúmer umsóknar hjá island.is: ${applicationId}`)

    .moveDown()
    .text(`Kenninúmer umsóknar hjá sýslumanni: ${data.caseNumber}`)

  doc.end()

  return await getStream.buffer(doc)
}

const fieldWithValue = (
  doc: PDFKit.PDFDocument,
  field: string,
  value: string,
): void => {
  doc
    .font('Helvetica-Bold')
    .text(field, { continued: true })
    .font('Helvetica')
    .text(`: ${value}`)
}
