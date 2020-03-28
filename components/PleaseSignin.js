import { useQuery } from '@apollo/react-hooks';
import Signin from './Signin';
import { CURRENT_USER_QUERY } from './User';

const PleaseSignIn = props => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);
  if (loading) return <p>Loading...</p>;
  if (!data.me) {
    return (
      <div>
        <p>Please Sign In before Continuing</p>
        <Signin />
      </div>
    );
  }

  return props.children;
};

export default PleaseSignIn;
