import React, { useState } from 'react';
import gql from 'graphql-tag';
import Router from 'next/router';

import { CURRENT_USER_QUERY } from './User';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { useMutation } from '@apollo/react-hooks';

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

const RequestPassword = ({ resetToken }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requestReset, { error, loading, called }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }]
    }
  );

  const onSubmit = async e => {
    e.preventDefault();
    await requestReset({
      variables: {
        resetToken: resetToken,
        password: password,
        confirmPassword: confirmPassword
      }
    });
    setPassword('');
    setConfirmPassword('');

    Router.push({
      pathname: '/'
    });
  };

  return (
    <Form method='post' onSubmit={onSubmit}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Reset your password</h2>
        <Error error={error} />
        <label htmlFor='password'>
          Password
          <input
            type='password'
            name='password'
            placeholder='Email'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <label htmlFor='confirmPassword'>
          Confirm Password
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </label>

        <button type='submit'>Request Reset!</button>
      </fieldset>
    </Form>
  );
};

export default RequestPassword;
