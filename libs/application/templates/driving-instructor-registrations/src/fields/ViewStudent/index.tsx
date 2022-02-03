import React, { useCallback, useState } from 'react'
import {
  Button,
  Text,
  Box,
  Stack,
  RadioButton,
  Input,
  DatePicker,
  Icon,
} from '@island.is/island-ui/core'
import { viewStudent } from '../mock'
import { Table as T } from '@island.is/island-ui/core'
import { Application } from '@island.is/application/core'
import { minutesOfDriving } from '../../shared/constants'
import format from 'date-fns/format'
import * as styles from '../style.css'
import cn from 'classnames'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface Props {
  application: Application
  studentId: string
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>
}

interface Registration {
  id: string
  date: string
  teacher: string
  time: number
}

const ViewStudent = ({ application, studentId, setShowTable }: Props) => {
  //todo here: query student by the id
  const { formatMessage } = useLocale()
  const [minutes, setMinutes] = useState(30)
  const [date, setDate] = useState<string>('')
  const [newReg, setNewReg] = useState<undefined | Registration>(undefined)
  const [editingRegistration, setEditingRegistration] = useState<
    undefined | Registration
  >(undefined)
  const [dateError, setDateError] = useState(false)

  const goBack = useCallback(() => {
    setShowTable(true)
  }, [setShowTable])

  const saveChanges = () => {
    const newReg = {
      date: date,
      teacher: (application.externalData.nationalRegistry?.data as {
        fullName: string
      })?.fullName,
      time: minutes,
      id: editingRegistration
        ? editingRegistration.id
        : Math.random().toString(),
    }

    console.log(newReg)

    if (editingRegistration) {
      viewStudent.registrations.filter((registration, key) => {
        if (registration.id === editingRegistration.id) {
          viewStudent.registrations[key] = newReg
        }
      })
    } else {
      viewStudent.registrations = [newReg].concat(viewStudent.registrations)
    }

    setNewReg(newReg)
    setEditingRegistration(undefined)
    setDate('')
    setMinutes(30)
  }

  return (
    <Stack space={5}>
      <Box display={'flex'} justifyContent={'spaceBetween'}>
        <Box display={'block'}>
          <Text variant="h4">{formatMessage(m.viewStudentName)}</Text>
          <Text variant="default">{viewStudent.name}</Text>
        </Box>
        <Box display={'block'}>
          <Text variant="h4">{formatMessage(m.viewStudentNationalId)}</Text>
          <Text variant="default">{viewStudent.kt}</Text>
        </Box>
        <Box display={'block'}>
          <Text variant="h4">{formatMessage(m.viewStudentCompleteHours)}</Text>
          <Text variant="default">{viewStudent.hoursDone}</Text>
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'spaceBetween'}>
        <Box display={'block'}>
          <Text variant="h4">
            {formatMessage(m.viewStudentCompleteSchools)}
          </Text>
          <Text variant="default">{viewStudent.schoolsDone}</Text>
        </Box>
        <Box display={'block'}>
          <Text variant="h4">{formatMessage(m.viewStudentExamsComplete)}</Text>
          <Text variant="default">{viewStudent.examsDone}</Text>
        </Box>
      </Box>

      <Box>
        <Text variant="h4">{formatMessage(m.viewStudentRegisterMinutes)}</Text>
        <Box marginTop={2}>
          <Box display="flex" justifyContent="spaceBetween">
            {minutesOfDriving.map((item, index) => {
              return (
                <Box key={'radioButton-' + index}>
                  <RadioButton
                    name={'options-' + index}
                    label={item.label}
                    value={item.value}
                    checked={item.value === minutes}
                    onChange={() => {
                      setMinutes(item.value)
                    }}
                    large
                  />
                </Box>
              )
            })}
            <Box style={{ width: '200px' }}>
              <Input
                label={formatMessage(m.viewStudentSelectDateLabel)}
                type="number"
                name="mínútur"
                placeholder="0"
                onChange={(input) =>
                  setMinutes((input.target.value as unknown) as number)
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box display="flex" justifyContent="spaceBetween">
        <Box display="flex">
          <DatePicker
            hasError={dateError}
            errorMessage="Veldu dagsetningu"
            handleChange={(date) => {
              setDate(format(date, 'yyyy-MM-dd'))
              setDateError(false)
            }}
            label={formatMessage(m.viewStudentSelectDateLabel)}
            locale="is"
            placeholderText={formatMessage(m.viewStudentSelectDatePlaceholder)}
            required
            selected={date ? new Date(date) : null}
          />

          <Box marginLeft={3} display="flex">
            <Button
              onClick={() => (date !== '' ? saveChanges() : setDateError(true))}
            >
              {formatMessage(m.viewStudentSelectRegisterButton)}
            </Button>
          </Box>
        </Box>

        {editingRegistration && (
          <Box>
            <Button
              colorScheme="destructive"
              variant="text"
              icon="trash"
              onClick={() => console.log('todo')}
            >
              {formatMessage(m.viewStudentDeleteRegistration)}
            </Button>
          </Box>
        )}
      </Box>

      <Box>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                {formatMessage(m.viewStudentTableHeaderCol1)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(m.viewStudentTableHeaderCol2)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(m.viewStudentTableHeaderCol3)}
              </T.HeadData>
              <T.HeadData></T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {viewStudent.registrations.map((rgtn, key) => {
              const bgr = cn({
                [`${styles.successBackground}`]:
                  newReg && rgtn.id === newReg.id,
                [`${styles.editingBackground}`]:
                  editingRegistration && rgtn.id === editingRegistration.id,
                [`${styles.transparentBackground}`]:
                  !editingRegistration && !newReg,
              })

              return (
                <T.Row key={key}>
                  <T.Data box={{ className: bgr }}>
                    {format(new Date(rgtn.date), 'dd.MM.yyyy')}
                  </T.Data>
                  <T.Data box={{ className: bgr }}>{rgtn.teacher}</T.Data>
                  <T.Data box={{ className: bgr }}>{rgtn.time}</T.Data>
                  <T.Data box={{ className: bgr }}>
                    <Box display={'flex'}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setEditingRegistration(rgtn)
                          setMinutes(rgtn.time)
                          setDate(rgtn.date)
                        }}
                      >
                        {formatMessage(m.viewStudentEditRegistration)}
                      </Button>
                      {newReg && rgtn.id === newReg.id && (
                        <Box paddingLeft={3} className={styles.showSuccessIcon}>
                          <Icon icon="checkmarkCircle" color="mint400" />
                        </Box>
                      )}
                    </Box>
                  </T.Data>
                </T.Row>
              )
            })}
          </T.Body>
        </T.Table>
      </Box>

      <Box marginY={5}>
        <Button variant="ghost" preTextIcon="arrowBack" onClick={goBack}>
          {formatMessage(m.viewStudentGoBackToOverviewButton)}
        </Button>
      </Box>
    </Stack>
  )
}

export default ViewStudent
