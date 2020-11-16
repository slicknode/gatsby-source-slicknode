/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: "gatsby-source-slicknode",
      options: {
        endpoint: 'https://api.us-east-1.aws.slicknode.com/v1/graphql-texas-demo-bf6cce61',
        downloadImages: true,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
}
