import React, { useState, useCallback, useEffect } from 'react'
import { Box, ModalBase, Button, Text } from '@island.is/island-ui/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import * as styles from '../style.css'
import { FindStudentQuery } from '../../graphql/queries'
import { useQuery } from '@apollo/client'
import { InputController } from '@island.is/shared/form-fields'
import * as kennitala from 'kennitala'

interface FindStudentsModalProps {
  application?: Application
  setShowStudentOverview: React.Dispatch<React.SetStateAction<boolean>>
  setStudentId: React.Dispatch<React.SetStateAction<string>>
}

const FindStudentModal = ({
  setShowStudentOverview,
  setStudentId,
}: FindStudentsModalProps) => {
  const { formatMessage } = useLocale()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [studentNationalId, setStudentNationalId] = useState('')
  const [studentNotFoundError, setStudentNotFoundError] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const { data: findStudent, loading: findingStudent } = useQuery(
    FindStudentQuery,
    {
      variables: {
        input: {
          key: studentNationalId,
          licenseCategory: 'B',
          cursor: '',
          limit: 100,
        },
      },
      notifyOnNetworkStatusChange: true,
      skip: !isSearching,
    },
  )

  const viewStudent = useCallback(
    (id: string) => {
      setShowStudentOverview(false)
      setStudentId(id)
    },

    [setShowStudentOverview, setStudentId],
  )

  useEffect(() => {
    if (isSearching && findStudent) {
      if (findStudent.drivingLicenseBookFindStudentForTeacher.length) {
        viewStudent(studentNationalId)
        setIsModalOpen(false)
      } else {
        setStudentNotFoundError(true)
      }

      setIsSearching(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching, findStudent])

  return (
    <Box
      marginTop={3}
      display="flex"
      justifyContent="flexEnd"
      alignItems="flexEnd"
    >
      <Box display="flex" justifyContent={['flexEnd', 'center', 'center']}>
        <ModalBase
          isVisible={isModalOpen}
          baseId="myDialog"
          disclosure={
            <Box paddingBottom={1}>
              <Button
                size="small"
                variant="text"
                preTextIcon="pencil"
                onClick={() => setIsModalOpen(true)}
              >
                {formatMessage(m.studentsOverviewRegisterHoursForOtherStudent)}
              </Button>
            </Box>
          }
          className={styles.modalStyle}
        >
          <Box padding={[5, 5, 10]}>
            <Text variant="h1">
              {formatMessage(m.studentsOverviewOtherStudentIdModalTitle)}
            </Text>
            <Text variant="default" marginTop={2}>
              {formatMessage(m.studentsOverviewOtherStudentIdModalDescription)}
            </Text>
            <Box marginTop={5} marginBottom={7}>
              <InputController
                id="nationalId"
                label={formatMessage(m.studentsOverviewOtherStudentInputLabel)}
                format="######-####"
                backgroundColor="blue"
                size="sm"
                onChange={(v) =>
                  setStudentNationalId(v.target.value.replace(/\W/g, ''))
                }
                error={
                  studentNotFoundError
                    ? formatMessage(m.studentsOverviewNoStudentFoundInModal)
                    : undefined
                }
              />
            </Box>
            <Box display="flex" justifyContent="spaceBetween">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsModalOpen(false)
                }}
              >
                {formatMessage(m.studentsOverviewRegisterHoursCancelButton)}
              </Button>
              <Button
                variant="primary"
                loading={findingStudent}
                disabled={!kennitala.isValid(studentNationalId)}
                onClick={() => {
                  setIsSearching(true)
                }}
              >
                {formatMessage(m.studentsOverviewOtherStudentRegisterButton)}
              </Button>
            </Box>
          </Box>
        </ModalBase>
      </Box>
    </Box>
  )
}

export default FindStudentModal
