import RequestPassword from '../components/Reset';

const Reset = props => (
  <div>
    <RequestPassword resetToken={props.query.resetToken} />
  </div>
);

export default Reset;
