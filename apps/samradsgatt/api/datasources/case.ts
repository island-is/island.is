import { RESTDataSource } from 'apollo-datasource-rest'

export class caseAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'https://samradapi-test.island.is/api/'
  }

  caseReducer(face) {
    return {
      id: face.id,
      name: face.name,
    }
  }

  async getAllCases() {
    const response = await this.get('Cases')
    return Array.isArray(response)
      ? response.map((face) => this.caseReducer(face))
      : []
  }
}
