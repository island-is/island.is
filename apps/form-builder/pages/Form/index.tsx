import Form from '../../screens/Form'
import { getNewForm } from '../../services/apiService'
import { IFormBuilder } from '../../types/interfaces'

interface Props {
  form: IFormBuilder
}

const Index = ({ form }: Props) => {
  return <Form form={form} />
}

export default Index

export async function getServerSideProps() {
  const form: IFormBuilder = await getNewForm(1)
  return {
    props: {
      form: form,
    },
  }
}
