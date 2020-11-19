import { registerEnumType } from '@nestjs/graphql'

export enum ItemType {
  article,
  category,
}

registerEnumType(ItemType, { name: 'ItemType' })
