'use strict';

const { ApolloClient } = require('apollo-client');
const { BatchHttpLink } = require('apollo-link-batch-http');
const fetch = require('isomorphic-unfetch');
const get = require('lodash/get');
const { InMemoryCache } = require('apollo-cache-inmemory');

const GRAPHQL_ENDPOINT = 'https://www.coursera.org/graphqlBatch';

const link = new BatchHttpLink({ uri: GRAPHQL_ENDPOINT, fetch });
const cache = new InMemoryCache();
const client = new ApolloClient({ link, cache });

module.exports = {
  fetchCourses,
  fetchCourseInfo
};

async function fetchCourses({ partner }) {
  const variables = { shortName: partner };
  const query = require('./queries/PartnerPage');
  const { data } = await client.query({ query, variables });
  const courses = get(data, 'PartnersV1Resource.shortName.partners[0].courses.elements');
  return courses;
}

async function fetchCourseInfo({ slug }) {
  const variables = { slug };
  const query = require('./queries/CDPPage');
  const { data } = await client.query({ query, variables });
  const info = get(data, 'XdpV1Resource.slug.elements[0].xdpMetadata.cdpMetadata');
  return info;
}
