#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const client = require('.');
const meow = require('meow');
const pMap = require('p-map');
const pkg = require('./package.json');

const formatError = msg => msg.replace(/^\w*Error:\s+/, match => chalk.red.bold(match));

const description = chalk`{bold ${pkg.name}} v${pkg.version} - ${pkg.description}`;
const help = chalk`
Usage:
  coursera [command]

Options:
  -h, --help                     Show help
  -v, --version                  Show version number

Commands:
  list-courses  <partner>        List courses for given partner

Examples:
  # List courses from Stanford University
  coursera list-courses stanford

Homepage:     {cyan ${pkg.homepage}}
Report issue: {cyan ${pkg.bugs.url}}`;

const flags = {
  help: { alias: 'h' },
  version: { alias: 'v' }
};

program(meow(help, { description, version: pkg.version, flags }));

async function program(cli) {
  const [command, ...args] = cli.input;
  if (command === 'list-courses') {
    const infos = await getCourseInfos(...args);
    return console.log(toJSON(infos, null, 2));
  }
  if (command) return fail(`Error: Unknown command: "${command}"`);
  return fail('Error: No command given');
}

async function getCourseInfos(partner, { concurrency = 8 } = {}) {
  if (!partner) {
    return fail('Error: Missing required param "partner"');
  }
  const instructors = new Map();
  // Fetch course listing.
  let courses = await client.fetchCourses({ partner });
  courses = courses.filter(it => it.primaryLanguages.includes('en'));
  // Fetch course details.
  courses = await pMap(courses, async course => {
    const info = await client.fetchCourseInfo(course);
    Object.assign(course, info);
    course.instructors.forEach(({ id }) => {
      if (!instructors.has(id)) instructors.set(id, { id });
    });
    return course;
  }, { concurrency });
  // Fetch instructor details.
  await pMap(instructors.keys(), async id => {
    const info = await client.fetchInstructorInfo({ id });
    instructors.set(id, info);
  }, { concurrency });
  // Merge course & instructor details.
  courses.forEach(course => {
    course.instructors = course.instructors.map(({ id }) => instructors.get(id));
  });
  return courses;
}

function toJSON(data) {
  return JSON.stringify(data, (key, value) => {
    if (key.startsWith('__')) return;
    return value;
  }, 2);
}

function fail(message, code = 1) {
  message = formatError(message);
  console.error(message);
  process.exit(code);
}
