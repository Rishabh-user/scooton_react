import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleLogin } from "./store";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../../api";

const schema = yup
  .object({
    userId: yup.string().trim().required("UserId is Required"),
    password: yup.string().trim().required("Password is Required"),
  })
  .required();

  const LoginForm = () => {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.auth); 
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      userId: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth, navigate]);

  const onSubmit = async (data) => {
    console.log("userid",data.userId)
    try {
      const response = await axios.post(`${BASE_URL}/auth/login/admin`, {
        user: data.userId,
        pwd: data.password,
      });  
      if (response.status === 200) {
        localStorage.setItem("jwtToken", response.data.token);
        localStorage.setItem("serviceAreaId", response.data.serviceAreaId);
        localStorage.setItem("userId", response.data.id);
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
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
   
        {/* <Textinput
          name="userId"
          label="userId"
          type="userId"
          value="userId"
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
          className="h-[48px] "
        /> */}

        <input
          {...register("userId")}
          placeholder="User ID"
          className="h-[48px] form-control"
        />
        <p className="text-red-500">{errors.userId?.message}</p>
        
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="h-[48px] form-control"
        />
        <p className="text-red-500">{errors.password?.message}</p>
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
    </>
  );
};

export default LoginForm;
