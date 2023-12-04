import { Injectable } from '@nestjs/common'
import { University } from './model/university'
import { UniversitiesResponse } from './dto/universitiesResponse'
import { InjectModel } from '@nestjs/sequelize'

@Injectable()
export class UniversityService {
  constructor(
    @InjectModel(University)
    private universityModel: typeof University,
  ) {}

  async getUniversities(): Promise<UniversitiesResponse> {
    return { data: await this.universityModel.findAll() }
  }
}
