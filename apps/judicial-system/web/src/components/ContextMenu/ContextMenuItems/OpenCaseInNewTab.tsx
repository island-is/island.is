import type { CaseTableType } from '@island.is/judicial-system/types'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import { useCaseList } from '@island.is/judicial-system-web/src/utils/hooks'

export const useOpenCaseInNewTab = () => {
  const { handleOpenCase } = useCaseList()

  // The list the row came from travels with it, because for the court of
  // appeals that is what decides which page opens - the same reason the row
  // click passes it.
  const openCaseInNewTab = (
    id: string,
    appealCaseId?: string | null,
    caseTableType?: CaseTableType | null,
  ): ContextMenuItem => {
    return {
      title: 'Opna mál í nýjum flipa',
      icon: 'open',
      onClick: () =>
        handleOpenCase(id, true, undefined, appealCaseId, caseTableType),
    }
  }

  return {
    openCaseInNewTab,
  }
}
