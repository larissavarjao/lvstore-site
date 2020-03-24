import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const ADD_CART_ITEM_MUTATION = gql`
  mutation ADD_CART_ITEM_MUTATION($id: ID!) {
    addCartItem(id: $id) {
      id
      quantity
    }
  }
`;

class AddToCart extends React.Component {
  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={ADD_CART_ITEM_MUTATION}
        variables={{ id }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(addToCart, { loading }) => (
          <button disabled={loading} onClick={addToCart}>
            Add{loading && 'ing'} To Cart!
          </button>
        )}
      </Mutation>
    );
  }
}

export default AddToCart;
