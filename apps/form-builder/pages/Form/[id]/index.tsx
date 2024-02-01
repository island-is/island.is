import { GetServerSidePropsContext } from 'next'
import Form from '../../../screens/Form'
import { getForm } from '../../../services/apiService'
import { IFormBuilder } from '../../../types/interfaces'

interface Props {
  form: IFormBuilder
}

const Index = ({ form }: Props) => {
  return <Form form={form} />
}

export default Index

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const formId = context.params?.id as unknown
  if (!formId) {
    return {
      notFound: true,
    }
  }
  const form: IFormBuilder = await getForm(formId as number)
  return {
    props: {
      form: form,
    },
  }
}
