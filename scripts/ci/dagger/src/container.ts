import { dag, Container, Directory, object, func, DirectoryFilterOpts } from "@dagger.io/dagger"
import { DEFAULT_PLATFORM, GITHUB_URL, RUNNER_IMAGE, WORKDIR } from "./const";
import {AWSProps, getEcrContainer} from "./ecr";
import {FILE_ACTION_GITHUB_BRANCH, FILE_ACTION_GITHUB_SHA, FILE_ACTION_LOCAL} from "./interface";

const MONO_REPO_FILTERS = {
    include: [
    "package.json",
    "**/package.json",
    "yarn.lock",
    '.yarn/patches/*',
    '.yarn/releases/*',
    '.yarnrc.yml'
    ],
};
export async function getMonorepoBase(props: MonorepoBase) {
    const container = dag
    .container({platform: DEFAULT_PLATFORM})
    .from(RUNNER_IMAGE);
    const files = getMonorepoInstallFiles(props);
    return container.withDirectory(WORKDIR, files).withWorkdir(WORKDIR).withExec(['yarn', 'install', '--frozen-lockfile']).sync();
}

export type MonorepoBase = MonorepoContainer & AWSProps;


interface MonorepoContainerGithubSha {
    action: FILE_ACTION_GITHUB_SHA;
    sha: string;
}

interface MonorepoContainerGithubBranch {
    action: FILE_ACTION_GITHUB_BRANCH;
    branch: string;
}


interface MonorepoContainerLocal {
    action: FILE_ACTION_LOCAL;
    files: Directory;
}

type MonorepoContainer = MonorepoContainerGithubSha | MonorepoContainerLocal | MonorepoContainerGithubBranch;




function getMonorepoInstallFiles(props: MonorepoContainer) {
    const tree = (( ) => {
        if (props.action ===  'sha') {
            console.log(`Fetching files from sha: ${props.sha}`);
            dag.git(GITHUB_URL).commit(props.sha).tree();
        }
        if (props.action === 'branch') {
            console.log(`Fetching files from branch: ${props.branch}`);
            return dag.git(GITHUB_URL).branch(props.branch).tree();
        }
        if (props.action === 'local') {
            console.log(`Fetching files from local`);
            return props.files;
        }
        
    })().filter(MONO_REPO_FILTERS);
    return tree;
}

