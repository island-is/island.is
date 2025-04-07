import { dag, Container, Directory, object, func } from "@dagger.io/dagger"


interface MonorepoContainerGithub {
    action: 'sha';
    sha: string;
}

interface MonorepoContainerGithubBranch {
    action: 'branch';
    branch: string;
}


interface MonorepoContainerLocal {
    action: 'local';
}

type MonorepoContainer = MonorepoContainerGithub | MonorepoContainerLocal | MonorepoContainerGithubBranch;

export function monorepoContainer(props: MonorepoContainer) {
    const files = (( ) => {
        if (props.action ===  'sha') {
            //dag.git()
        }
        if (props.action === 'local') {
            throw new Error('Not implemented');
        }
        throw new Error('Invalid action');
    })();
}