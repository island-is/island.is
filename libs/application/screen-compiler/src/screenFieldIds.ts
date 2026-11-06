import { FormNode } from '@island.is/application/types'

export const getFormNodeFieldIds = (formNode: FormNode): string[] =>
  formNode?.children?.filter((x) => x.id).map((x) => x.id as string) ?? []
