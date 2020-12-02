import React, { FC } from 'react'
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
} from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

const Review: FC<FieldBaseProps> = ({ field, application }) => {
  const { description } = field
  const { register } = useFormContext()
  const { formatMessage } = useLocale()
  //TODO refactor messages
  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box marginTop={8} marginBottom={6}>
        <Accordion singleExpand={false}>
          {/* Applicant */}
          <AccordionItem id="id_1" label="Upplýsingar umsækjanda">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id="applicant.nationalId"
                    name="applicant.nationalId"
                    label="Kennitala"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'applicant.nationalId',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id="applicant.name"
                    name="applicant.name"
                    label="Nafn"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'applicant.name',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id="applicant.email"
                    name="applicant.email"
                    label="Netfang"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'applicant.email',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id="applicant.phoneNumber"
                    name="applicant.phoneNumber"
                    label="Símanúmer"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'applicant.phoneNumber',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id="applicant.address"
                    name="applicant.address"
                    label="Heimilisfang"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'applicant.address',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id="applicant.zipCode"
                    name="applicant.zipCode"
                    label="Póstnúmer og staður"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'applicant.zipCode',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
          {/* administrativeContact */}
          <AccordionItem id="id_2" label="Ábyrgðarmaður">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <Input
                    id="administrativeContact.name"
                    name="administrativeContact.name"
                    label="Nafn"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'administrativeContact.name',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id="administrativeContact.email"
                    name="administrativeContact.email"
                    label="Netfang"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'administrativeContact.email',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id="administrativeContact.phoneNumber"
                    name="administrativeContact.phoneNumber"
                    label="Símanúmer"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'administrativeContact.phoneNumber',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
          {/* technicalContact */}
          <AccordionItem id="id_3" label="Tæknilegur tengiliður">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <Input
                    id="technicalContact.name"
                    name="technicalContact.name"
                    label="Nafn"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'technicalContact.name',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id="technicalContact.email"
                    name="technicalContact.email"
                    label="Netfang"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'technicalContact.email',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id="technicalContact.phoneNumber"
                    name="technicalContact.phoneNumber"
                    label="Símanúmer"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'technicalContact.phoneNumber',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
          {/* helpdeskContact */}
          <AccordionItem id="id_4" label="Notendaaðstoð">
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id="helpDesk.email"
                    name="helpDesk.email"
                    label="Netfang"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'helpDesk.email',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id="helpDesk.phoneNumber"
                    name="helpDesk.phoneNumber"
                    label="Símanúmer"
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        'helpDesk.phoneNumber',
                      ) as string
                    }
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
    </div>
  )
}

export default Review
