import {
  Navigate,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";


const AdminRoute = ({
  children,
}) => {

  const {
    user,
    isAuthenticated,
  } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
      />
    );
  }

  if (
    user?.role !== "admin"
  ) {

    return (
      <Navigate to="/" />
    );
  }

  return children;
};

export default AdminRoute;