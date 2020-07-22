import React, { FC } from 'react'
// eslint-disable-next-line
import useSubjects from 'apps/service-portal/src/hooks/useSubjects/useSubjects'
import { Select, Option } from '@island.is/island-ui/core'
// eslint-disable-next-line
import { useStore } from 'apps/service-portal/src/stateProvider'
import useUserInfo from '../../../hooks/useUserInfo/useUserInfo'

const SubjectSwitcher: FC<{}> = () => {
  const [{ userInfo }] = useStore()
  const { subjectList, subjectListState } = useSubjects()
  const { setUser } = useUserInfo()
  const options =
    subjectListState === 'fulfilled'
      ? subjectList.map((subject) => ({
          label: subject.name,
          value: subject.nationalId,
        }))
      : [{ label: userInfo.sub.name, value: userInfo.sub.nationalId }]
  const value = options.find((x) => x.value === userInfo.sub.nationalId)

  return (
    <Select
      name="Veldu einstakling eða fyrirtæki"
      value={value}
      options={options}
      onChange={(option) => {
        setUser(userInfo.actor.nationalId, (option as Option).value.toString())
      }}
    />
  )
}

export default SubjectSwitcher
