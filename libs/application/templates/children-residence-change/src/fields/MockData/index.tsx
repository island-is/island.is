import React, { useState } from 'react'
import { Box, Input, Text, Select } from '@island.is/island-ui/core'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { Item } from 'libs/island-ui/core/src/lib/AsyncSearch/shared/Item/Item'

const parentNationalRegistry = 'mockData.parentNationalRegistry.data'
const childrenNationalRegistry = 'mockData.childrenNationalRegistry.data'

const numberOfChildrenArray = [1, 2, 3, 4, 5]

const parentBDefaults = {
  name: 'Tester Testers',
  address: 'Bólstaðarhlíð',
  postalCode: '105',
  city: 'Reykjavík',
}

const MockData = ({ application }: FieldBaseProps) => {
  const getValue = (id: string) => {
    return getValueViaPath(application.answers, id) as string
  }
  const { setValue, register } = useFormContext()

  const [numberOfChildren, setNumberOfChildren] = useState<number>(
    getValue(childrenNationalRegistry)?.length || 0,
  )
  const numberOfChildenArray = [...Array(numberOfChildren).keys()]
  return (
    <>
      <Box>
        <Text>Parent B</Text>
        <Box marginTop={2}>
          <Controller
            name={`${parentNationalRegistry}.ssn`}
            defaultValue={getValue(`${parentNationalRegistry}.ssn`)}
            render={({ value, onChange }) => {
              return (
                <Input
                  ref={register}
                  id={`${parentNationalRegistry}.ssn`}
                  name={`${parentNationalRegistry}.ssn`}
                  backgroundColor="blue"
                  type="text"
                  label="National id"
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value)
                    setValue(`${parentNationalRegistry}.ssn`, e.target.value)
                  }}
                />
              )
            }}
          />
        </Box>
        <Box marginTop={2}>
          <Controller
            name={`${parentNationalRegistry}.name`}
            defaultValue={
              getValue(`${parentNationalRegistry}.name`) || parentBDefaults.name
            }
            render={({ value, onChange }) => {
              return (
                <Input
                  ref={register}
                  id={`${parentNationalRegistry}.name`}
                  name={`${parentNationalRegistry}.name`}
                  backgroundColor="blue"
                  type="text"
                  label="Name"
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value)
                    setValue(`${parentNationalRegistry}.name`, e.target.value)
                  }}
                />
              )
            }}
          />
        </Box>
        <Box marginTop={2}>
          <Controller
            name={`${parentNationalRegistry}.address`}
            defaultValue={
              getValue(`${parentNationalRegistry}.address`) ||
              parentBDefaults.address
            }
            render={({ value, onChange }) => {
              return (
                <Input
                  ref={register}
                  id={`${parentNationalRegistry}.address`}
                  name={`${parentNationalRegistry}.address`}
                  backgroundColor="blue"
                  type="text"
                  label="Address"
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value)
                    setValue(
                      `${parentNationalRegistry}.address`,
                      e.target.value,
                    )
                  }}
                />
              )
            }}
          />
        </Box>
        <Box marginTop={2}>
          <Controller
            name={`${parentNationalRegistry}.postalCode`}
            defaultValue={
              getValue(`${parentNationalRegistry}.postalCode`) ||
              parentBDefaults.postalCode
            }
            render={({ value, onChange }) => {
              return (
                <Input
                  ref={register}
                  id={`${parentNationalRegistry}.postalCode`}
                  name={`${parentNationalRegistry}.postalCode`}
                  backgroundColor="blue"
                  type="text"
                  label="Postalcode"
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value)
                    setValue(
                      `${parentNationalRegistry}.postalCode`,
                      e.target.value,
                    )
                  }}
                />
              )
            }}
          />
        </Box>
        <Box marginTop={2}>
          <Controller
            name={`${parentNationalRegistry}.city`}
            defaultValue={
              getValue(`${parentNationalRegistry}.city`) || parentBDefaults.city
            }
            render={({ value, onChange }) => {
              return (
                <Input
                  ref={register}
                  id={`${parentNationalRegistry}.city`}
                  name={`${parentNationalRegistry}.city`}
                  backgroundColor="blue"
                  type="text"
                  label="City"
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value)
                    setValue(`${parentNationalRegistry}.city`, e.target.value)
                  }}
                />
              )
            }}
          />
        </Box>
      </Box>

      <Box marginTop={5}>
        <select
          name="numberOfChildren"
          onChange={(e) => setNumberOfChildren(parseInt(e.target.value))}
          defaultValue={numberOfChildren.toString()}
        >
          <option value="0">Select number of children to add</option>
          {numberOfChildrenArray.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            )
          })}
        </select>
      </Box>
      {numberOfChildenArray.map((c) => {
        return (
          <Box key={c} marginTop={3}>
            <Text>Child {c + 1}</Text>
            <Box marginTop={2}>
              <Controller
                name={`${childrenNationalRegistry}[${c}].name`}
                defaultValue={
                  getValue(`${childrenNationalRegistry}[${c}].name`) ||
                  `Child name ${c + 1}`
                }
                render={({ value, onChange }) => {
                  return (
                    <Input
                      ref={register}
                      id={`${childrenNationalRegistry}[${c}].name`}
                      name={`${childrenNationalRegistry}[${c}].name`}
                      backgroundColor="blue"
                      type="text"
                      label={`Name`}
                      value={value}
                      onChange={(e) => {
                        onChange(e.target.value)
                        setValue(
                          `${childrenNationalRegistry}[${c}].name`,
                          e.target.value,
                        )
                      }}
                    />
                  )
                }}
              />
            </Box>
            <Box marginTop={2}>
              <Controller
                name={`${childrenNationalRegistry}[${c}].id`}
                defaultValue={
                  getValue(`${childrenNationalRegistry}[${c}].id`) ||
                  Math.floor(Math.random() * 9000000000) + 1000000000
                }
                render={({ value, onChange }) => {
                  return (
                    <Input
                      ref={register}
                      id={`${childrenNationalRegistry}[${c}].id`}
                      name={`${childrenNationalRegistry}[${c}].id`}
                      backgroundColor="blue"
                      type="text"
                      label={`National id`}
                      value={value}
                      onChange={(e) => {
                        onChange(e.target.value)
                        setValue(
                          `${childrenNationalRegistry}[${c}].id`,
                          e.target.value,
                        )
                      }}
                    />
                  )
                }}
              />
            </Box>
          </Box>
        )
      })}
    </>
  )
}

export default MockData
