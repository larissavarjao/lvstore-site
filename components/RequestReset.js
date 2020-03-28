import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

export const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const RequestReset = () => {
  const [email, setEmail] = useState('');
  const [requestReset, { error, loading, called }] = useMutation(
    REQUEST_RESET_MUTATION
  );

  return (
    <Form
      method='post'
      data-test='form'
      onSubmit={async e => {
        e.preventDefault();
        await requestReset({ variables: { email } });
        setEmail('');
      }}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign in with your account</h2>
        <Error error={error} />
        {!error && !loading && called && (
          <p>Success! Check your email for a reset link!</p>
        )}
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

        <button type='submit'>Request Reset!</button>
      </fieldset>
    </Form>
  );
};

export default RequestReset;
