import styled from 'styled-components';
import SignUpComponent from '../components/Signup';
import SignIn from '../components/Signin';
import RequestReset from '../components/RequestReset';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const Signup = props => (
  <Columns>
    <SignUpComponent />
    <SignIn />
    <RequestReset />
  </Columns>
);

export default Signup;
