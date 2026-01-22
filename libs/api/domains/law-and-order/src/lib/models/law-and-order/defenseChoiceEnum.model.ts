import { registerEnumType } from '@nestjs/graphql'

export enum DefenseChoiceEnum {
  WAIVE = 'WAIVE',
  CHOOSE = 'CHOOSE',
  DELAY = 'DELAY',
  DELEGATE = 'DELEGATE',
}
registerEnumType(DefenseChoiceEnum, {
  name: 'LawAndOrderDefenseChoiceEnum',
})
