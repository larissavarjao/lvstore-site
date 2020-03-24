import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import { CURRENT_USER_QUERY } from './User';
import Form from './styles/Form';
import Error from './ErrorMessage';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class RequestPassword extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  };

  state = {
    password: '',
    confirmPassword: ''
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}>
        {(requestReset, { error, loading, called }) => (
          <Form
            method='post'
            onSubmit={async e => {
              e.preventDefault();
              await requestReset();
              this.setState({ password: '', confirmPassword: '' });
            }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your password</h2>
              <Error error={error} />
              <label htmlFor='password'>
                Password
                <input
                  type='password'
                  name='password'
                  placeholder='Email'
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor='confirmPassword'>
                Confirm Password
                <input
                  type='password'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                />
              </label>

              <button type='submit'>Request Reset!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestPassword;
