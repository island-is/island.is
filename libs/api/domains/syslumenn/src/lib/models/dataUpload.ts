import { Adili, AdiliTegund, SyslMottakaGognPostRequest } from '@island.is/clients/syslumenn'
import { Field, ObjectType } from '@nestjs/graphql'
import { uuid } from 'uuidv4'
import { Attachment, Person, PersonType } from '../dto/uploadData.input'


export function constructUploadDataObject(
  id: string,
  persons: Person[],
  attachment: Attachment,
  extraData: { [key: string]: string },
  applicationType: string,
): SyslMottakaGognPostRequest {
  return {payload: {
    audkenni: id,
    gognSkeytis: {
      audkenni: applicationType,
      skeytaHeiti: applicationType,
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
  }}
}

function mapPersonEnum(e: PersonType) {
  switch (e) {
    case PersonType.Plaintiff:
      return AdiliTegund.NUMBER_0
    case PersonType.CounterParty:
      return AdiliTegund.NUMBER_1
    case PersonType.Child:
      return AdiliTegund.NUMBER_2
  }
}


@ObjectType()
export class DataUploadResponse {
  @Field()
  skilabod?: string

  @Field()
  audkenni?: string

  @Field()
  malsnumer?: string
}

