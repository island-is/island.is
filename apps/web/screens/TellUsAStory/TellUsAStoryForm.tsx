import React, { useEffect } from 'react'
import {
  Text,
  Box,
  Input,
  ButtonDeprecated as Button,
  Select,
  DatePicker,
  Stack,
  Checkbox,
  GridRow,
  GridContainer,
  GridColumn,
  Hidden,
  Option,
  ToastContainer,
  toast,
} from '@island.is/island-ui/core'
import * as styles from './TellUsAStoryFrom.treat'
import { Image } from '@island.is/api/schema'
import { BackgroundImage } from '@island.is/web/components'
import { useForm, Controller } from 'react-hook-form'

const topImage: Image = {
  typename: 'Image',
  id: 'id1',
  url:
    'https://images.ctfassets.net/8k0h54kbe6bj/3lNpEzR0oURCX7tYIQjJTa/835f6bc23172615d221e6a6e3a135284/man_with_stroller.png',
  title: 'topImg',
  contentType: 'image',
  width: 432,
  height: 445,
}

const contentImage: Image = {
  typename: 'Image',
  id: 'id2',
  url:
    'https://images.ctfassets.net/8k0h54kbe6bj/3lNpEzR0oURCX7tYIQjJTa/835f6bc23172615d221e6a6e3a135284/man_with_stroller.png',
  title: 'contentImage',
  contentType: 'image',
  width: 185,
  height: 220,
}

export interface TellUsAStoryFormState {
  organization: string
  dateOfStory: string
  subject?: string
  message: string
  name: string
  email: string
  publicationAllowed: boolean
}
type FormState = 'edit' | 'submitting' | 'error' | 'success'

export interface TellUsAStoryFormProps {
  state: FormState
  onSubmit: (formState: TellUsAStoryFormState) => Promise<void>
}

export const TellUsAStoryForm: React.FC<TellUsAStoryFormProps> = ({
  state = 'edit',
  onSubmit,
}) => {
  const methods = useForm()
  const { handleSubmit, register, control, errors, reset } = methods
  const errorMessage = 'Þennan reit þarf að fylla út'

  useEffect(() => {
    if (state === 'error') {
      toast.error('Eitthvað fór úrskeiðis')
    }
  }, [state])

  return (
    <GridContainer>
      <Box paddingX={[0, 0, 3, 8]} paddingBottom={8}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12', '7/12']}>
            <Text
              as="h1"
              variant="h1"
              lineHeight={'lg'}
              paddingBottom={[2, 3, 4]}
            >
              {'Segðu okkur þína sögu'}
            </Text>
            <Text paddingBottom={2}>
              {
                'Við vinnum að því að auðvelda aðgengi að þjónustu hins opinbera með stafrænum lausnum. Í dag getur fólk þurft að [keyra á milli með pappíra o.s.frv., bara smá inngangur].'
              }
            </Text>
            <Text>
              {
                'Hefur þú þurft að sækja um fæðingarorlof, endurnýja vegabréfið eða opna veitingastað? Segðu okkur frá því hvernig var að sækja þjónustu hins opinbera á gamla mátann.'
              }
            </Text>
          </GridColumn>
          <GridColumn
            span={[null, null, '5/12', '4/12']}
            offset={[null, null, '1/12', '1/12']}
            className={styles.infoImageWrapper}
          >
            <Box className={styles.infoImage}>
              <Hidden below="md">
                <BackgroundImage ratio="1:1" image={topImage} />
              </Hidden>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>

      <Box padding={[3, 3, 8]} background={'blue100'}>
        {state !== 'success' ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack space={5}>
              <GridRow>
                <GridColumn span={'10/10'} paddingBottom={3}>
                  <Text as="h3" variant="h3" color="blue600">
                    {'Hvar og hvenær?'}
                  </Text>
                </GridColumn>
                <GridColumn span={['10/10', '10/10', '10/10', '5/10']}>
                  <Controller
                    name="organization"
                    defaultValue={{
                      label: '',
                      value: '',
                    }}
                    control={control}
                    rules={{ required: true }}
                    render={({ onChange }) => (
                      <Select
                        name="organization"
                        label="Stofnun"
                        placeholder="Veldu stofnun sem leitað var til"
                        options={[
                          { label: 'Stofnun 1', value: 'Stofnun 1' },
                          { label: 'Stofnun 2', value: 'Stofnun 2' },
                          { label: 'Stofnun 3', value: 'Stofnun 3' },
                        ]}
                        errorMessage={errors.organization ? errorMessage : null}
                        hasError={errors.organization}
                        disabled={state === 'submitting'}
                        onChange={({ value }: Option) => {
                          onChange(value)
                        }}
                      />
                    )}
                  />
                </GridColumn>
                <GridColumn
                  span={['10/10', '10/10', '10/10', '5/10']}
                  paddingTop={[3, 3, 3, 0]}
                >
                  <Controller
                    name="dateOfStory"
                    defaultValue={false}
                    control={control}
                    rules={{ required: true }}
                    render={({ onChange, value }) => (
                      <DatePicker
                        label="Dagssetning"
                        placeholderText="Hvenær var þetta?"
                        locale="is"
                        selected={value}
                        required
                        errorMessage={errors.dateOfStory ? errorMessage : null}
                        hasError={errors.dateOfStory}
                        disabled={state === 'submitting'}
                        handleChange={onChange}
                      />
                    )}
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={'10/10'} paddingBottom={3}>
                  <Text as="h3" variant="h3" color="blue600">
                    {'Sagan'}
                  </Text>
                </GridColumn>
                <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
                  <GridRow>
                    <GridColumn span={'12/12'}>
                      <Stack space={3}>
                        <Input
                          name="subject"
                          label="Fyrirsögn"
                          placeholder="Titillinn á sögunni"
                          defaultValue=""
                          disabled={state === 'submitting'}
                          ref={register({
                            required: false,
                          })}
                        />
                        <Input
                          name="message"
                          label="Sagan"
                          placeholder="[spurning um að hafa eitthvað leiðandi/leiðbeinandi hérna sem hjálpar fólki að ramma inn söguna ]"
                          defaultValue=""
                          textarea
                          rows={8}
                          required
                          errorMessage={errors.message?.message}
                          disabled={state === 'submitting'}
                          ref={register({
                            required: errorMessage,
                          })}
                        />
                      </Stack>
                    </GridColumn>
                  </GridRow>
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '12/12', '4/12']}
                  offset={[null, null, null, '1/12']}
                  paddingTop={[4, 4, 4, 0]}
                  paddingBottom={3}
                >
                  <GridRow>
                    <GridColumn
                      span={['5/12', '4/12', '5/12', '12/12', '12/12']}
                      className={styles.alignSelfCenter}
                      paddingBottom={2}
                    >
                      <Box className={styles.contentImage}>
                        <BackgroundImage ratio="1:1" image={contentImage} />
                      </Box>
                    </GridColumn>
                    <GridColumn
                      span={['7/12', '8/12', '7/12', '12/12', '12/12']}
                      className={styles.alignSelfCenter}
                    >
                      <Text
                        as="h4"
                        variant="h4"
                        color="blue600"
                        paddingBottom={1}
                      >
                        {'Tillaga að uppbyggingu'}
                      </Text>
                      <Text variant="small" color="blue600">
                        {
                          '[Hér væri hægt að hafa tillögu að uppbyggingu til að auðvelda fólki að koma hlutunum frá sér. Svona upphaf, miðju og endi. Jafnvel bara bullet-lista.]'
                        }
                      </Text>{' '}
                    </GridColumn>
                  </GridRow>
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn span={'12/12'} paddingBottom={3}>
                  <Text as="h3" variant="h3" color="blue600">
                    {'Upplýsingar'}
                  </Text>
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '12/12', '6/12']}
                  paddingBottom={3}
                >
                  <Input
                    name="name"
                    label="Fullt nafn"
                    placeholder="Nafnið þitt"
                    defaultValue=""
                    required
                    errorMessage={errors.name?.message}
                    disabled={state === 'submitting'}
                    ref={register({
                      required: errorMessage,
                    })}
                  />
                </GridColumn>

                <GridColumn
                  span={['12/12', '12/12', '12/12', '6/12']}
                  paddingBottom={3}
                >
                  <Input
                    name="email"
                    label="Netfang"
                    placeholder="Svo við getum haft samband"
                    defaultValue=""
                    required
                    errorMessage={errors.email?.message}
                    disabled={state === 'submitting'}
                    ref={register({
                      required: errorMessage,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Sláðu inn gilt tölvupóstfang',
                      },
                    })}
                  />
                </GridColumn>
              </GridRow>

              <Controller
                name="publicationAllowed"
                defaultValue={false}
                control={control}
                rules={{ required: false }}
                render={(props) => (
                  <Checkbox
                    label="Ég gef leyfi fyrir notkun sögunnar (nafnlaust) til að kynna lausnir, bæta þjónustu og til birtingar á Ísland.is"
                    checked={props.value}
                    disabled={state === 'submitting'}
                    onChange={(e) => props.onChange(e.target.checked)}
                  />
                )}
              />
              <GridRow className={styles.justifyContentFlexEnd}>
                <Button htmlType="submit" loading={state === 'submitting'}>
                  {'Senda sögu'}
                </Button>
              </GridRow>
            </Stack>
          </form>
        ) : (
          <Box paddingTop={[2, 4, 6, 12]} paddingBottom={[3, 6, 8, 20]}>
            <Text variant="h2" as="h2" paddingBottom={2}>
              {'Takk fyrir að senda okkur sögu'}
            </Text>
            <Text paddingBottom={3}>
              {
                'Eru skilaboð hér um að einhver muni hafa samband ef sagan verður valin til birtingar á vefnum?'
              }
            </Text>
          </Box>
        )}
      </Box>
      <ToastContainer
        hideProgressBar={true}
        closeButton={true}
        useKeyframeStyles={false}
      />
    </GridContainer>
  )
}
