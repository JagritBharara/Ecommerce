import {
  Link,
} from "react-router-dom";


const AdminDashboard = () => {

  return (

    <div className="p-6">

      <h1
        className="
          text-4xl
          font-bold
          mb-8
        "
      >
        Admin Dashboard
      </h1>

      {/* =========================
          Dashboard Cards
      ========================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        "
      >

        <Link
          to="/admin/products"

          className="
            border
            rounded-lg
            p-6
            hover:shadow-lg
            transition
          "
        >

          <h2
            className="
              text-2xl
              font-semibold
            "
          >
            Products
          </h2>

          <p className="mt-2">
            Manage products
          </p>

        </Link>

        <Link
          to="/admin/orders"

          className="
            border
            rounded-lg
            p-6
            hover:shadow-lg
            transition
          "
        >

          <h2
            className="
              text-2xl
              font-semibold
            "
          >
            Orders
          </h2>

          <p className="mt-2">
            Manage customer orders
          </p>

        </Link>

      </div>

    </div>
  );
};

export default AdminDashboard;