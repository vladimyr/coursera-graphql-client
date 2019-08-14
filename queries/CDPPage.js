'use strict';

const gql = require('graphql-tag');

module.exports = gql`
  query CDPPageQuery($slug: String!) {
    XdpV1Resource {
      slug(productType: "COURSE", slug: $slug) {
        elements {
          name
          id
          slug
          xdpMetadata {
            ... on XdpV1_cdpMetadataMember {
              cdpMetadata {
                id
                avgLearningHoursAdjusted
                level
                degrees {
                  degree {
                    name
                    shortName
                    slug
                    headerImage
                  }
                }
                certificates
                courseStatus
                domains {
                  domainId
                  domainName
                  subdomainName
                  subdomainId
                }
                primaryLanguages
                skills
                photoUrl
                subtitleLanguages
                name
                slug
                description
                workload
                topReviews {
                  comment
                  authorName
                  averageFiveStarRating
                  timestamp
                }
                reviewHighlights {
                  highlightText: highlighttext
                  reviewcount
                }
                testimonials {
                  comment
                  job
                  authorName: author
                  credential
                }
                learningOutcomes {
                  careerOutcomePromotion
                  careerOutcomeNewCareer
                  careerOutcomePayIncrease
                  careerOutcomeStartBusiness
                  tangibleCareerOutcome
                  topOccupation
                }
                ratings {
                  averageFiveStarRating
                  ratingCount
                  commentCount
                }
                level
                badges
                partners {
                  id
                  name
                  shortName
                  landingPageBanner
                  description
                  partnerMarketingBlurb
                  logo
                  squareLogo
                  rectangularLogo
                  classLogo
                  primaryColor
                  secondaryColor
                  accentColor
                  productBrandingLogo
                }
                instructors {
                  id
                  fullName
                  photo
                  title
                  shortName
                  department
                }
                material {
                  weeks {
                    modules {
                      id
                      name
                      description
                      totalVideos
                      totalQuizzes
                      totalDuration
                      totalLectureDuration
                      totalReadings
                      items {
                        id
                        duration
                        name
                        typeName
                        slug
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    OnDemandCoursesV1Resource {
      slug(slug: $slug) {
        elements {
          id
          overridePartnerLogos
        }
      }
    }
  }
`;
