import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleLogin } from "./store";
import { toast } from "react-toastify";
import axios from "axios";
const schema = yup
  .object({
    userId: yup.string().required("userId is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();
const LoginForm = () => {
  const dispatch = useDispatch();
  // const { users } = useSelector((state) => state.auth);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });
  const navigate = useNavigate();
  // const onSubmit = (data) => {
  //   const user = users.find(
  //     (user) => user.userId === data.userId && user.password === data.password
  //   );
  //   if (user) {
  //     dispatch(handleLogin(true));
  //     setTimeout(() => {
  //       navigate("/dashboard");
  //     }, 1500);
  //   } else {
  //     toast.error("Invalid credentials", {
  //       position: "top-right",
  //       autoClose: 1500,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // };
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("https://scooton-api-dev.el.r.appspot.com/auth/login/admin", {
        user: data.userId,
        pwd: data.password,
      });  
      if (response.status === 200) {
        localStorage.setItem("jwtToken", response.data.token);
        localStorage.setItem("id", response.data.id);
        dispatch(handleLogin(true));
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error("Invalid credentials", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Login error: ", error);
      toast.error("Error logging in. Please try again later.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  
  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="userId"
        label="userId"
        type="userId"
        register={register}
        error={errors.userId}
        className="h-[48px]"
      />
      <Textinput
        name="password"
        label="password"
        type="password"
        register={register}
        error={errors.password}
        className="h-[48px]"
      />
      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-scooton-800 dark:text-scooton-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link>
      </div>

      <button className={` btn text-white bg-scooton-500 dark:bg-scooton-500 block w-full text-center` }>Sign in</button>
    </form>
  );
};

export default LoginForm;
