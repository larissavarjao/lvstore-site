import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';
import Proptypes from 'prop-types';

import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const totalItems = cart => {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
};

export const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

class TakeMyMoney extends React.Component {
  onToken = async (res, createOrder) => {
    NProgress.start();
    const order = await createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => {
      alert(err.message);
    });

    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id }
    });
  };

  render() {
    return (
      <User>
        {({ data: { me }, loading }) => {
          if (loading) return null;
          return (
            <Mutation
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
              {createOrder => (
                <StripeCheckout
                  amout={calcTotalPrice(me.cart)}
                  name='LV Store'
                  description={`Orders of ${totalItems(me.cart)} items!`}
                  image={
                    me.cart.length && me.cart[0].item && me.cart[0].item.image
                  }
                  stripeKey='pk_test_FW9R628pyc9fBqw7T9hgivJW009LIXn3Jk'
                  currency='USD'
                  email={me.email}
                  token={res => this.onToken(res, createOrder)}>
                  {this.props.children}
                </StripeCheckout>
              )}
            </Mutation>
          );
        }}
      </User>
    );
  }
}

export default TakeMyMoney;
