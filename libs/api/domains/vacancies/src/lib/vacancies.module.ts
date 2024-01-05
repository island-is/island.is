import { CmsModule } from '@island.is/cms'
import { Module } from '@nestjs/common'
import { VacanciesClientModule } from '@island.is/clients/vacancies'
import { VacanciesResolver } from './vacancies.resolver'
import { VacanciesService } from './vacancies.service'

@Module({
  imports: [VacanciesClientModule, CmsModule],
  providers: [VacanciesService, VacanciesResolver],
})
export class VacanciesModule {}
