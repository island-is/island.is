import { FormGroup } from '../components/form/FormGroup'
import { OJOIInputController } from '../components/input/OJOIInputController'
import { publishing } from '../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'

export const Message = ({ application }: OJOIFieldBaseProps) => {
  return (
    <FormGroup title={publishing.headings.messages}>
      <OJOIInputController
        name={InputFields.advert.message}
        label={publishing.inputs.messages.label}
        placeholder={publishing.inputs.messages.placeholder}
        applicationId={application.id}
        defaultValue={application.answers.advert?.message}
        textarea
      />
    </FormGroup>
  )
}
