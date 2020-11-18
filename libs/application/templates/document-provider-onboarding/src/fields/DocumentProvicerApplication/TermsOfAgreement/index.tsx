import React, { FC, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  Box,
  Text,
  Checkbox,
} from '@island.is/island-ui/core'

import * as styles from './TermsOfAgreement.treat'

import { FieldDescription } from '@island.is/shared/form-fields'

import { m } from '../../../forms/messages'

//TODO: Finish error messages.
const TermsOfAgreement: FC<FieldBaseProps> = ({ application }) => {
  const { answers: formValue } = application
  const currentUserTerms = getValueViaPath(
    formValue,
    'termsOfAgreement.userTerms' as string,
    false,
  ) as boolean

  const currentSecurityTerms = getValueViaPath(
    formValue,
    'termsOfAgreement.securityTerms' as string,
    false,
  ) as boolean

  const { setValue } = useFormContext()

  return (
    <Box>
      <Box marginBottom={5}>
        <FieldDescription description="Generic entry text..." />
      </Box>
      <Box marginBottom={3}>
        <Accordion singleExpand={false}>
          <AccordionItem id="id_1" label="Notendaskilmálar">
            <Box paddingY={2} className={styles.maximumHeight}>
              <Text>
                Mun koma ur messages ? Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Nullam nibh metus, ornare sed neque id,
                efficitur mollis mauris. Proin eget metus cursus, eleifend
                sapien ut, consectetur ex. Sed vel ante ac magna pretium
                scelerisque faucibus sodales diam. Donec id leo posuere,
                tincidunt erat quis, venenatis purus. Ut sollicitudin mauris
                vitae ipsum mattis, vel iaculis ante pellentesque. Nam sed
                facilisis sapien. Proin facilisis porta blandit. Nunc ac dictum
                nisl, sit amet varius tortor. Suspendisse a lacinia lacus, non
                lobortis purus. Nullam eget nisi vitae augue iaculis euismod.
                Nulla rhoncus est vitae mi condimentum, nec convallis diam
                ullamcorper. Mun koma ur messages ? Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Nullam nibh metus, ornare sed neque
                id, efficitur mollis mauris. Proin eget metus cursus, eleifend
                sapien ut, consectetur ex. Sed vel ante ac magna pretium
                scelerisque faucibus sodales diam. Donec id leo posuere,
                tincidunt erat quis, venenatis purus. Ut sollicitudin mauris
                vitae ipsum mattis, vel iaculis ante pellentesque. Nam sed
                facilisis sapien. Proin facilisis porta blandit. Nunc ac dictum
                nisl, sit amet varius tortor. Suspendisse a lacinia lacus, non
                lobortis purus. Nullam eget nisi vitae augue iaculis euismod.
                Nulla rhoncus est vitae mi condimentum, nec convallis diam
                ullamcorper. Mun koma ur messages ? Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Nullam nibh metus, ornare sed neque
                id, efficitur mollis mauris. Proin eget metus cursus, eleifend
                sapien ut, consectetur ex. Sed vel ante ac magna pretium
                scelerisque faucibus sodales diam. Donec id leo posuere,
                tincidunt erat quis, venenatis purus. Ut sollicitudin mauris
                vitae ipsum mattis, vel iaculis ante pellentesque. Nam sed
                facilisis sapien. Proin facilisis porta blandit. Nunc ac dictum
                nisl, sit amet varius tortor. Suspendisse a lacinia lacus, non
                lobortis purus. Nullam eget nisi vitae augue iaculis euismod.
                Nulla rhoncus est vitae mi condimentum, nec convallis diam
                ullamcorper.
              </Text>
            </Box>
          </AccordionItem>
          <AccordionItem id="id_2" label="Öryggisskilmálar">
            <Box paddingY={2} className={styles.maximumHeight}>
              <Text>
                Mun koma ur messages ? Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Nullam nibh metus, ornare sed neque id,
                efficitur mollis mauris. Proin eget metus cursus, eleifend
                sapien ut, consectetur ex. Sed vel ante ac magna pretium
                scelerisque faucibus sodales diam. Donec id leo posuere,
                tincidunt erat quis, venenatis purus. Ut sollicitudin mauris
                vitae ipsum mattis, vel iaculis ante pellentesque. Nam sed
                facilisis sapien. Proin facilisis porta blandit. Nunc ac dictum
                nisl, sit amet varius tortor. Suspendisse a lacinia lacus, non
                lobortis purus. Nullam eget nisi vitae augue iaculis euismod.
                Nulla rhoncus est vitae mi condimentum, nec convallis diam
                ullamcorper.
              </Text>
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
      <Box marginBottom={1}>
        <Controller
          name="termsOfAgreement.userTerms"
          defaultValue={currentUserTerms}
          rules={{ required: true }}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue(
                    'termsOfAgreement.userTerms' as string,
                    e.target.checked,
                  )
                }}
                checked={value}
                name="termsOfAgreement.userTerms"
                label={m.userAgreementOptionLabel.defaultMessage}
                large
              />
            )
          }}
        />
      </Box>
      <Box>
        <Controller
          name="termsOfAgreement.securityTerms"
          defaultValue={currentSecurityTerms}
          rules={{ required: true }}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue(
                    'termsOfAgreement.securityTerms' as string,
                    e.target.checked,
                  )
                }}
                checked={value}
                name="termsOfAgreement.securityTerms"
                label={m.safetyAgreementOptionLabel.defaultMessage}
                large
              />
            )
          }}
        />
      </Box>
    </Box>
  )
}

export default TermsOfAgreement
