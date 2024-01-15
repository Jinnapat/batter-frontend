import supabaseClient from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/app/profile/page";

const SessionChecker = ({
  children,
  setUser,
  setIsGettingUser,
  jumpToIfAuthenticated,
  jumpToIfUnauthenticated,
  jumpToIfNotAdmin,
}: {
  children?: React.ReactNode;
  setUser?: Dispatch<SetStateAction<User | null>>;
  setIsGettingUser?: Dispatch<SetStateAction<boolean>>;
  jumpToIfAuthenticated?: string;
  jumpToIfUnauthenticated?: string;
  jumpToIfNotAdmin?: string;
}) => {
  const [isThisGettingUser, setThisIsGettingUser] = useState<boolean>(true);
  const [isThisGettingUserInfo, setThisIsGettingUserInfo] =
    useState<boolean>(true);
  const [thisUser, setThisUser] = useState<User | null>(null);
  const [thisUserInfo, setThisUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabaseClient.auth.getUser().then((response) => {
      setThisUser(response.data.user);
      if (setUser) setUser(response.data.user);
      setThisIsGettingUser(false);
      if (setIsGettingUser) setIsGettingUser(false);
    });
  }, [setUser, setIsGettingUser]);

  useEffect(() => {
    if (!thisUser || !jumpToIfNotAdmin) return;
    supabaseClient
      .from("accounts")
      .select()
      .eq("id", thisUser.id)
      .then((response) => {
        if (!response.data) return;
        const thisUserInfo: UserInfo = {
          id: response.data[0].id,
          firstName: response.data[0].first_name,
          lastName: response.data[0].last_name,
          email: response.data[0].email,
          phone: response.data[0].phone,
          isAdmin: response.data[0].is_admin,
        };
        setThisUserInfo(thisUserInfo);
        setThisIsGettingUserInfo(false);
      });
  }, [thisUser, jumpToIfNotAdmin]);

  if (isThisGettingUser) return <Loading />;
  if (jumpToIfAuthenticated && thisUser) {
    router.push(jumpToIfAuthenticated);
    return <Loading />;
  }
  if (jumpToIfUnauthenticated && !thisUser) {
    router.push(jumpToIfUnauthenticated);
    return <Loading />;
  }
  if (jumpToIfNotAdmin && isThisGettingUserInfo) {
    return <Loading />;
  }
  if (jumpToIfNotAdmin && !isThisGettingUserInfo && !thisUserInfo) {
    return (
      <p className="text-sm text-center mt-4 text-red-700">
        Cannot get the user information
      </p>
    );
  }
  if (
    jumpToIfNotAdmin &&
    !isThisGettingUserInfo &&
    thisUserInfo &&
    !thisUserInfo.isAdmin
  ) {
    router.push(jumpToIfNotAdmin);
    return <Loading />;
  }
  return <>{children}</>;
};

export default SessionChecker;
