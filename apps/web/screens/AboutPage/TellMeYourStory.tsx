import * as React from 'react'
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
  GridColumn,
  Hidden,
} from '@island.is/island-ui/core'
import * as styles from './TellMeYourStory.treat'
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

interface Props {
  onSubmit: (data) => void
}

export const TellMeYourStory: React.FC<Props> = ({ onSubmit }) => {
  const methods = useForm()
  const { handleSubmit, register, control, errors } = methods
  const errorMessage = 'Þennan reit þarf að fylla út'
  return (
    <Box>
      <Box padding={[3, 3, 8]}>
        <GridRow>
          <GridColumn span={['10/10', '10/10', '6/10', '6/10']}>
            <Text as="h1" variant="h1" lineHeight={'lg'}>
              {'Segðu okkur þína sögu'}
            </Text>
            <Text>
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
            span={[null, null, '3/10', '3/10']}
            offset={[null, null, '1/10', '1/10']}
          >
            <Hidden below="md">
              <Box className={styles.topImage}>
                <BackgroundImage ratio="1:1" image={topImage} />
              </Box>
            </Hidden>
          </GridColumn>
        </GridRow>
      </Box>

      <Box padding={[3, 3, 8]} background={'blue100'}>
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
                  control={control}
                  defaultValue={false}
                  rules={{ required: true }}
                  render={({ onChange }) => (
                    <Select
                      label="Stofnun"
                      name="organization"
                      hasError={errors.organization}
                      errorMessage={errors.organization ? errorMessage : null}
                      placeholder="Veldu stofnun sem leitað var til"
                      options={[
                        { label: 'Stofnun 1', value: 'Stofnun 1' },
                        { label: 'Stofnun 2', value: 'Stofnun 2' },
                        { label: 'Stofnun 3', value: 'Stofnun 3' },
                      ]}
                      onChange={onChange}
                    />
                  )}
                />
              </GridColumn>
              <GridColumn
                span={['10/10', '10/10', '10/10', '5/10']}
                paddingTop={[3, 3, 3, 0]}
              >
                <Controller
                  name="date"
                  control={control}
                  defaultValue={false}
                  rules={{ required: true }}
                  render={({ onChange, value }) => (
                    <DatePicker
                      label="Dagssetning"
                      placeholderText="Hvenær var þetta?"
                      locale="is"
                      selected={value}
                      required
                      hasError={errors.date}
                      errorMessage={errors.date ? errorMessage : null}
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
              <GridColumn span={['10/10', '10/10', '10/10', '6/10']}>
                <GridRow>
                  <GridColumn span={'10/10'}>
                    <Stack space={3}>
                      <Input
                        label="Fyrirsögn"
                        name="subject"
                        placeholder="Titillinn á sögunni"
                        ref={register({
                          required: false,
                        })}
                      />
                      <Input
                        label="Sagan"
                        name="story"
                        rows={8}
                        placeholder="[spurning um að hafa eitthvað leiðandi/leiðbeinandi hérna sem hjálpar fólki að ramma inn söguna ]"
                        textarea
                        required
                        errorMessage={errors.story?.message}
                        ref={register({
                          required: errorMessage,
                        })}
                      />
                    </Stack>
                  </GridColumn>
                </GridRow>
              </GridColumn>
              <GridColumn
                span={['10/10', '10/10', '10/10', '3/10']}
                offset={[null, null, null, '1/10']}
              >
                <GridRow>
                  <GridColumn
                    span={['2/10', '3/10', '4/10', '10/10']}
                    paddingTop={3}
                    paddingBottom={3}
                  >
                    <Box className={styles.contentImage}>
                      {' '}
                      <BackgroundImage ratio="1:1" image={contentImage} />
                    </Box>
                  </GridColumn>
                  <GridColumn
                    span={['8/10', '7/10', '6/10', '10/10']}
                    className={styles.alignSelfCenter}
                  >
                    <Text
                      as="h4"
                      variant="h4"
                      color="blue600"
                      lineHeight={'lg'}
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
              <GridColumn span={'10/10'} paddingBottom={3}>
                <Text as="h3" variant="h3" color="blue600">
                  {'Upplýsingar'}
                </Text>
              </GridColumn>
              <GridColumn
                span={['10/10', '10/10', '10/10', '5/10']}
                paddingBottom={3}
              >
                <Input
                  label="Fullt nafn"
                  name="name"
                  required
                  placeholder="Nafnið þitt"
                  ref={register({
                    required: errorMessage,
                  })}
                  errorMessage={errors.name?.message}
                />
              </GridColumn>

              <GridColumn
                span={['10/10', '10/10', '10/10', '5/10']}
                paddingBottom={3}
              >
                <Input
                  label="Netfang"
                  name="email"
                  required
                  errorMessage={errors.email?.message}
                  placeholder="Svo við getum haft samband"
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
              name="checkbox"
              control={control}
              defaultValue={false}
              rules={{ required: false }}
              render={(props) => (
                <Checkbox
                  onChange={(e) => props.onChange(e.target.checked)}
                  checked={props.value}
                  label="Ég gef leyfi fyrir notkun sögunnar (nafnlaust) til að kynna lausnir, bæta þjónustu og til birtingar á Ísland.is"
                />
              )}
            />
            <GridRow className={styles.justifyContentFlexEnd}>
              <Button htmlType="submit">{'Senda sögu'}</Button>
            </GridRow>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}
