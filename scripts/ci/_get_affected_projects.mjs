// @ts-check
import { execSync } from 'child_process';
import { setOutput } from '@actions/core';

const IS_CI = process.env.CI === 'true';
const DEFAULT_TARGET = 'lint';

const getShowAllProjects = () => {
    return process.env.BRANCH && process.env.AFFECTED_ALL && process.env.AFFECTED_ALL === `7913-${process.env.BRANCH}` ||
            process.env.NX_AFFECTED_ALL === 'true' ||
            process.env.TEST_EVERYTHING === 'true';
}

export const getAffectedProjectsArray = ({
    SHOW_ALL_PROJECTS = getShowAllProjects(),
    BASE = process.env.BASE ?? 'main',
    HEAD = process.env.HEAD ?? 'HEAD',
    TARGET = process.argv[2] ?? DEFAULT_TARGET
} = {}) => {
    
    const EXTRA_ARGS = SHOW_ALL_PROJECTS ? [] : ['--affected', '--base', BASE, '--head', HEAD];
    const COMMAND = `npx nx show projects --withTarget="${TARGET}" ${EXTRA_ARGS.join(' ')} --json`;
    const OUTPUT = JSON.parse(execSync(COMMAND, { encoding: 'utf-8' }));
    return OUTPUT;
};

export const getAffectedProjectsString = (props = {}) => {
    const projects = getAffectedProjectsArray(props);
    if (projects.length === 0) {
        return null;
    }
    return projects.join(',');
}

export const setAffectedProjects = (props = {}) => {
    const chunks = getAffectedProjectsString(props);
    if (!chunks) {
        return;
    }
    console.log(`Affected projects for ${props.target ?? DEFAULT_TARGET}: ${chunks}`);
    setOutput('AFFECTED_PROJECTS', `{"projects":${chunks}}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    if (IS_CI) {
        setAffectedProjects();
    } else {
        console.log(getAffectedProjectsArray());   
    }

}