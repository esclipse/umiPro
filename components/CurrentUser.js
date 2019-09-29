import React, { Component } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    me {
      username
    }
  }
`;

class CurrentUser extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  render() {
    return (
      <Query query={GET_CURRENT_USER_QUERY}>
        {({ data, loading, error }) => {
          if (error) return 'error';
          if (loading) return 'loading'; 
          return this.props.children(data.me);
        }}
      </Query>
    );
  }
}

export default CurrentUser;
export { GET_CURRENT_USER_QUERY };
