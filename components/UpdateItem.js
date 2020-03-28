import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
    }
  }
`;

const UpdateItem = ({ id }) => {
  const {
    data: { item },
    loading: loadingItem
  } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id }
  });

  if (loadingItem) return <p>Loading...</p>;
  if (!item) return <p>No Item Found for ID</p>;

  const [updateItem, { loading, error }] = useMutation(UPDATE_ITEM_MUTATION);

  const update = async (e, updateItemMutation) => {
    e.preventDefault();

    const res = await updateItemMutation({
      variables: {
        id: id,
        title,
        description,
        price
      }
    });
  };

  console.log(item);
  const [title, setTitle] = useState(item.title);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description);

  return (
    <Form onSubmit={e => update(e, updateItem)}>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor='title'>
          Title
          <input
            type='text'
            id='title'
            name='title'
            placeholder='Title'
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label htmlFor='price'>
          Price
          <input
            type='number'
            id='price'
            name='price'
            required
            value={price}
            onChange={e => setPrice(parseFloat(e.target.value))}
          />
        </label>

        <label htmlFor='description'>
          Description
          <textarea
            id='description'
            name='description'
            placeholder='Enter a description'
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </label>
        <button type='submit'>Submit</button>
      </fieldset>
    </Form>
  );
};

export default UpdateItem;
