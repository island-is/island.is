import axios from 'axios'
import {
  IForm,
  IFormApplicantType,
  IFormBuilder,
  IGroup,
  IInput,
  ILanguage,
  IStep,
  ItemType,
} from '../types/interfaces'

const BASEURL = 'https://profun.island.is/umsoknarkerfi/api'

export async function getForm(id: number) {
  try {
    const response = await axios.get(`${BASEURL}/Forms/${id}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function updateForm(
  form: IForm,
  steps: IStep[],
  groups: IGroup[],
  inputs: IInput[],
) {
  const updatedForm: IForm = {
    ...form,
    stepsList: steps.map((s, i) => {
      return {
        ...s,
        displayOrder: i,
      }
    }),
    groupsList: groups.map((g, i) => {
      return {
        ...g,
        displayOrder: i,
      }
    }),
    inputsList: inputs.map((i, index) => {
      return {
        ...i,
        displayOrder: index,
      }
    }),
  }

  try {
    const response = await axios.put(
      `${BASEURL}/Forms/${form.id}`,
      updatedForm,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('Update complete')
    return response
  } catch (error) {
    console.error('Error in updateNavbar:', error)
    throw error
  }
}

export async function updateItem(type: string, data: IStep | IGroup | IInput) {
  const url = `${BASEURL}/${type}s/${data.id}`

  try {
    const response = await axios.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('response', response)
    console.log(`saving ${type}`, data)

    return response
  } catch (error) {
    console.error('Error in updateItem: ', error)
    throw error
  }
}

export async function getNewForm(organisationId: number) {
  try {
    const response = await axios.post(`${BASEURL}/Forms/${organisationId}`)
    return response.data
  } catch (error) {
    console.error('Error in getNewForm: ', error)
    throw error
  }
}

export async function getAllFormsFromOrganisation(
  organisationId: number,
): Promise<IFormBuilder> {
  try {
    const response = await axios.get(
      `${BASEURL}/Forms/Organization/${organisationId}`,
    )
    console.log('allForms api: ', response.data)
    return response.data
  } catch (error) {
    console.error('Error in getAllFormsFromOrganisation: ', error)
    throw error
  }
}

export async function addStep(
  formId: number,
  name: ILanguage,
  displayOrder: number,
  stepType: number,
  waitingText: ILanguage,
  callRuleset: boolean,
): Promise<IStep | null> {
  // const schema = zod.object({
  //   formId: zod.number(),
  //   name: zod.object({
  //     is: zod.string(),
  //     en: zod.string()
  //   }),
  //   displayOrder: zod.number(),
  //   stepType: zod.number(),
  //   waitingText: zod.object({
  //     is: zod.string(),
  //     en: zod.string()
  //   }),
  //   callRuleset: zod.boolean()
  // })

  try {
    const response = await axios.post(`${BASEURL}/Steps`, {
      formId,
      name,
      displayOrder,
      stepType,
      waitingText,
      callRuleset,
    })

    // const data = schema.parse(response.data)
    const data = response.data
    console.log('addStep data: ', data)

    return data
  } catch (error) {
    console.error('Error in addStep: ', error)
    throw error
  }
}

export async function addGroup(
  displayOrder: number,
  parentId: number,
): Promise<IGroup | null> {
  // const schema = zod.object({
  //   name: zod.object({
  //     is: zod.string(),
  //     en: zod.string()
  //   }),
  //   displayOrder: zod.number(),
  //   multiSet: zod.number(),
  //   parentId: zod.number()
  // })

  try {
    const response = await axios.post(`${BASEURL}/Groups`, {
      displayOrder: displayOrder,
      stepId: parentId,
    })

    // const data = schema.parse(response.data)
    const data = response.data
    console.log('addGroup data: ', data)

    return data
  } catch (error) {
    console.error('Error in addGroup: ', error)
    throw error
  }
}

export async function addInput(
  displayOrder: number,
  parentId: number,
): Promise<IInput | null> {
  // const schema = zod.object({
  //   displayOrder: zod.number(),
  //   parentId: zod.number(),
  //   inputTypeId: zod.number()
  // })

  const requestBody = {
    displayOrder: displayOrder,
    groupId: parentId,
  }

  try {
    const response = await axios.post(`${BASEURL}/Inputs`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // const data = schema.parse(response.data)
    const data = response.data
    console.log('addInput data: ', data)

    return data
  } catch (error) {
    console.error('Error in addInput: ', error)
    throw error
  }
}

export async function deleteItem(type: ItemType, id: number) {
  try {
    const response = await axios.delete(`${BASEURL}/${type}s/${id}`)
    console.log('deleteItem response: ', response)
    return response
  } catch (error) {
    console.error('Error in deleteItem: ', error)
    throw error
  }
}

export async function saveFormSettings(id: number, settings: object) {
  console.log(settings)
  try {
    const response = await axios.put(
      `${BASEURL}/Forms/${id}/Settings`,
      settings,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('saveFormSettings response: ', response)
    return response
  } catch (error) {
    console.error('Error in saveFormSettings: ', error)
    throw error
  }
}

export async function saveApplicantTypes(
  id: number,
  types: IFormApplicantType[],
) {
  const requestData = {
    id: id,
    formApplicantTypes: types,
  }
  try {
    const response = await axios.put(
      `${BASEURL}/Forms/${id}/Settings`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    console.log('saveApplicantTypes response: ', response)
    return response
  } catch (error) {
    console.error('Error in saveApplicantTypes: ', error)
    throw error
  }
}
export async function getList(type: string) {
  try {
    const response = await axios.get(`${BASEURL}/Services/${type}`)
    console.log('getList response: ', response)
    return response.data
  } catch (error) {
    console.error('Error in getList: ', error)
    throw error
  }
}
