"use client";

import CenterContentCard from "@/components/CenterContentCard";
import HorizontalLine from "@/components/HorizontalLine";
import InputWithLabel from "@/components/InputWithLabel";
import MainButton from "@/components/MainButton";
import supabaseClient from "@/supabase/client";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = async () => {
    await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
  };

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
      />
      <InputWithLabel
        handler={setPassword}
        labelText="Password"
        hintText="at least 6 characters"
        obsure={true}
      />
      <br></br>
      <MainButton handler={login} loading={false}>
        LOGIN
      </MainButton>
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
