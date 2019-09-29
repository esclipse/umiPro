import React, { Component } from 'react';
import gql from 'graphql-tag';
import { ApolloProvider, Mutation } from 'react-apollo';
import client from '../../client';
import { GET_CURRENT_USER_QUERY } from '../../components/CurrentUser';

const SIGNIN_MUTATION = gql`
  mutation SignIn($username: String!, $password: String!) {
    signin(username: $username, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

class LoginPage extends Component {
  handleCompleted = data => {
    localStorage.setItem("auth-token", data.signin.token);
    localStorage.setItem("username", data.signin.user.username);        
  };

  handleUpdate = (cache, { data }) => {
      console.log(data, 'data')
      cache.writeQuery({
          query: GET_CURRENT_USER_QUERY,
          data: { me: data.signin.user }
      });
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <Mutation
            mutation={SIGNIN_MUTATION}
            variables={{
                username: "laolitou@qq.com",
                password: "88888888"
            }}
            onCompleted={this.handleCompleted}
            update={this.handleUpdate}>
            {(signin, { loading, error }) => {
                if (loading) return 'loading';
                if (error) return 'error';
                return (
                  <div>
                    username: <input type="text"/>
                    password: <input type="password"/>
                    <button onClick={()=>{
                      signin();
                      console.log('hello world')
                    }}>submit</button>
                  </div>
                );
            }}
        </Mutation>
      </ApolloProvider>

    )
  }
}

export default LoginPage;