import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

export const ADD_CART_ITEM_MUTATION = gql`
  mutation ADD_CART_ITEM_MUTATION($id: ID!) {
    addCartItem(id: $id) {
      id
      quantity
    }
  }
`;

export const AddToCart = ({ id }) => {
  const [addToCart, { loading }] = useMutation(ADD_CART_ITEM_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });
  return (
    <button disabled={loading} onClick={() => addToCart({ variables: { id } })}>
      Add{loading && 'ing'} To Cart!
    </button>
  );
};
