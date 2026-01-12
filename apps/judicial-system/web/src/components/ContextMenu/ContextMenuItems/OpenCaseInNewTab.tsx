import { useCaseList } from '@island.is/judicial-system-web/src/utils/hooks'

import { ContextMenuItem } from '../ContextMenu'

export const useOpenCaseInNewTab = () => {
  const { handleOpenCase } = useCaseList()

  const openCaseInNewTab = (id: string): ContextMenuItem => {
    return {
      title: 'Opna mál í nýjum flipa',
      icon: 'open',
      onClick: () => handleOpenCase(id, true),
    }
  }

  return {
    openCaseInNewTab,
  }
}
