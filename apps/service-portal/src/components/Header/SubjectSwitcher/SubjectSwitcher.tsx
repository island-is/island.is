import React, { FC } from 'react'
// eslint-disable-next-line
import useSubjects from 'apps/service-portal/src/hooks/useSubjects/useSubjects'
import { Select, Option } from '@island.is/island-ui/core'

const SubjectSwitcher: FC<{}> = () => {
  const { activeSubjectId, subjectList, setSubject } = useSubjects()
  const options = subjectList.map((subject) => ({
    label: subject.name,
    value: subject.nationalId,
  }))
  const value = options.find((x) => x.value === activeSubjectId)

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
