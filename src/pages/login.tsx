import { Inter } from "next/font/google";
import Image from "next/image";
import logo from "../assets/images/logo.png";
import { useState, FormEventHandler, useRef, useEffect } from "react";
import Head from "next/head";
import { getSession, signIn, useSession } from "next-auth/react";
import Spinner from "@components/components/Shared/Spinner";
import Alert from "@components/components/Shared/Alert";
import { error } from "console";
import { useRouter } from "next/router";
import {
  addAlert,
  deleteAlert,
  toggleAuthAlert,
} from "@components/redux/reducers/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@components/redux/store";

const inter = Inter({ subsets: ["latin"] });

const Login = () => {
  const [showPassword, toggle] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const { authAlert } = useSelector((state: RootState) => state.notification);

  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setDisabled(true);

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/");
    } else {
      dispatch(toggleAuthAlert(true));
      formRef.current?.classList.add("shake-card");
      setTimeout(() => {
        formRef.current?.classList.remove("shake-card");
      }, 500);
      setTimeout(() => {
        dispatch(toggleAuthAlert(false));
      }, 2000);
      setDisabled(false);
    }
  };

  const dispatch = useDispatch();

  const handleDeleteAlert = () => {
    dispatch(toggleAuthAlert(false));
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await signIn("google", {
        redirect: true,
      });
      console.log("response", response);
    } catch (error) {
      console.error(error);
    }
  };
  const { data: session } = useSession();
//
  if (session?.user) {
    router.push("/");
  }
  return (
    <div
      className={`${inter.className} flex justify-center items-center h-screen`}
    >
      <Head>
        <title>Login | Mergdata Monitor</title>
      </Head>
      <div className="grid gap-3 z-30 right-5 absolute top-20">
        {authAlert && (
          <Alert
            index={1}
            text="Invalid Credentials, check again"
            handleDeleteAlert={handleDeleteAlert}
          />
        )}
      </div>
      <div className="w-[39vw] max-w-[600px] min-w-[400px] m-[0_auto] p-8 text-xs h-auto">
        <Image
          src={logo}
          width={40}
          height={40}
          className="mx-auto"
          alt="Picture of the Mergdata logo"
        />
        <h1 className="font-semibold text-[1.8em] mb-[2em] text-center">
          Sign In
        </h1>
        <button
          className="social-login-button"
          // onClick={() => signIn("google")}
          onClick={() => handleGoogleSignIn()}
        >
          <Image
            className="mr-2"
            width={21}
            height={21}
            src="https://app.mergdata.net/images/app-icons/google.svg"
            alt="Google logo"
          />
          Sign in with Gmail
        </button>
        <hr className="my-4" />
        <form ref={formRef} method="POST" onSubmit={handleSubmit} className="">
          <div className="mb-[1.4rem]">
            <label htmlFor="username" className="block mb-[.4em]  font-medium">
              Email
            </label>
            <input
              ref={usernameRef}
              name="username"
              type="email"
              className="bg-white border border-[#abb3bf] focus:border-app-blue-2  rounded-[2px]  block w-full p-[.7em_1em] outline-none"
              placeholder="eg:john@gmail.com"
              required
            />
          </div>
          <div className="mb-[1.4rem] relative">
            <label
              htmlFor="password"
              className="block mb-[.4em]  font-medium  "
            >
              Password
            </label>
            <input
              ref={passwordRef}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password here"
              className="bg-white border border-[#abb3bf] focus:border-app-blue-2  rounded-[2px]  block w-full p-[.7em_1em] outline-none"
              required
            />
            <span
              onClick={() => toggle(!showPassword)}
              className=" absolute right-[10px] top-[30px] cursor-pointer"
            >
              Hide
            </span>
          </div>
          <button
            disabled={disabled}
            type="submit"
            className="text-white bg-app-blue-2 disabled:bg-app-gray-3 disabled:cursor-not-allowed cursor-pointer  ml-auto block w-full sm:w-auto px-5 py-2.5 text-center  min-w-[10em] p-[1em_1.5em] rounded"
          >
            {!disabled ? <span>Login </span> : <Spinner />}
          </button>
          <hr className="border-t border-[rgba(0,0,0,.1)] mt-4" />
        </form>
      </div>
    </div>
  );
};

export default Login;
