import React from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { format } from 'date-fns' // eslint-disable-line no-restricted-imports

import {
  Box,
  Text,
  Divider,
  Button,
  Input,
  Select,
  Checkbox,
  GridRow,
  Option,
  GridContainer,
  DatePicker,
  GridColumn,
} from '@island.is/island-ui/core'

import * as styles from './EditForm.treat'
import { ActionMeta, ValueType } from 'react-select'

interface PropTypes {
  closeModal: () => void
}

const NameTypes = {
  ST: 'Stúlkunafn',
  DR: 'Drengjanafn',
  MI: 'Miðjunafn',
  RST: 'RST (?)',
  RDR: 'RDR (?)',
} as { [key: string]: string }

const StatusTypes = {
  Haf: 'Hafnað',
  Sam: 'Samþykkt',
  Óaf: 'Óafgreitt',
} as { [key: string]: string }

export const nameTypeOptions = Object.keys(NameTypes).map((x: string) => {
  return {
    label: NameTypes[x],
    value: x,
  }
})

export const statusTypeOptions = Object.keys(StatusTypes).map((x: string) => {
  return {
    label: StatusTypes[x],
    value: x,
  }
})

const spacing = 3

interface IFormInputs {
  icelandicName: string
  type: string
  status: string
  description?: string
  url?: string
  verdict?: Date | null
  visible: boolean
}

const today = new Date()

const EditForm: React.FC<PropTypes> = ({ closeModal }) => {
  const hookFormData = useForm<IFormInputs>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      icelandicName: '',
      type: '',
      status: '',
      description: '',
      url: '',
      verdict: null,
      visible: true,
    },
    shouldFocusError: true,
  })

  const {
    setValue,
    register,
    handleSubmit,
    control,
    errors,
    formState: { isDirty, isSubmitting, touched, submitCount },
  } = hookFormData

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const onSubmit = async (data: IFormInputs, e: any) => {
    console.log('data', data, e)

    let dateString = null

    if (data.verdict) {
      dateString = format(data.verdict, 'dd.MM.yyyy')
    }

    const submitData = {
      ...data,
      verdict: dateString,
    }

    console.log(submitData)
    await sleep(2000)
  }

  const onError = (errors: object, e: any) => console.log(errors, e)

  console.log('errors', errors)

  const inputsDisabled = isSubmitting

  return (
    <FormProvider {...hookFormData}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
          paddingX={[1, 4, 4, 8]}
          paddingY={[6, 6, 6, 12]}
          paddingBottom={6}
        >
          <GridContainer position="none">
            <GridRow>
              <GridColumn span={'12/12'} paddingBottom={6}>
                <Text variant="h1">Skráning íslensks nafns</Text>
              </GridColumn>
            </GridRow>

            <GridRow>
              <GridColumn span={'12/12'} paddingBottom={spacing}>
                <Controller
                  name="icelandicName"
                  render={({ onChange, value, name }) => (
                    <Input
                      name={name}
                      label="Nafn"
                      placeholder="Nafn"
                      size="md"
                      errorMessage={errors?.icelandicName?.message}
                      backgroundColor="blue"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      {...register('icelandicName', {
                        required: 'Nafn vantar',
                        pattern: {
                          value: /^\S*$/i,
                          message: 'Nafn má ekki innihalda bil',
                        },
                      })}
                      disabled={inputsDisabled}
                    />
                  )}
                />
              </GridColumn>
            </GridRow>

            <GridRow>
              <GridColumn
                span={['12/12', '12/12', '6/12']}
                paddingBottom={spacing}
              >
                <Controller
                  name="type"
                  render={({ onChange, value, name }) => {
                    return (
                      <Select
                        name={name}
                        options={nameTypeOptions}
                        label="Tegund nafns"
                        placeholder="Veldu tegund"
                        value={nameTypeOptions.find(
                          (option) => option.value === value,
                        )}
                        onChange={(option) =>
                          onChange(String((option as Option).value))
                        }
                        size="sm"
                        hasError={Boolean(errors?.type?.message)}
                        errorMessage={errors?.type?.message}
                        backgroundColor="blue"
                        {...register('type', {
                          required: 'Tegund nafns vantar',
                        })}
                        disabled={inputsDisabled}
                        required
                      />
                    )
                  }}
                />
              </GridColumn>
              <GridColumn
                span={['12/12', '12/12', '6/12']}
                paddingBottom={spacing}
              >
                <Controller
                  name="status"
                  render={({ onChange, value, name }) => {
                    return (
                      <Select
                        name={name}
                        options={statusTypeOptions}
                        label="Staða"
                        placeholder="Veldu stöðu"
                        value={statusTypeOptions.find(
                          (option) => option.value === value,
                        )}
                        onChange={(option) =>
                          onChange(String((option as Option).value))
                        }
                        size="sm"
                        hasError={Boolean(errors?.status?.message)}
                        errorMessage={errors?.status?.message}
                        backgroundColor="blue"
                        {...register('status', {
                          required: 'Stöðu nafns vantar',
                        })}
                        disabled={inputsDisabled}
                        required
                      />
                    )
                  }}
                />
              </GridColumn>
            </GridRow>

            <GridRow marginTop={3}>
              <GridColumn span={'12/12'} paddingBottom={spacing}>
                <Controller
                  name="description"
                  render={({ onChange, value, name }) => {
                    return (
                      <Input
                        name={name}
                        label="Skýring"
                        size="sm"
                        backgroundColor="blue"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        {...register('description')}
                        disabled={inputsDisabled}
                        textarea
                      />
                    )
                  }}
                />
              </GridColumn>
            </GridRow>

            <GridRow marginTop={3}>
              <GridColumn span={'12/12'} paddingBottom={spacing}>
                <Controller
                  name="url"
                  render={({ onChange, value, name }) => {
                    return (
                      <Input
                        name={name}
                        label="Vefslóð á úrskurð"
                        placeholder="Vefslóð á úrskurð mannanafnanefndar"
                        size="sm"
                        onChange={(e) => onChange(e.target.value)}
                        {...register('url', {
                          pattern: {
                            value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/i,
                            message: 'Vefslóð virðist ekki vera á réttu formi',
                          },
                        })}
                        errorMessage={errors?.url?.message ?? ''}
                        disabled={inputsDisabled}
                        backgroundColor="blue"
                      />
                    )
                  }}
                />
              </GridColumn>

              <GridColumn span={'6/12'} paddingBottom={spacing}>
                <Controller
                  name="verdict"
                  render={({ onChange, value, name }) => {
                    return (
                      <DatePicker
                        name={name}
                        backgroundColor="white"
                        handleChange={onChange}
                        icon="calendar"
                        iconType="outline"
                        label="Dagsetning úrskurðar"
                        locale="is"
                        disabled={inputsDisabled}
                        selected={value ?? undefined}
                        {...register('verdict')}
                        placeholderText="Veldu dagsetningu"
                        minYear={today.getFullYear() - 100}
                        maxYear={today.getFullYear()}
                        size="md"
                      />
                    )
                  }}
                />
              </GridColumn>
            </GridRow>

            <GridRow marginTop={3}>
              <GridColumn span={'12/12'} paddingBottom={spacing}>
                <Controller
                  name="visible"
                  control={control}
                  render={({ onChange, value }) => {
                    return (
                      <Checkbox
                        name="visible"
                        label="Birta nafn á ísland.is"
                        onChange={(e) => {
                          const isChecked = Boolean(e.target.checked)
                          setValue('visible', isChecked)
                          onChange(isChecked)
                        }}
                        checked={value}
                        backgroundColor="white"
                        disabled={inputsDisabled}
                        large
                      />
                    )
                  }}
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>

        <Divider weight="blueberry200" />

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
          paddingX={[1, 4, 4, 8]}
          paddingTop={6}
          paddingBottom={3}
        >
          <GridContainer position="none">
            <GridRow>
              <GridColumn span={'6/12'} paddingBottom={3}>
                <Box>
                  <Button
                    onClick={closeModal}
                    variant="ghost"
                    colorScheme="destructive"
                    disabled={inputsDisabled}
                  >
                    Hætta við
                  </Button>
                </Box>
              </GridColumn>
              <GridColumn span={'6/12'} paddingBottom={3}>
                <Box display="flex" justifyContent="flexEnd" width="full">
                  <Button
                    type="submit"
                    icon="checkmark"
                    loading={isSubmitting}
                    iconType="outline"
                    disabled={inputsDisabled}
                  >
                    Skrá nafn
                  </Button>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </form>
    </FormProvider>
  )
}

export default EditForm
