import { FormSystemField } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'

interface Props {
  applicantFields: FormSystemField[]
}

export const Applicants = ({ applicantFields }: Props) => {
  const { lang } = useLocale()
  console.log('applicantFields:', applicantFields)
  return (
    <>
      {applicantFields.map((applicantField, index) => {
        return <h4 key={index}>{applicantField.name[lang]}</h4>
      })}
    </>
  )
}
