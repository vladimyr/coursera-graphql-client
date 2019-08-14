'use strict';

const addWeeks = require('date-fns/add_weeks');
const courses = require('./penn-courses.coursera.json');
const escapeHtml = require('escape-html');
const isBefore = require('date-fns/is_before');
const ms = require('ms');
const subDays = require('date-fns/sub_days');
const sum = require('lodash/sum');

const args = process.argv.slice(2);
const today = new Date();

const logo = {
  wharton: {
    schoolLogo: 'https://ospstaging--ospstaging--c.documentforce.com/servlet/servlet.ImageServer?id=015S0000000u760IAA&oid=00DS0000003Oba0MAC',
    schoolLogoAlt: 'https://ospstaging--ospstaging--c.documentforce.com/servlet/servlet.ImageServer?id=015S0000000u75vIAA&oid=00DS0000003Oba0MAC'
  },
  penn: {
    schoolLogo: 'https://ospstaging--ospstaging--c.documentforce.com/servlet/servlet.ImageServer?id=015S0000000u75RIAQ&oid=00DS0000003Oba0MAC',
    schoolLogoAlt: 'https://ospstaging--ospstaging--c.documentforce.com/servlet/servlet.ImageServer?id=015S0000000u75WIAQ&oid=00DS0000003Oba0MAC'
  }
};

const formatDate = date => new Date(date).toISOString().split('T')[0];

const enrollmentUrl = course => `https://www.coursera.org/learn/${course.slug}?action=enroll&authMode=signup`;
const getDuration = course => course.material.weeks.length;
const getStartDate = course => isBefore(course.startDate, today) ? today : course.startDate;

(function program(indices) {
  const result = indices.map(index => transform(courses[index]));
  console.log(JSON.stringify(result, null, 2));
}(args));

function transform(course) {
  const isWharton = course.slug.startsWith('wharton-');

  const duration = getDuration(course);
  const startDate = getStartDate(course);

  const about = `<p>${escapeHtml(course.description)}</p>`;
  const keyTopics = `<p>${course.domains.map(it => escapeHtml(it.domainName))}</p>`;
  const syllabus = course.material.weeks.map((week, i) => {
    const modules = week.modules.map(it => {
      const title = `<h5>${escapeHtml(it.name)}</h5>`;
      const description = `<p>${it.description}</p>`;
      if (it.description) return title + description;
      return title;
    }).join('');
    const totalDuration = sum(week.modules.map(it => it.totalDuration));
    let duration = ms(totalDuration, { long: true });
    duration = duration.replace(/\s\w/, match => match.toUpperCase());
    return `<h4>Week ${i + 1} · ${duration}</h4>` + modules;
  }).join('');

  const logos = isWharton ? logo.wharton : logo.penn;

  return {
    id: `<${course.id}>`,
    school_id: 's1',
    type: 'COURSE',
    data: {
      name: course.name,
      subtitle: '',
      image: course.photoUrl,
      details: {
        about,
        keyTopics,
        syllabus
      },
      location: 'Online',
      startDate: formatDate(startDate),
      endDate: formatDate(addWeeks(startDate, duration)),
      duration: duration,
      durationUnit: 'week',
      workload: course.workload,
      price: 0.00,
      discountedPrice: 0.00,
      credentialsOffered: course.certificates[0] || '',
      externalEnrollmentUrl: enrollmentUrl(course),
      registrationStartDate: formatDate(subDays(startDate, 1)),
      registrationEndDate: formatDate(subDays(startDate, 31)),
      ...logos,
      professors: course.instructors.map(instructor => ({
        ...splitName(instructor.fullName),
        description: instructor.bio,
        image: instructor.photo
      })),
      topics: course.skills
    }
  };
}

function splitName(fullName) {
  const [firstName, lastName] = fullName.replace(/\s+/, '\x01').split('\x01');
  return { name: fullName, firstName, lastName };
}
