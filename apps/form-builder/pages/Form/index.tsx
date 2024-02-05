import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Form from '../../screens/Form'
import { getNewForm } from '../../services/apiService'
import { IFormBuilder } from '../../types/interfaces'

interface Props {
  form: IFormBuilder
}

const Index = ({ form }: Props) => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/Form/${form.form.id}`)
  }, [form.form.id, router])

  return (
    <div>
      <Form form={form} />
    </div>
  )
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
