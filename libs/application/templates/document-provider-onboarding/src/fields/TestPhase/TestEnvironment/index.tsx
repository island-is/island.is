import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'

const TestEnvironment: FC<FieldBaseProps> = ({ error, field, application }) => {
  interface User {
    id: string
    name: string
    value: string
  }

  let [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch('/api/keys')
      .then((response) => response.json())
      .then((json) => setUsers(json))
  }, [])

  return (
    <ul>
      {users.map((User) => (
        <li key={User.id}>
          {User.name} - {User.value}
        </li>
      ))}
    </ul>
  )
}

export default TestEnvironment
