'use strict';

const gql = require('graphql-tag');

module.exports = gql`
  query InstructorProfileViewerQuery($id: String!) {
    InstructorsV1Resource {
      get(id: $id) {
        ...InstructorProfileFragment
      }
    }
  }

  fragment InstructorProfileFragment on InstructorsV1 {
    photo
    fullName
    shortName
    bio
    title
    department
    websites {
      ...ExternalLinksFragment
    }
  }

  fragment ExternalLinksFragment on InstructorsV1_org_coursera_catalogp_InstructorWebsites {
    website
    websiteFacebook
    websiteTwitter
    websiteLinkedin
  }
`;
