import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Button } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

import type { TreeNode } from './utils'

interface MoveNodesButtonProps {
  onClick: () => void
  selectedNodes: TreeNode[]
  currentNodeId: number
}

export const MoveNodesButton = ({
  onClick,
  selectedNodes,
  currentNodeId,
}: MoveNodesButtonProps) => {
  const sdk = useSDK<FieldExtensionSDK>()

  return (
    <Button
      onClick={async () => {
        if (selectedNodes.find((node) => node.id === currentNodeId)) {
          sdk.dialogs.openAlert({
            title: 'Node is already selected and can not be moved here',
            message: 'Please select a different node.',
          })
          return
        }

        const confirmed = await sdk.dialogs.openConfirm({
          title: 'Are you sure?',
          message:
            'This will move all selected nodes here and can not be undone.',
        })

        if (confirmed) {
          onClick()
        }
      }}
    >
      Move selected nodes here
    </Button>
  )
}
