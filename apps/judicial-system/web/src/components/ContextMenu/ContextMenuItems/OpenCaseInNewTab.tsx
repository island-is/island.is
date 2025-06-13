import { useCaseList } from '@island.is/judicial-system-web/src/utils/hooks'

import { ContextMenuItem } from '../ContextMenu'

export const useOpenCaseInNewTab = () => {
  const { handleOpenCase } = useCaseList()

  const openCaseInNewTabMenuItem = (id: string): ContextMenuItem => {
    return {
      title: 'Opna mál í nýjum flipa',
      onClick: () => handleOpenCase(id, true),
      icon: 'open',
    }
  }

  return {
    openCaseInNewTabMenuItem,
  }
}
