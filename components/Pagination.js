import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';

import PaginationStyle from './styles/PaginationStyles';
import { perPage } from '../config';
import { useQuery } from '@apollo/react-hooks';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => {
  const { data, loading, error } = useQuery(PAGINATION_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <Error error={error} />;

  const count = data.itemsConnection.aggregate.count;
  const pages = Math.ceil(count / perPage);
  const page = props.page;

  return (
    <PaginationStyle data-test='pagination'>
      <Head>
        <title>
          LV Store | Page {page} of {pages}
        </title>
      </Head>
      <Link prefetch href={{ pathname: '/items', query: { page: page - 1 } }}>
        <a className='prev' aria-disabled={page <= 1}>
          ⬅ Prev
        </a>
      </Link>
      <p>
        Page {page} of <span className='totalPages'>{pages}</span>!
      </p>
      <p>{count} Items Total</p>
      <Link prefetch href={{ pathname: '/items', query: { page: page + 1 } }}>
        <a className='next' aria-disabled={page >= pages}>
          Next ➡
        </a>
      </Link>
    </PaginationStyle>
  );
};

export default Pagination;
