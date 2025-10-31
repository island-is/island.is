import { Inject, Injectable } from '@nestjs/common'
import { type IEmployeesService } from './employees.service.interface'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { MOCK_EMPLOYEES } from '../../mocks/EMPLOYEES'
import { EmployeeList } from '../../models/employeeList.model'

@Injectable()
export class MockEmployeesService implements IEmployeesService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {
    this.logger.info('Using EmployeesServiceMock')
  }
  async getEmployees(): Promise<EmployeeList> {
    return MOCK_EMPLOYEES
  }
}
