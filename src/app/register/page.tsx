"use client";

import CenterContentCard from "@/components/CenterContentCard";
import HorizontalLine from "@/components/HorizontalLine";
import InputWithLabel from "@/components/InputWithLabel";
import MainButton from "@/components/MainButton";
import Link from "next/link";
import { useState } from "react";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");

  const register = () => {};
  return (
    <CenterContentCard>
      <div>
        <h1 className="font-bold text-4xl text-center">REGISTER</h1>
        <p className="text-center text-sm">
          Lets join Batter and create a greener future together!
        </p>
      </div>
      <HorizontalLine />
      <InputWithLabel
        handler={setFirstName}
        labelText="First Name"
        hintText="enter your first name"
      />
      <InputWithLabel
        handler={setLastName}
        labelText="Last Name"
        hintText="enter your last name"
      />
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
      <InputWithLabel
        handler={setRepassword}
        labelText="Repeat Password"
        hintText="enter your password again"
        obsure={true}
      />
      <br></br>
      <MainButton handler={register} loading={false}>
        REGISTER
      </MainButton>
      <HorizontalLine />
      <p className="text-center">
        Already have an account? login with this{" "}
        <Link
          href="/login"
          className="text-yellow-600 hover:text-yellow-500 transition-colors duration-300"
        >
          link
        </Link>
      </p>
    </CenterContentCard>
  );
};

export default RegisterPage;
