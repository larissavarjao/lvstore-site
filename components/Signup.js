import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Router from 'next/dist/lib/router';

import { CURRENT_USER_QUERY } from './User';
import Form from './styles/Form';
import Error from './ErrorMessage';

export const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const SignUp = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [signup, { error, loading }] = useMutation(SIGNUP_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });

  const onSubmit = async e => {
    e.preventDefault();
    await signup({ variables: { name, password, email } });
    setName('');
    setPassword('');
    setEmail('');

    Router.push({ pathname: '/' });
  };

  return (
    <Form method='post' data-test='form' onSubmit={onSubmit}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign up for the account</h2>
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
        <label htmlFor='name'>
          Name
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={name}
            onChange={e => setName(e.target.value)}
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

        <button type='submit'>Sign Up!</button>
      </fieldset>
    </Form>
  );
};

export default SignUp;
