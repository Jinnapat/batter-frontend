"use client";

import HorizontalLine from "@/components/HorizontalLine";
import Loading from "@/components/Loading";
import SessionChecker from "@/components/SessionChecker";
import supabaseClient from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const InfoSlot = ({
  title,
  currentValue,
  value,
  setValue,
  isEditMode,
  editable,
  disabled,
}: {
  title: string;
  currentValue: string;
  value: string;
  setValue?: Dispatch<SetStateAction<string>>;
  isEditMode: boolean;
  editable: boolean;
  disabled: boolean;
}) => {
  return (
    <>
      <div className="flex flex-row items-center">
        <p className="w-1/3">{title}</p>
        {isEditMode && editable && setValue && (
          <input
            className=" rounded-md w-2/3 border p-1"
            type="text"
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            disabled={disabled}
          />
        )}
        {isEditMode && editable && !setValue && (
          <input
            className=" rounded-md w-2/3 border p-1"
            type="text"
            value={value}
            disabled={disabled}
          />
        )}
        {isEditMode && !editable && (
          <p className="w-2/3 overflow-hidden text-gray-500">{value}</p>
        )}
        {!isEditMode && <p className="w-2/3 overflow-hidden">{currentValue}</p>}
      </div>
      <div className="h-0 w-full border my-3"></div>
    </>
  );
};

type UserInfo = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    supabaseClient
      .from("accounts")
      .select()
      .eq("id", user.id)
      .then((response) => {
        if (!response.data) {
          setErrorMessage("Cannot get your profile information");
          return;
        }
        const thisUserInfo: UserInfo = {
          id: response.data[0].id,
          firstName: response.data[0].first_name,
          lastName: response.data[0].last_name,
          email: response.data[0].email,
          phone: response.data[0].phone,
        };
        setUserInfo(thisUserInfo);
      });
  }, [user]);

  const editProfile = async () => {
    if (!user) return;
    setIsProcessing(true);
    setErrorMessage("");
    const updateResult = await supabaseClient
      .from("accounts")
      .update({ first_name: firstName, last_name: lastName, phone: phone })
      .eq("id", user.id)
      .select();
    if (updateResult.error) {
      setErrorMessage(updateResult.error.message);
      setIsProcessing(false);
      return;
    }
    setUserInfo({
      id: updateResult.data[0].id,
      firstName: updateResult.data[0].first_name,
      lastName: updateResult.data[0].last_name,
      email: updateResult.data[0].email,
      phone: updateResult.data[0].phone,
    });
    setIsProcessing(false);
    setIsEditMode(false);
  };

  return (
    <SessionChecker jumpToIfUnauthenticated="/login" setUser={setUser}>
      {!userInfo && <Loading />}
      {userInfo && (
        <div className="w-full flex flex-col items-center max-w-2xl gap-3 shadow-lg rounded-2xl p-10 bg-white">
          <div className="w-full">
            <h1 className="font-bold text-4xl text-center">Your Profile</h1>
            <p className="text-center text-sm mb-3">
              see and edit your profile
            </p>
            <HorizontalLine />
            <InfoSlot
              title="First Name"
              currentValue={userInfo.firstName}
              value={firstName}
              setValue={setFirstName}
              isEditMode={isEditMode}
              editable={true}
              disabled={isProcessing}
            />
            <InfoSlot
              title="Last Name"
              currentValue={userInfo.lastName}
              value={lastName}
              setValue={setLastName}
              isEditMode={isEditMode}
              editable={true}
              disabled={isProcessing}
            />
            <InfoSlot
              title="Email"
              currentValue={userInfo.email}
              value={userInfo.email}
              isEditMode={isEditMode}
              editable={false}
              disabled={isProcessing}
            />
            <InfoSlot
              title="Phone"
              currentValue={userInfo.phone ? userInfo.phone : "not set"}
              value={phone}
              setValue={setPhone}
              isEditMode={isEditMode}
              editable={true}
              disabled={isProcessing}
            />
            <br></br>
            {!isEditMode && (
              <button
                className="rounded-lg px-5 py-2 bg-green-600 text-white transition-colors hover:bg-green-700 duration-300"
                onClick={() => {
                  if (!userInfo) return;
                  setIsEditMode(true);
                  setFirstName(userInfo.firstName);
                  setLastName(userInfo.lastName);
                  setPhone(userInfo.phone ? userInfo.phone : "");
                }}
              >
                EDIT
              </button>
            )}
            {isEditMode && (
              <div className="flex flex-row gap-2 w-full justify-center">
                <button
                  className="rounded-lg px-5 py-2 bg-red-600 text-white transition-colors hover:bg-red-700 duration-300 disabled:text-gray-400"
                  disabled={isProcessing}
                  onClick={() => {
                    setIsEditMode(false);
                    setErrorMessage("");
                  }}
                >
                  CANCEL
                </button>
                <button
                  className="rounded-lg px-5 py-2 bg-green-600 text-white transition-colors hover:bg-green-700 duration-300"
                  onClick={editProfile}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loading /> : "CONFIRM"}
                </button>
              </div>
            )}
            <br></br>
            <p className="text-sm text-center text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}
    </SessionChecker>
  );
};

export default ProfilePage;
