# GatsbyJS Slicknode Source Plugin

Source plugin for loading content from [Slicknode Headless GraphQL CMS](https://slicknode.com) into Gatsby.

This source plugin downloads all content nodes from the CMS and adds the content as Gatsby nodes
to the Gatsby GraphQL API. The content can then be transformed, extended etc. with all the
other Gatsby plugins. 

**Features:**

-   Adding sources
-   Custom fragments
-   Image download (optional) to work seamlessly with [gatsby-image](https://www.gatsbyjs.com/plugins/gatsby-image/?=), [gatsby-plugin-sharp](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp/?=), etc.
-   Preview mode

**Links:**

-   [Website](https://slicknode.com/)
-   [Docs](https://slicknode.com/docs/)
-   [Slack Channel](https://slicknode.com/slack/)
-   [Getting started with Slicknode](https://slicknode.com/docs/quickstart/)
-   [Why Slicknode?](https://slicknode.com/product/developers/)


## Installation

Install the source plugin via npm:

    npm install gatsby-source-slicknode


## Configuration

Add the source plugin to the `gatsby-config.js` file of your project and customize the configuration:


```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-slicknode',
      options: {
        // Endpoint to your Slicknode GraphQL API (Required)
        endpoint: 'https://<your-slicknode-project-endpoint>',
  
        // Download all images and add a localFile field to the slicknode `Image` types.
        // The file can then be used in combination with gatsby-transformer-sharp and gatsby-image
        // Default: true
        downloadImages: true,

        // If true, loads the content in preview mode.
        // default: false
        preview: false,

        // Path to the directory where the Slicknode stores fragments of the individual types
        // Those can then be customized to add or exclude specific fields from the nodes that are 
        // added to the gatsby store, add filtered connections etc.
        // If you are using multiple Slicknode APIs in the same projects, use differnet paths for each project
        // Default: slicknode-fragments
        fragmentsPath: 'slicknode-fragments',

        // The prefix for typenames of the types that are added to the Gatsby GraphQL schema
        // If you are using multiple gatsby-source-slicknode plugin instances, use different namespaces for
        // each instance.
        // Default: Slicknode_
        typePrefix: 'Slicknode_',
      },
    }
  ],
};
```


## Usage

For each content type the root query fields will be added to the Gatsby GraphQL schema.
Check out the GraphiQL playground for query capabilities: [https://localhost:8000/___graphql](https://localhost:8000/___graphql)


## Customizing Fragments

The `gatsby-source-slicknode` plugin generates fragments for each custom type in your Slicknode schema
that implements the `Node` interface. The entire object is then sourced into Gatsby
according to the specified fragment. 
The source plugin creates files for each fragment
in the directory specified in the config option `fragmentPath` (default to `./slicknode-fragments`).

You can customize the fragments in the directory to load additional data like
many-to-many relations that are not included by default, or you can remove fields
if you don't want to include certain fields in your Gatsby schema.  

**Note:** When you make changes to existing types in your Slicknode API, you have to update already generated 
fragments to also apply the changes to the Gatsby GraphQL API


## Image Transforms

To use the images with the [gatsby-image](https://www.gatsbyjs.com/plugins/gatsby-image/?=) plugin,
install the required plugins and add them to your configuration:

```javascript
// In your gatsby-config.js
module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: 'gatsby-source-slicknode',
      options: {
        endpoint: 'https://<your-slicknode-endpoint>',
        
        // Enable image download for the transformations
        downloadImages: true,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
}
```

Then use the image fragments of the image sharp plugin to generate optimized images for assets loaded
from the Slicknode API, for example:

```graphql
query GetBlogPostsQuery {
  allSlicknodeBlogPost {
    edges {
      node {
        image {
          localFile {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
}
```

## Sourcing Multiple Slicknode APIs

To source data from multiple Slicknode APIs, add the configuration for both endpoints
and choose differnet `fragmentsPath` and `typePrefix` settings for each API, 
for example:

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-slicknode',
      options: {
        endpoint: 'https://<your-primary-slicknode-endpoint>',
        fragmentsPath: 'slicknode-fragments-primary',
        typePrefix: 'SlicknodePrimary_'
      },
    },
    {
      resolve: 'gatsby-source-slicknode',
      options: {
        endpoint: 'https://<your-secondary-slicknode-endpoint>',
        fragmentsPath: 'slicknode-fragments-secondary',
        typePrefix: 'SlicknodeSecondary_'
      },
    },
    // ...
  ],
}
```
