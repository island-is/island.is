// @ts-check
/*
    * This script is used to write the build data to the output.
*/

import core from "@actions/core";

const PROJECT = process.env.PROJECT;
const TARGET = process.env.TARGET;
const IMAGE_NAME = process.env.IMAGE_NAME;
const IMAGE_TAG = process.env.TAG;
const MATRIX_ID = process.env.MATRIX_ID;

let hasError = false;

if (!PROJECT) {
    console.error('Error: PROJECT is undefined');
    hasError = true;
}
if (!TARGET) {
    console.error('Error: TARGET is undefined');
    hasError = true;
}
if (!IMAGE_NAME) {
    console.error('Error: IMAGE_NAME is undefined');
    hasError = true;
}
if (!IMAGE_TAG) {
    console.error('Error: TAG is undefined');
    hasError = true;
}

if (!MATRIX_ID) {
    console.error('Error: MATRIX_ID is undefined');
    hasError = true;
}

if (hasError) {
    process.exit(1);
}

const key = `build-${MATRIX_ID}-${PROJECT}-${TARGET}`;

const value = {
    project: PROJECT,
    target: TARGET,
    imageName: IMAGE_NAME,
    imageTag: IMAGE_TAG,
}

core.setOutput(key, JSON.stringify(value));
console.info(`Build data ${JSON.stringify(value, null, 2)} written to output: ${key}`);

