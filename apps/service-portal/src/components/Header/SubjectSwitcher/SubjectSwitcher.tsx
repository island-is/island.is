import React, { FC } from 'react'
// eslint-disable-next-line
import useSubjects from 'apps/service-portal/src/hooks/useSubjects/useSubjects'
import { Select, Option } from '@island.is/island-ui/core'
// eslint-disable-next-line
import { useStore } from 'apps/service-portal/src/stateProvider'

const SubjectSwitcher: FC<{}> = () => {
  const [{ userInfo }] = useStore()
  const { subjectList, subjectListState, setSubject } = useSubjects()
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
        setSubject((option as Option).value.toString())
      }}
    />
  )
}

export default SubjectSwitcher
