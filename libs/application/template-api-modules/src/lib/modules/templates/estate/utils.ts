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
export type Extract<
  T extends ArrayLike<any> | Record<any, any>
> = T extends ArrayLike<any> ? T[number] : never

const initialMapper = <T>(element: T) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    marketValue: '',
  }
}

export const estateTransformer = (estate: EstateInfo): EstateData => {
  const assets = estate.assets.map((el) => initialMapper<EstateAsset>(el))
  const flyers = estate.flyers.map((el) => initialMapper<EstateAsset>(el))
  const estateMembers = estate.estateMembers.map((el) =>
    initialMapper<EstateMember>(el),
  )
  const ships = estate.ships.map((el) => initialMapper<EstateAsset>(el))
  const vehicles = estate.vehicles.map((el) => initialMapper<EstateAsset>(el))
  const guns = estate.guns.map((el) => initialMapper<EstateAsset>(el))

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

export const transformUploadDataToPDFStream = async (
  data: UploadData,
  applicationId: string,
): Promise<Buffer> => {
  const doc = new PDFDocument()
  const fontSizes = {
    title: 20,
    subtitle: 16,
    text: 8,
  }

  doc.fontSize(fontSizes.title).text('Tilkynnandi')
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
  doc.moveDown()
  doc.moveDown()

  data.assets.forEach((asset, index) => {
    doc.fontSize(fontSizes.subtitle).text(`Eign ${index + 1}`)
    doc.fontSize(fontSizes.text)
    fieldWithValue(doc, 'Númer', asset.assetNumber ?? 'Eignanúmer vantar')
    fieldWithValue(doc, 'Lýsing', asset.description ?? 'Lýsingu vantar')
    doc.moveDown()
  })
  doc.moveDown()

  data.bankAccounts.forEach((bankAccount, index) => {
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
  doc.moveDown()

  data.debts.forEach((debt, index) => {
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
      debt.ssn ?? 'Kennitölu lánardrottins vantar',
    )
    fieldWithValue(
      doc,
      'Upphæð',
      debt.balance?.toString() ?? 'Skuldbindingu vantar',
    )
    doc.moveDown()
  })
  doc.moveDown()

  data.estateMembers.forEach((estateMember, index) => {
    doc.fontSize(fontSizes.subtitle).text(`Erfingi ${index + 1}`)
    doc.fontSize(fontSizes.text)
    fieldWithValue(doc, 'Nafn', estateMember.name ?? 'Nafn vantar')
    fieldWithValue(doc, 'Kennitala', estateMember.ssn ?? 'Kennitölu vantar')
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
  doc.moveDown()

  doc.fontSize(fontSizes.subtitle).text('Innbú')
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
  doc.moveDown()
  doc.moveDown()

  doc.fontSize(fontSizes.subtitle).text('Peningar eða bankahólf')
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
  doc.moveDown()
  doc.moveDown()

  doc.fontSize(fontSizes.subtitle).text('Aðrar eignir')
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

  data.stocks.forEach((stock, index) => {
    doc.fontSize(fontSizes.subtitle).text(`Verðbréf ${index + 1}`)
    doc.fontSize(fontSizes.text)
    fieldWithValue(doc, 'Fyrirtæki', stock.organization ?? 'Fyrirtæki vantar')
    fieldWithValue(doc, 'Kennitala', stock.ssn ?? 'Kennitölu vantar')
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
  doc.moveDown()

  data.vehicles.forEach((vehicle, index) => {
    doc.fontSize(fontSizes.subtitle).text(`Farartæki ${index + 1}`)
    doc.fontSize(fontSizes.text)
    fieldWithValue(doc, 'Lýsing', vehicle.description ?? 'Lýsingu vantar')
    fieldWithValue(doc, 'Númer', vehicle.assetNumber ?? 'Númer vantar')
    doc.moveDown()
  })
  doc.moveDown()
  doc.moveDown()

  doc
    .fontSize(fontSizes.text)
    .text(
      'Þetta skjal var framkallað með sjálfvirkum hætti á island.is þann:' +
        new Date().toLocaleDateString('is-IS'),
    )

    .moveDown()
    .text(`Kenninúmer umsóknar: ${applicationId}`)

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
