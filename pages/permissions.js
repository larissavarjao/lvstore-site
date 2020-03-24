import PleaseSignin from '../components/PleaseSignin';
import PermissionsComponent from '../components/Permissions';

const Permissions = props => (
  <div>
    <PleaseSignin>
      <PermissionsComponent />
    </PleaseSignin>
  </div>
);

export default Permissions;
