import {
  dag,
  Container,
  Directory,
  object,
  func,
  Secret,
} from '@dagger.io/dagger'
import { getMonorepoBase } from './container'
import { getProps } from './config-props'
import {FILE_ACTION} from "./interface";

type JobState = 'success' | 'failure' | 'abandoned' | 'cancelled' | 'skipped'

const failedStates: JobState[] = ['failure', 'abandoned', 'cancelled']

@object()
export class Dagger {
  @func()
  async test(
    action: string,
    AWS_ECR_PASSWORD: Secret,
    branch?: string,
    sha?: string,
    files?: Directory,
    NX_CLOUD_ACCESS_TOKEN?: Secret,
  ) {
    const props = getProps({
      action: action as FILE_ACTION,
      branch,
      sha,
      files,
    })
    const container = (await getMonorepoBase({
      AWS_ECR_PASSWORD,
      NX_CLOUD_ACCESS_TOKEN,
      ...props,
    }));
  }
}
