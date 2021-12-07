import { uuid } from 'uuidv4'
export interface IDataUpload {
  audkenni: string
  gognSkeytis: {
    audkenni: string
    skeytaHeiti: string
    adilar: ChildrenTransferPerson[]
    attachments: File[]
    gagnaMengi: object
  }
}

interface ChildrenTransferPerson {
  id: string
  nafn: string
  kennitala: string
  simi?: string
  heimilisfang: string
  tolvupostur?: string
  postaritun: string
  sveitafelag: string
  undirritad: boolean
  tegund: ChildrenTransferPersonType
}

interface File {
  nafnSkraar: string
  innihaldSkraar: string
}

enum ChildrenTransferPersonType {
  Malshefjandi,
  Gagnadili,
  Barn,
}

export function constructUploadDataObject(
  id: string,
  persons: Person[],
  attachment: Attachment,
  extraData: { [key: string]: string },
): IDataUpload {
  return {
    audkenni: id,
    gognSkeytis: {
      audkenni: uuid(),
      skeytaHeiti: 'Lögheimilisbreyting barns',
      adilar: persons.map((p) => {
        return {
          id: uuid(),
          nafn: p.name,
          kennitala: p.ssn,
          simi: p.phoneNumber,
          tolvupostur: p.email,
          heimilisfang: p.homeAddress,
          postaritun: p.postalCode,
          sveitafelag: p.city,
          undirritad: p.signed,
          tegund: mapPersonEnum(p.type),
        }
      }),
      attachments: [
        { nafnSkraar: attachment.name, innihaldSkraar: attachment.content },
      ],
      gagnaMengi: extraData,
    },
  }
}

function mapPersonEnum(e: PersonType) {
  switch (e) {
    case PersonType.Plaintiff:
      return ChildrenTransferPersonType.Malshefjandi
    case PersonType.CounterParty:
      return ChildrenTransferPersonType.Gagnadili
    case PersonType.Child:
      return ChildrenTransferPersonType.Barn
  }
}

export enum PersonType {
  Plaintiff,
  CounterParty,
  Child,
}

export type Person = {
  name: string
  ssn: string
  phoneNumber?: string
  email?: string
  homeAddress: string
  postalCode: string
  city: string
  signed: boolean
  type: PersonType
}

export type Attachment = {
  name: string
  content: string
}

export interface DataUploadResponse {
  skilabod: string
  audkenni: string
  malsnumer: string
}
