import React, { useState } from 'react';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import { useQuery, useMutation } from '@apollo/react-hooks';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
];

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]!
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const Permissions = () => {
  const { data, error, loading } = useQuery(ALL_USERS_QUERY);

  if (error) return <Error error={error} />;
  if (loading) return <p>Loading...</p>;
  const users = data.users;

  return (
    <>
      {users && users.length >= 1 && (
        <div>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>E-mail</th>
                {possiblePermissions.map(permission => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <UserPermissions user={user} key={user.id} />
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

const UserPermissions = ({ user }) => {
  const [updatePermissions, { loading, error }] = useMutation(
    UPDATE_PERMISSIONS_MUTATION
  );
  const [permissions, setPermissions] = useState(user.permissions);

  const handlePermissionChange = e => {
    const checkbox = e.target;
    let updatedPermissions = [...permissions];
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }

    setPermissions(updatedPermissions);
  };

  return (
    <>
      {error && (
        <tr>
          <td colSpan='8'>
            <Error error={error} />
          </td>
        </tr>
      )}
      {!error && (
        <tr>
          <td>{user.name}</td>
          <td>{user.email}</td>
          {possiblePermissions.map(permission => (
            <td key={`${permission}-${user.id}`}>
              <label htmlFor={`${user.id}-permission-${permission}`}>
                <input
                  id={`${user.id}-permission-${permission}`}
                  type='checkbox'
                  checked={permissions.includes(permission)}
                  value={permission}
                  onChange={handlePermissionChange}
                />
              </label>
            </td>
          ))}
          <td>
            <SickButton
              type='button'
              disabled={loading}
              onClick={() =>
                updatePermissions({
                  variables: {
                    permissions: permissions,
                    userId: user.id
                  }
                })
              }>
              Updat{loading ? 'ing' : 'e'}
            </SickButton>
          </td>
        </tr>
      )}
    </>
  );
};

export default Permissions;
