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

interface PropTypes {
  closeModal: () => void
  nameData?: IcelandicNameInputs
}

interface IcelandicNameInputs {
  id?: number
  icelandicName: string
  type: string
  status: string
  description?: null | string
  verdict?: Date | string | null
  url?: null | string
  visible: boolean
}

const NameTypes = {
  ST: 'Stúlkunafn',
  DR: 'Drengjanafn',
  MI: 'Millinafn',
  RST: 'Ritbreytt stúlkunafn',
  RDR: 'Ritbreytt drengjanafn',
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

const today = new Date()

const initialNameData: IcelandicNameInputs = {
  icelandicName: '',
  type: '',
  status: '',
  description: null,
  url: null,
  verdict: null,
  visible: true,
}

const EditForm: React.FC<PropTypes> = ({
  closeModal,
  nameData = initialNameData,
}) => {
  const hookFormData = useForm<IcelandicNameInputs>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: nameData,
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

  const isAdding = Boolean(nameData.id)

  console.log(!isAdding ? 'Adding new new' : 'Updating name', nameData.id)

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const onSubmit = async (data: IcelandicNameInputs, e: any) => {
    console.log('data', data, e)

    let dateString = null

    if (data.verdict) {
      dateString = format(new Date(data.verdict), 'dd.MM.yyyy')
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
                <Text variant="h1">
                  {!isAdding
                    ? 'Skráning íslensks nafns'
                    : 'Breyta íslensku nafni'}
                </Text>
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
                        value={value ?? ''}
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
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        {...register('url', {
                          validate: (x) => {
                            if (
                              x &&
                              !x.match(
                                /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/i,
                              )
                            ) {
                              return 'Vefslóð virðist ekki vera á réttu formi'
                            }
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
