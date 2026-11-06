import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import { useCaseList } from '@island.is/judicial-system-web/src/utils/hooks'

export const useOpenCaseInNewTab = () => {
  const { handleOpenCase } = useCaseList()

  const openCaseInNewTab = (
    id: string,
    appealCaseId?: string | null,
  ): ContextMenuItem => {
    return {
      title: 'Opna mál í nýjum flipa',
      icon: 'open',
      onClick: () => handleOpenCase(id, true, undefined, appealCaseId),
    }
  }

  return {
    openCaseInNewTab,
  }
}
