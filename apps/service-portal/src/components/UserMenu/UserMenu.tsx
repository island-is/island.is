import React, { FC, useState, useRef } from 'react'
import * as styles from './UserMenu.treat'
import { useHistory } from 'react-router-dom'
import { useStore } from '../../store/stateProvider'
import useSubjects from '../../hooks/useSubjects/useSubjects'
import { Box, Button } from '@island.is/island-ui/core'
import Menu from './Menu/Menu'
import useOutsideClick from '../../hooks/useOutsideClick/useOutsideClick'

const UserMenu: FC<{}> = () => {
  const ref = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const history = useHistory()
  const [{ userInfo }] = useStore()
  const { subjectList } = useSubjects()

  useOutsideClick(ref, () => setIsOpen(false))

  const handleSelection = async (subjectNationalId: string) => {
    setIsOpen(false)
    //await setUser(userInfo.actor.nationalId, subjectNationalId)
    history.push('/')
  }

  return (
    <Box position="relative" height="full" ref={ref} className={styles.wrapper}>
      <Button
        variant="menu"
        width="fluid"
        href=""
        onClick={setIsOpen.bind(null, !isOpen)}
        leftImage="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
        icon="cheveron"
      >
        Atli Guðlaugsson
      </Button>
      <Menu
        isOpen={isOpen}
        userInfo={userInfo}
        onSubjectSelection={handleSelection}
        subjectList={subjectList}
        onCloseMenu={setIsOpen.bind(null, false)}
      />
    </Box>
  )
}

export default UserMenu
