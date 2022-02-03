import React, { useState, useCallback } from 'react'
import { Box, ModalBase, Button, Text, Input } from '@island.is/island-ui/core'
import { Application } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import * as styles from '../style.css'

interface FindStudentsModalProps {
  application?: Application
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>
  setStudentId: React.Dispatch<React.SetStateAction<string>>
}

const FindStudentModal = ({
  setShowTable,
  setStudentId,
}: FindStudentsModalProps) => {
  const { formatMessage } = useLocale()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [findStudentById, setFindStudentById] = useState('')

  const viewStudent = useCallback(() => {
    setShowTable(false)
    setStudentId(findStudentById)
  }, [setShowTable, setStudentId])

  return (
    <Box
      width="half"
      display={'flex'}
      justifyContent={'flexEnd'}
      alignItems={'flexEnd'}
    >
      <Box display={'flex'} justifyContent={'center'}>
        <ModalBase
          isVisible={isModalOpen}
          baseId="myDialog"
          disclosure={
            <Box paddingBottom={1}>
              <Button
                size="small"
                variant="text"
                onClick={() => setIsModalOpen(true)}
              >
                {formatMessage(m.studentsOverviewRegisterHoursForOtherStudent)}
              </Button>
            </Box>
          }
          className={styles.modalStyle}
        >
          <Box padding={10} style={{ background: 'white' }}>
            <Text>{formatMessage(m.studentsOverviewOtherStudentIdInput)}</Text>
            <Box marginY={3}>
              <Input
                type="number"
                label={formatMessage(m.studentsOverviewOtherStudentInputLabel)}
                name="search_student"
                backgroundColor="blue"
                size="sm"
                onBlur={(v) => {
                  setFindStudentById(v.target.value)
                }}
              />
            </Box>
            <Button
              variant="text"
              onClick={() => {
                viewStudent()
                setIsModalOpen(false)
              }}
            >
              {formatMessage(m.studentsOverviewRegisterHoursButton)}
            </Button>
          </Box>
        </ModalBase>
      </Box>
    </Box>
  )
}

export default FindStudentModal
