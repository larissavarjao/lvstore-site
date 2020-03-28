import React from 'react';
import { Mutation } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from './User';

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

const RemoveFromCart = ({ id }) => {
  const update = (cache, payload) => {
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    update,
    optimisticResponse: {
      __typename: 'Mutation',
      removeFromCart: {
        __typename: 'CartItem',
        id
      }
    }
  });

  return (
    <BigButton
      disabled={loading}
      onClick={() => {
        removeFromCart({ variables: { id } }).catch(err => {
          alert(err.message);
        });
      }}
      title='Delete Item'>
      &times;
    </BigButton>
  );
};

export default RemoveFromCart;
