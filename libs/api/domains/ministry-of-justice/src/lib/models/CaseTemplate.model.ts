import { registerEnumType } from '@nestjs/graphql'

export enum CaseTemplateType {
  ANNOUNCEMENT_WITH_TABLE = 'Auglýsing með töflu',
  TARRIF_CHANGES = 'Breytingar á gjaldskrá',
  ORGANIZATION_ISSUE = 'Skipulagsmál',
}

registerEnumType(CaseTemplateType, {
  name: 'MinistryOfJusticeCaseTemplateType',
})
