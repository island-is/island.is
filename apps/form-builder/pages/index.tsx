import { Forms } from '../screens'
import { getAllFormsFromOrganisation } from '../services/apiService'
import { IFormBuilder } from '../types/interfaces'

interface Props {
  formBuilder: IFormBuilder
}

const Index = ({ formBuilder }: Props) => {
  return <Forms formBuilder={formBuilder} />
}

export default Index

export async function getServerSideProps() {
  const allForms: IFormBuilder = await getAllFormsFromOrganisation(1)
  return {
    props: {
      formBuilder: allForms,
    },
  }
}
