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
import {getTargetBranch} from "./const";

type JobState = 'success' | 'failure' | 'abandoned' | 'cancelled' | 'skipped'

const failedStates: JobState[] = ['failure', 'abandoned', 'cancelled']

@object()
export class Dagger {
  @func()
  hehe(
    container: Container
  ) {
    return "this works"
  }
  @func()
  async prepare(
    action: string,
    AWS_ECR_PASSWORD: Secret,
    ref: string = 'main',
    allIsAffected: boolean = false,
    branch?: string,
    sha?: string,
    files?: Directory,
    NX_CLOUD_ACCESS_TOKEN?: Secret,
  ): Promise<Container> {
    const targetBranch = getTargetBranch(ref);
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
    return container;
  }
}
