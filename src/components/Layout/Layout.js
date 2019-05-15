import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import Header from '../Header/Header'
import './Layout.css'
import ResponsiveSidebar from '../ResponsiveSidebar';
import Container from '../Container';
import ResponsiveAnchor from '../ResponsiveAnchor';
import ResponsiveTopBar from '../ResponsiveTopBar';
import Footer from '../Footer';
// import { setPostPageOn, setPostPageOff } from '../../actions/layout'
import { connect } from 'react-redux'
import { pathPrefix } from '../../../gatsby-config'
import MediaQuery from "react-responsive";
import { onSetSidebarDocked } from "../../actions/layout";

const Layout = ({ 
  children,
  // setPostPageOn,
  // setPostPageOff,
  sidebarRoot,
  onSetSidebarDocked,
  width = "100%"
}) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `}
    render={data => {
      const allPosts = data.allMarkdownRemark.edges.map(edge => edge.node.fields.slug)
      let onPostPage 
      if (typeof window !== 'undefined') {
        let path;
        if (pathPrefix.endsWith('/')) {
          path = window.location.pathname.replace(pathPrefix.slice(0,-1),"")
        } else {
          path = window.location.pathname.replace(pathPrefix,"")
        }
        if (allPosts.indexOf(path) >= 0 || allPosts.indexOf(path.slice(0,-1)) >= 0) {
          // setPostPageOn()
          onPostPage = true
        } else {
          // setPostPageOff()
          onPostPage = false
        }
      }
      
      return (
        <MediaQuery
          maxWidth={1000}
        >
        {(matches) => (
          <>
            <Helmet
              title={data.site.siteMetadata.title}
              meta={[
                { name: 'description', content: 'Sample' },
                { name: 'keywords', content: 'sample, something' },
              ]}
              link={[{rel:"stylesheet", href:"https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700,900|Material+Icons"}]}
            >
              <html lang="en" />
            </Helmet>
            <Header siteTitle={data.site.siteMetadata.title} />
            {(matches && onPostPage) ? <ResponsiveTopBar root={sidebarRoot}/> : null}
            {(!matches && onPostPage) ? <><ResponsiveSidebar root={sidebarRoot}/> <ResponsiveAnchor /> </> : null }
            <Container sidebarDocked={!matches} onPostPage={onPostPage} width={width}>
              {children}
            </Container>
            <Footer/>
          </>
        )}
        </MediaQuery>
      )
    }}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}


const mapDispatchToProps = {
  // setPostPageOn,
  // setPostPageOff,
  onSetSidebarDocked
}

export default connect(()=>({}), mapDispatchToProps) (Layout)
