import {
  useForm,
} from "react-hook-form";

import {
  useDispatch,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  loginUser,
} from "../features/auth/authAPI.js";

import {
  setCredentials,
} from "../features/auth/authSlice.js";


const LoginPage = () => {

  const {
    register,
    handleSubmit,
  } = useForm();

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  // ==============================
  // Submit Handler
  // ==============================

  const onSubmit =
    async (data) => {

      try {

        const response =
          await loginUser(data);

        dispatch(
          setCredentials(
            response.data
          )
        );

        navigate("/");

      } catch (error) {

        console.error(
          error.response?.data
        );
      }
    };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
      "
    >

      <form
        onSubmit={
          handleSubmit(onSubmit)
        }

        className="
          w-full
          max-w-md
          p-6
          border
          rounded-lg
          space-y-4
        "
      >

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Login
        </h1>

        <input
          type="email"

          placeholder="Email"

          {...register("email")}

          className="
            w-full
            border
            p-2
            rounded
          "
        />

        <input
          type="password"

          placeholder="Password"

          {...register("password")}

          className="
            w-full
            border
            p-2
            rounded
          "
        />

        <button
          type="submit"

          className="
            w-full
            bg-black
            text-white
            p-2
            rounded
          "
        >
          Login
        </button>

      </form>

    </div>
  );
};

export default LoginPage;