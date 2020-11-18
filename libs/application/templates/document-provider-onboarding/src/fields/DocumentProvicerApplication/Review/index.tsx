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
  Text,
} from '@island.is/island-ui/core'
import {
  FieldDescription,
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

const Review: FC<FieldBaseProps> = ({ field, application }) => {
  const { description } = field
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

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
          <AccordionItem id="id_1" label="Upplýsingar umsækjanda" startExpanded>
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id={'applicant.nationalId'}
                    name={'applicant.nationalId'}
                    label={'Kennitala'}
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id={'applicant.name'}
                    name={'applicant.name'}
                    label={'Nafn'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id={'applicant.email'}
                    name={'applicant.email'}
                    label={'Netfang'}
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id={'applicant.phoneNumber'}
                    name={'applicant.phoneNumber'}
                    label={'Símanúmer'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id={'applicant.address'}
                    name={'applicant.address'}
                    label={'Heimilisfang'}
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id={'applicant.zipCode'}
                    name={'applicant.zipCode'}
                    label={'Póstnúmer og staður'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
          {/* administrativeContact */}
          <AccordionItem id="id_1" label="Ábyrgðarmaður" startExpanded>
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <Input
                    id={'administrativeContact.name'}
                    name={'administrativeContact.name'}
                    label={'nafn'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id={'administrativeContact.email'}
                    name={'administrativeContact.email'}
                    label={'Netfang'}
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id={'administrativeContact.phoneNumber'}
                    name={'administrativeContact.phoneNumber'}
                    label={'Símanúmer'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
          {/* technicalContact */}
          <AccordionItem id="id_1" label="Tæknilegur tengiliður" startExpanded>
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="12/12">
                  <Input
                    id={'technicalContact.name'}
                    name={'technicalContact.name'}
                    label={'nafn'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id={'technicalContact.email'}
                    name={'technicalContact.email'}
                    label={'Netfang'}
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id={'technicalContact.phoneNumber'}
                    name={'technicalContact.phoneNumber'}
                    label={'Símanúmer'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AccordionItem>
          {/* helpdeskContact */}
          <AccordionItem id="id_1" label="Notendaaðstoð" startExpanded>
            <Box paddingY={4}>
              <GridRow>
                <GridColumn span="6/12">
                  <Input
                    id={'helpDesk.email'}
                    name={'helpDesk.email'}
                    label={'Netfang'}
                    ref={register}
                  />
                </GridColumn>
                <GridColumn span="6/12">
                  <Input
                    id={'helpDesk.phoneNumber'}
                    name={'helpDesk.phoneNumber'}
                    label={'Símanúmer'}
                    ref={register}
                  />
                </GridColumn>
              </GridRow>
              <Box marginTop={3} />
              <GridRow>
                {/* Maybe add condition here, because this can be empty ? opinions */}
                <GridColumn span="6/12">
                  <Input
                    id={'helpDesk.chatbot'}
                    name={'helpDesk.chatbot'}
                    label={'Snjallmenni'}
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
