import { Injectable } from '@nestjs/common'
import { University } from './model/university'
import { UniversityResponse } from './dto/universityResponse'
import { InjectModel } from '@nestjs/sequelize'

@Injectable()
export class UniversityService {
  constructor(
    @InjectModel(University)
    private universityModel: typeof University,
  ) {}

  async getUniversities(): Promise<UniversityResponse> {
    return { data: await this.universityModel.findAll() }
  }
}
