import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridRow,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

const Review: FC<FieldBaseProps> = ({ field, application }) => {
  const { description } = field
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  console.log(application)
  console.log(getValueViaPath(application.answers, 'applicant'))

  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box marginTop={[4, 4, 8]} marginBottom={[0, 0, 6]}>
        <Accordion singleExpand={false}>
          <AccordionItem id="id_1" label="Your contact information">
            <Box paddingY={1}>
              <Stack space={6}>
                <Stack space={2}>
                  <GridRow>
                    <GridColumn span="6/12">
                      <Input
                        id={'applicant.name'}
                        name={'applicant.name'}
                        label={'Full name'}
                        ref={register}
                        disabled
                      />
                    </GridColumn>
                    <GridColumn span="6/12">
                      <Input
                        id={'applicant.nationalId'}
                        name={'applicant.nationalId'}
                        label={'Icelandic ID number'}
                        ref={register}
                        disabled
                      />
                    </GridColumn>
                  </GridRow>
                  <GridRow>
                    <GridColumn span="6/12">
                      <Input
                        id={'applicant.address'}
                        name={'applicant.address'}
                        label={'Address'}
                        ref={register}
                        disabled
                      />
                    </GridColumn>
                    <GridColumn span="6/12">
                      <Input
                        id={'applicant.postalCode'}
                        name={'applicant.postalCode'}
                        label={'Postal code'}
                        ref={register}
                        disabled
                      />
                    </GridColumn>
                  </GridRow>
                  <GridRow>
                    <GridColumn span="6/12">
                      <Input
                        id={'applicant.city'}
                        name={'applicant.city'}
                        label={'City'}
                        ref={register}
                        disabled
                      />
                    </GridColumn>
                    <GridColumn span="6/12">
                      <Input
                        id={'applicant.nationality'}
                        name={'applicant.nationality'}
                        label={'Nationality'}
                        ref={register}
                        disabled
                      />
                    </GridColumn>
                  </GridRow>
                  <Text>
                    Need to update your address?{' '}
                    <a href="./">Go to Change of Address</a>
                  </Text>
                </Stack>
                <Stack space={2}>
                  <GridRow>
                    <GridColumn span="6/12">
                      <Input
                        id={'applicant.email'}
                        name={'applicant.email'}
                        label={'E-mail'}
                        ref={register}
                      />
                    </GridColumn>
                    <GridColumn span="6/12">
                      <Input
                        id={'applicant.phoneNumber'}
                        name={'applicant.phoneNumber'}
                        label={'Phone number'}
                        ref={register}
                      />
                    </GridColumn>
                  </GridRow>
                  <Text>
                    Please edit if not correct. This will update your contact
                    info for all of island.is
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </AccordionItem>
          <AccordionItem id="id_2" label="Status and children">
            <Box></Box>
          </AccordionItem>
          <AccordionItem id="id_2" label="Former country of insurance">
            <Box></Box>
          </AccordionItem>
        </Accordion>
      </Box>
    </div>
  )
}

export default Review
