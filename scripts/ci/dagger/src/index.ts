import { dag, Container, Directory, object, func } from "@dagger.io/dagger"


type JobState = 'success' | 'failure' | 'abandoned' | 'cancelled' | 'skipped';

const failedStates: JobState[] = ['failure', 'abandoned', 'cancelled']

@object()
export class Dagger {
  /**
   * Returns a container that echoes whatever string argument is provided
   */
  @func()
  outputManifest(prepareState: JobState, testsState: JobState, dockerBuildState: JobState,
  shouldRunBuild: boolean = false,
  manifest: Record<string, any>,

  ) {
    // Check all states
    if (prepareState !== 'success') {
      throw new Error(`Prepare job failed with state: ${prepareState}`);
    }
    Object.entries({
      tests: testsState,
      dockerBuild: dockerBuildState,
    }).forEach(([jobName, state]) => {
      if (failedStates.includes(state)) {
        throw new Error(`${jobName} job failed with state: ${state}`);
      }
    });

    if (!shouldRunBuild) {
      return;
    }
    
    if (!manifest) {
      console.error(`Manifest not defined`);
    }
    console.log(manifest);
    return;
  }
}
