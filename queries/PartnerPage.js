'use strict';

const gql = require('graphql-tag');

module.exports = gql`
  query PartnerPageQuery($shortName: String!) {
    PartnersV1Resource {
      shortName(shortName: $shortName, limit: 1) {
        partners: elements {
          id
          shortName
          homeLink
          courses(includeHiddenS12ns: true, showHidden: true, withCorrectBehavior: true, limit: 200) {
            ...CoursesFragment
          }
        }
      }
    }
  }

  fragment CoursesFragment on CoursesV1Connection {
    elements {
      id
      name
      ...CoursesV1_isSpark
      ...CoursesV1_sortCourses
      ...CourseFragment
    }
  }

  fragment CourseFragment on CoursesV1 {
    photoUrl
    name
    courseType
    startDate
    courseStatus
    upcomingSessionStartDate
    plannedLaunchDate
    s12nIds
    ...CoursesV1_getLink
    ...CoursesV1_isOnDemand
  }

  fragment CoursesV1_getLink on CoursesV1 {
    slug
    ...CoursesV1_isOnDemand
  }

  fragment CoursesV1_isOnDemand on CoursesV1 {
    courseType
  }

  fragment CoursesV1_isSpark on CoursesV1 {
    courseType
  }

  fragment CoursesV1_sortCourses on CoursesV1 {
    primaryLanguages
    ...CoursesV1_getStartMoment
    ...CoursesV1_isOnDemand
  }

  fragment CoursesV1_getStartMoment on CoursesV1 {
    startDate
  }
`;
