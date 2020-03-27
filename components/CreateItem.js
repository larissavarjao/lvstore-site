import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import Router from 'next/router';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

const CreateItem = () => {
  const [createItem, { loading, error }] = useMutation(CREATE_ITEM_MUTATION);
  const [title, setTitle] = useState('Title');
  const [description, setDescription] = useState('Description');
  const [image, setImage] = useState('');
  const [largeImage, setLargeImage] = useState('');
  const [price, setPrice] = useState(1000);

  const uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'lvstore');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dbfrgspph/image/upload/',
      {
        method: 'POST',
        body: data
      }
    );
    const file = await res.json();
    setImage(file.secure_url);
    setLargeImage(file.eager[0].secure_url);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const variables = {
      variables: { title, description, image, largeImage, price }
    };
    const res = await createItem(variables);

    Router.push({
      pathname: '/item',
      query: { id: res.data.createItem.id }
    });
  };

  return (
    <Form data-test='form' onSubmit={onSubmit}>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor='file'>
          Image
          <input
            type='file'
            id='file'
            name='file'
            placeholder='Upload an image'
            required
            onChange={uploadFile}
          />
          {image && <img src={image} alt='Upload preview' />}
        </label>
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
            onChange={e => setPrice(e.target.value)}
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

export default CreateItem;
