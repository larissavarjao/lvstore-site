import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from './User';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGUNIN_MUTATION = gql`
  mutation SIGUNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class SignIn extends Component {
  state = {
    password: '',
    email: ''
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={SIGUNIN_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        variables={this.state}>
        {(signin, { error, loading }) => (
          <Form
            method='post'
            onSubmit={async e => {
              e.preventDefault();
              await signin();
              this.setState({ password: '', email: '' });
            }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign in with your account</h2>
              <Error error={error} />
              <label htmlFor='email'>
                Email
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor='password'>
                Password
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>

              <button type='submit'>Sign In!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SignIn;
