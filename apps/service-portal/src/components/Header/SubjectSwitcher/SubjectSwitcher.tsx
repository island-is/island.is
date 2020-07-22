import React, { FC } from 'react'
// eslint-disable-next-line
import useSubjects from 'apps/service-portal/src/hooks/useSubjects/useSubjects'
import { Select, Option } from '@island.is/island-ui/core'
// eslint-disable-next-line
import { useStore } from 'apps/service-portal/src/stateProvider'
import useUserInfo from '../../../hooks/useUserInfo/useUserInfo'
import { ValueType } from 'react-select'
import { useHistory } from 'react-router-dom'

const SubjectSwitcher: FC<{}> = () => {
  const history = useHistory()
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

  const handleSelection = async (option: ValueType<Option>) => {
    await setUser(
      userInfo.actor.nationalId,
      (option as Option).value.toString(),
    )
    history.push('/')
  }

  return (
    <Select
      name="Veldu einstakling eða fyrirtæki"
      value={value}
      options={options}
      onChange={handleSelection}
    />
  )
}

export default SubjectSwitcher
