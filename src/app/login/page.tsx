"use client";

import CenterContentCard from "@/components/CenterContentCard";
import HorizontalLine from "@/components/HorizontalLine";
import InputWithLabel from "@/components/InputWithLabel";
import Loading from "@/components/Loading";
import MainButton from "@/components/MainButton";
import validateEmail from "@/helpers/emailValidator";
import supabaseClient from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const [isGettingUser, setIsGettingUser] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const validEmail = validateEmail(email);
  const validPassword = password.length >= 6;
  const valid = validEmail && validPassword;

  useEffect(() => {
    supabaseClient.auth.getUser().then((response) => {
      setUser(response.data.user);
      setIsGettingUser(false);
    });
  }, []);

  const login = async () => {
    setIsProcessing(true);
    setErrorMessage("");
    try {
      const loginResult = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (loginResult.error) {
        setErrorMessage(loginResult.error.message);
        return;
      }
      router.push("/reservations");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isGettingUser) return <Loading />;
  if (user) router.push("/reservations");
  return (
    <CenterContentCard>
      <div>
        <h1 className="font-bold text-4xl text-center">LOGIN</h1>
        <p className="text-center text-sm">
          Welcome back! lets log into your account
        </p>
      </div>
      <HorizontalLine />
      <InputWithLabel
        handler={setEmail}
        labelText="Email"
        hintText="enter your email"
        error={!validEmail}
        disabled={isProcessing}
      />
      <InputWithLabel
        handler={setPassword}
        labelText="Password"
        hintText="at least 6 characters"
        obsure={true}
        error={!validPassword}
        disabled={isProcessing}
      />
      <br></br>
      <MainButton handler={login} loading={isProcessing} disabled={!valid}>
        LOGIN
      </MainButton>
      <p className="text-red-700 text-center">{errorMessage}</p>
      <HorizontalLine />
      <p className="text-center">
        Don&lsquo;t have an account? create one with this{" "}
        <Link
          href="/register"
          className="text-yellow-600 hover:text-yellow-500 transition-colors duration-300"
        >
          link
        </Link>
      </p>
    </CenterContentCard>
  );
};

export default LoginPage;
