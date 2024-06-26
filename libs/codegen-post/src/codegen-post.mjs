// @ts-check
import { exec } from 'child_process';
import { IGNORE_PROJECTS, POST_TARGETS, PROJECTJSON } from './const.mjs';
import { readFile } from 'fs/promises';

const projectJSON = JSON.parse(await readFile(PROJECTJSON, 'utf-8'));
const currentProjects = Array.from(new Set((await Promise.all(POST_TARGETS.map(async (target) => {
    return new Promise((resolve, reject) => {
        exec(`nx show projects --target=${target}`, (error, stdout) => {
        if (error) {
            reject(error);
        }
        resolve(stdout.split("\n").filter((line) => line).map((project) => `${project}`));
        });
    });
}))).flat()));

const definedProjects = (projectJSON.implicitDependencies ?? []).filter(e => e != "codegen-post");
const missingProjects = currentProjects.filter((project) => !IGNORE_PROJECTS.includes(project) && !definedProjects.includes(project));

if (missingProjects.length) {
    console.error(`Missing projects in project.json`);
    missingProjects.forEach((project) => console.error(`"${project}",\n`));
    process.exit(1);
}

console.log('Ready to run frontend client.')