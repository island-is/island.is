import { FC } from 'react'

import { Button } from '@island.is/island-ui/core'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'

import { downloadUsersCsv } from './usersCsv'

interface Props {
  users: User[]
}

export const UsersCsvButton: FC<Props> = ({ users }) => {
  return (
    <Button
      variant="ghost"
      size="small"
      icon="download"
      iconType="outline"
      onClick={() => downloadUsersCsv(users)}
      disabled={users.length === 0}
    >
      Sækja CSV
    </Button>
  )
}
