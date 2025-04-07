import { dag, Container, Directory, object, func } from "@dagger.io/dagger"


type JobState = 'success' | 'failure' | 'abandoned' | 'cancelled' | 'skipped';

const failedStates: JobState[] = ['failure', 'abandoned', 'cancelled']

@object()
export class Dagger {
  @func()
  test() {
    console.log("Hello from Dagger!");
  }
 
}
