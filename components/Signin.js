import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Router from 'next/dist/lib/router';

import { CURRENT_USER_QUERY } from './User';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signin, { error, loading }] = useMutation(SIGNIN_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });

  const onSubmit = async e => {
    e.preventDefault();
    await signin({ variables: { password, email } });
    setPassword('');
    setEmail('');

    Router.push({ pathname: '/' });
  };

  return (
    <Form method='post' onSubmit={onSubmit}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign in with your account</h2>
        <Error error={error} />
        <label htmlFor='email'>
          Email
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor='password'>
          Password
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>

        <button type='submit'>Sign In!</button>
      </fieldset>
    </Form>
  );
};

export default SignIn;
