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

import { m } from '../../forms/messages'

//TODO: Implement this component, only initial setup.
const TermsOfAgreement: FC<FieldBaseProps> = ({ application }) => {
  const { answers: formValue } = application
  //To initialize, maybe possible to do differently. Also to get the value when we revisit the step.
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

  //To change value of checkbox and keep it
  const [userTerms, setCheckboxOne] = useState(currentUserTerms)
  const [securityTerms, setCheckboxTwo] = useState(currentSecurityTerms)

  //To see if the field is touched, can we get this somewhere else ?
  const [userTermsTouched, setuserTermsTouched] = useState(false)
  const [securityTermsTouched, setSecurityTermsTouched] = useState(false)

  //Have to find best way to treat errors. Nothing defined onload, after we press "continue" we get the errors...
  const { setValue, errors } = useFormContext()

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
          // could have this as false, but i think this is neater, opinions ?
          defaultValue={currentUserTerms}
          name={'termsOfAgreement.userTerms'}
          rules={{ required: true }}
          render={({ onChange, value }) => (
            <Checkbox
              id="termsOfAgreement.userTerms"
              name="termsOfAgreement.userTerms"
              //Some other way to do this maybe ?
              label={m.userAgreementOptionLabel.defaultMessage}
              onChange={(e) => {
                setuserTermsTouched(true)
                setCheckboxOne(e.target.checked)
                setValue('termsOfAgreement.userTerms', e.target.checked)
              }}
              checked={userTerms}
              large
              //Has to be a better way...
              hasError={!userTerms && userTermsTouched}
              errorMessage={'Þú verður að samþykkja notendaskilmála'}
            />
          )}
        />
      </Box>
      <Box>
        <Controller
          defaultValue={currentSecurityTerms}
          name={'termsOfAgreement.securityTerms'}
          rules={{ required: true }}
          render={() => (
            <Checkbox
              id="termsOfAgreement.securityTerms"
              name="termsOfAgreement.securityTerms"
              label={m.safetyAgreementOptionLabel.defaultMessage}
              onChange={(e) => {
                setSecurityTermsTouched(true)
                setCheckboxTwo(e.target.checked)
                setValue('termsOfAgreement.securityTerms', e.target.checked)
              }}
              checked={securityTerms}
              large
              //Has to be a better way
              hasError={!securityTerms && securityTermsTouched}
              errorMessage={'Þú verður að samþykkja öryggisskilmála'}
            />
          )}
        />
      </Box>
    </Box>
  )
}

export default TermsOfAgreement
