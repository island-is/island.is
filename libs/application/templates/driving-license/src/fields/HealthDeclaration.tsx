import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { CustomField, FieldBaseProps } from '@island.is/application/core'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

function HealthDeclaration({
  error,
  field,
  application,
}: PropTypes): JSX.Element {
  return (
    <Box>
      Ég lýsi því hér með yfir að ég hef ekki undir höndum ökuskírteini gefið út
      af öðru ríki sem er aðili að Evrópska efnahagssvæðinu né hef ég sætt
      takmörkunum á ökurétti eða verið svipt(ur) ökuréttindum í þeim ríkjum. Ég
      hef fasta búsetu hér á landi eins og hún er skilgreind í VIII. viðauka
      reglugerðar um ökuskírteini eða tel mig fullnægja skilyrðum um búsetu hér
      á landi til að fá gefið út ökuskírteini.
    </Box>
  )
}

/*
buildMultiField({
  id: 'healthDeclaration',
  name: 'Heilbrigðisyfirlýsing',
  children: [
    buildIntroductionField({
      id: 'intro',
      name: '',
      introduction:
        'Ef sótt er um réttindi í flokkum <b>AM</b>, <b>A1</b>, <b>A2</b>, <b>A</b>, <b>B</b>, <b>BE</b> eða <b>T</b> nægir heilbrigðisyfirlýsing ein og sér, nema sýslumaður telji þörf á læknisvottorði eða ef umsækjandi hefur náð 65 ára aldri eða hann vilji heldur skila læknisvottorði. Með umsókn um aðra flokka ökuréttinda (aukin ökuréttindi) er krafist læknisvottorðs á sérstöku eyðublaði.',
    }),
    buildCheckboxField({
      id: 'useMedicalCertification',
      name: '',
      options: [
        {
          value: 'useMedicalCertification',
          label:
            'Umsækjandi óskar eftir að skila inn læknisvottorði í stað heilbrigðisyfirlýsingu',
        },
      ],
    }),
  ]
})
*/

export default HealthDeclaration
