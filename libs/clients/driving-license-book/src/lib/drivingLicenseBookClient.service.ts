import { Configuration, DrivingLicenseBookApi } from '../../gen/fetch'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { DrivingLicenseBookClientConfig } from './drivingLicenseBookClient.config'
import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { AuthHeaderMiddleware, User } from '@island.is/auth-nest-tools'
import {
  CreatePracticalDrivingLessonInput,
  PracticalDrivingLesson,
  PracticalDrivingLessonsInput,
  UpdatePracticalDrivingLessonInput,
} from './drivingLicenseBookType.types'

@Injectable()
export class DrivingLicenseBookClientApiFactory {
  constructor(
    @Inject(DrivingLicenseBookClientConfig.KEY)
    private clientConfig: ConfigType<typeof DrivingLicenseBookClientConfig>,
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
  ) {}

  async create() {
    const api = new DrivingLicenseBookApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-driving-license-book',
          ...this.clientConfig.fetch,
        }),
        basePath: `${this.xroadConfig.xRoadBasePath}/r1/${this.clientConfig.xRoadServicePath}`,
        headers: {
          'X-Road-Client': this.xroadConfig.xRoadClient,
        },
      }),
    )

    const config = {
      username: this.clientConfig.username,
      password: this.clientConfig.password,
    }

    const { token } = await api.apiAuthenticationAuthenticatePost({
      authenticateModel: config,
    })
    if (token) {
      return api.withMiddleware(new AuthHeaderMiddleware(`Bearer ${token}`))
    } else {
      throw new Error('Syslumenn client configuration and login went wrong')
    }
  }

  async createPracticalDrivingLesson(
    input: CreatePracticalDrivingLessonInput,
    user: User,
  ): Promise<Partial<Pick<PracticalDrivingLesson, 'id'>> | null> {
    const api = await this.create()
    const { data } = await api.apiTeacherCreatePracticalDrivingLessonPost({
      practicalDrivingLessonCreateRequestBody: {
        ...input,
        teacherSsn: user.nationalId,
      },
    })
    if (data && data.id) {
      return { id: data.id }
    }
    return null
  }

  async updatePracticalDrivingLesson(
    {
      bookId,
      id,
      minutes,
      createdOn,
      comments,
    }: UpdatePracticalDrivingLessonInput,
    user: User,
  ): Promise<{ success: boolean }> {
    const api = await this.create()
    const lesson: PracticalDrivingLesson[] = await this.getPracticalDrivingLessons(
      { bookId, id },
    )
    if (lesson[0].teacherNationalId === user.nationalId) {
      try {
        await api.apiTeacherUpdatePracticalDrivingLessonIdPut({
          id: id,
          practicalDrivingLessonUpdateRequestBody: {
            minutes: minutes,
            createdOn: createdOn,
            comments: comments,
          },
        })
        return { success: true }
      } catch (e) {
        return { success: false }
      }
    }
    throw new ForbiddenException(
      `User ${user.nationalId} can not update practical driving lesson ${id}`,
    )
  }

  async getPracticalDrivingLessons(
    input: PracticalDrivingLessonsInput,
  ): Promise<PracticalDrivingLesson[]> {
    const api = await this.create()
    const { data } = await api.apiTeacherGetPracticalDrivingLessonsBookIdGet(
      input,
    )
    if (!data) {
      throw new NotFoundException(
        `Practical driving lesson for id ${input.id} not found`,
      )
    }
    return data
      .filter(
        (practical) => !!practical && !!practical.bookId && !!practical.id,
      )
      .map((practical) => ({
        bookId: practical.bookId ?? '',
        id: practical.id ?? '',
        studentNationalId: practical.studentSsn ?? '',
        studentName: practical.studentName ?? '',
        licenseCategory: practical.licenseCategory ?? '',
        teacherNationalId: practical.teacherSsn ?? '',
        teacherName: practical.teacherName ?? '',
        minutes: practical.minutes ?? -1,
        createdOn: practical.createdOn ?? '',
        comments: practical.comments ?? '',
      }))
  }
}
