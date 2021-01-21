import React from 'react'
import { Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/core'
import { CheckboxController } from '@island.is/shared/form-fields'

const Terms = ({ field, error }: FieldBaseProps) => {
  const { id, disabled } = field
  return (
    <>
      <Text variant="intro" marginBottom={2}>
        Barn getur aðeins átt eitt lögheimili og hefur skráning þess margvísleg
        áhrif. Réttarstaða lögheimilisforeldris er önnur en réttarstaða
        umgengnisforeldris. Það hefur ríkari heimildir til ákvarðanatöku um
        málefni barns en umgengnisforeldri.
      </Text>
      <Text marginBottom={2}>
        Foreldrar sem fara sameiginlega með forsjá barns eiga alltaf að leitast
        við að hafa samráð áður en teknar eru afgerandi ákvarðanir um málefni
        barns er varða daglegt líf þess, til dæmis um hvar barnið skuli eiga
        lögheimili og um val á leik- og grunnskóla, um venjulega eða nauðsynlega
        heilbrigðisþjónustu og reglubundið tómstundastarf.
      </Text>
      <Text marginBottom={2}>
        Lögheimilisforeldrið hefur á hinn bóginn heimild til þess að taka þessar
        ákvarðanir, ef samráðið skilar ekki árangri. Lögheimilisforeldri hefur
        því heimild til þess að flytja með barn innanlands og ákveða í hvaða
        skóla barn skuli ganga. Þá á foreldrið sem barn er með lögheimili hjá,
        rétt á að fá meðlag með barninu frá hinu foreldrinu og barnabætur falla
        til lögheimilisforeldrisins. Jafnframt getur lögheimili barns haft áhrif
        í ýmsu öðru tilliti, svo sem á húsaleigubætur, námslán, greiðslur vegna
        örorku, umönnunarbætur og fleira sem þarf að skoða í hverju tilviki. Það
        er því mjög þýðingarmikið atriði að ákveða hjá hvoru foreldri barn skuli
        eiga lögheimili.
      </Text>
      <Text marginBottom={4}>
        Litið er svo á að barn hafi fasta búsetu hjá því foreldri sem það á
        lögheimili hjá. Barn á rétt til að umgangast með reglubundnum hætti það
        foreldri sem það býr ekki hjá og bera foreldrarnir sameiginlega þá
        skyldu að tryggja rétt barns til umgengni.
      </Text>
      <CheckboxController
        id={id}
        disabled={disabled}
        name={`${id}`}
        error={error}
        large={true}
        options={[
          {
            value: 'yes',
            label: 'Ég skil hvaða áhrif lögheimilisbreyting hefur',
          },
        ]}
      />
    </>
  )
}

export default Terms
