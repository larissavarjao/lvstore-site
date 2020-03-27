import React, { Component } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { ALL_ITEMS_QUERY } from './Items';

export const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const DeleteItem = ({ id, children }) => {
  const update = (cache, payload) => {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, { update });

  return (
    <button
      onClick={() => {
        if (confirm('Are you sure you want to delete this?')) {
          deleteItem({ variables: { id } }).catch(err => {
            alert(err.message);
          });
        }
      }}>
      {children}
    </button>
  );
};

export default DeleteItem;
