"use client";

import SessionChecker from "@/components/SessionChecker";
import { useEffect, useRef, useState } from "react";
import supabaseClient from "@/supabase/client";
import Loading from "@/components/Loading";
import HorizontalLine from "@/components/HorizontalLine";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LeafletMapWrapper from "@/components/LeafletMapWrapper";
import "leaflet/dist/leaflet.css";
import { Reservation } from "@/types/reservation";
import MainButton from "@/components/MainButton";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/app/profile/page";
import Selector from "@/components/Selector";

const InfoSlot = ({
  title,
  value,
}: {
  title: string;
  value: string | React.ReactElement;
}) => {
  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <p className="w-5/12 text-wrap break-words font-bold">{title}</p>
        {typeof value == "string" && (
          <p className="w-[56%] text-wrap break-words">{value}</p>
        )}
        {typeof value != "string" && <>{value}</>}
      </div>
      <div className="h-0 w-full border my-3"></div>
    </>
  );
};

const AdminReservationInfoPage = ({
  params,
}: {
  params: { reservationId: string };
}) => {
  const router = useRouter();
  const [isGettingReservationInfo, setIsGettingReservationInfo] =
    useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGettingUserInfo, setIsGettingUserInfo] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const reservationRef = useRef<Reservation>();
  const enableCheckStatus =
    reservation != null && reservation.status == "active";

  useEffect(() => {
    supabaseClient
      .from("reservations")
      .select()
      .eq("id", params.reservationId)
      .then(async (response) => {
        if (response.error) {
          setErrorMessage(response.error.message);
          return;
        }
        reservationRef.current = response.data[0];
        setReservation(response.data[0]);
        setIsGettingReservationInfo(false);
        const getUserResult = await supabaseClient
          .from("accounts")
          .select()
          .eq("id", response.data[0].owner_id);
        if (getUserResult.error) {
          setErrorMessage(getUserResult.error.message);
          return;
        }
        setUserInfo({
          id: getUserResult.data[0].id,
          firstName: getUserResult.data[0].first_name,
          lastName: getUserResult.data[0].last_name,
          email: getUserResult.data[0].email,
          phone: getUserResult.data[0].phone,
          isAdmin: getUserResult.data[0].is_admin,
        });
        setIsGettingUserInfo(false);
      });
    supabaseClient
      .channel("room1")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reservations",
          filter: `id=eq.${params.reservationId}`,
        },
        (payload) => {
          reservationRef.current = payload.new as Reservation;
          setReservation(payload.new as Reservation);
        }
      )
      .subscribe();
  }, [params]);

  const changeStatus = async (status: string) => {
    setIsProcessing(true);
    setErrorMessage("");
    const updateResult = await supabaseClient
      .from("reservations")
      .update({ status })
      .eq("id", params.reservationId)
      .select();
    if (updateResult.error) {
      setErrorMessage(updateResult.error.message);
      setIsProcessing(false);
      return;
    }
    setReservation(updateResult.data[0]);
    setIsProcessing(false);
  };

  return (
    <SessionChecker
      jumpToIfUnauthenticated="/login"
      jumpToIfNotAdmin="/reservations"
    >
      {(isGettingReservationInfo || isGettingUserInfo) && <Loading />}
      {!isGettingReservationInfo && !isGettingUserInfo && (
        <div className="flex flex-col gap-3 max-w-2xl w-full">
          <div className="w-full flex flex-col items-center shadow-lg rounded-2xl p-5 sm:p-10 bg-white">
            <div className="w-full">
              <Link
                href="/admin"
                className="hover:text-yellow-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
            </div>
            <div className="w-full">
              <h1 className="font-bold text-4xl text-center">
                Reservation Info
              </h1>
              <p className="text-center text-sm mb-3">
                see information about this reservation
              </p>
              <p className="text-sm text-center text-red-600">{errorMessage}</p>
              <HorizontalLine />
              {userInfo && (
                <>
                  <InfoSlot
                    title="Booker Name"
                    value={`${userInfo.firstName} ${userInfo.lastName}`}
                  />
                  <InfoSlot title="Booker Email" value={userInfo.email} />
                  <InfoSlot
                    title="Booker Phone"
                    value={userInfo.phone ? userInfo.phone : ""}
                  />
                </>
              )}
              {reservation && (
                <>
                  <InfoSlot title="Event Name" value={reservation.name} />
                  <InfoSlot
                    title="Description"
                    value={reservation.description}
                  />
                  <InfoSlot
                    title="Start Date"
                    value={new Date(reservation.start).toLocaleString()}
                  />
                  <InfoSlot
                    title="End Date"
                    value={new Date(reservation.end).toLocaleString()}
                  />
                  <InfoSlot
                    title="Status"
                    value={
                      <div className="w-7/12">
                        <Selector
                          onChange={changeStatus}
                          value={reservation.status}
                          isLoading={isProcessing}
                        />
                      </div>
                    }
                  />
                  <InfoSlot
                    title="Last Status Update"
                    value={new Date(reservation.updated_at).toLocaleString()}
                  />
                </>
              )}
              <br></br>
              <MainButton
                disabled={!enableCheckStatus}
                handler={() =>
                  router.push(`/admin/status/${params.reservationId}`)
                }
              >
                CHECK STATUS
              </MainButton>
            </div>
          </div>
          {reservation && (
            <div className="shadow-lg rounded-2xl p-5 bg-white w-full flex flex-col gap-3">
              <p className="text-center">
                Location: {reservation.lat}, {reservation.lng}
              </p>
              <LeafletMapWrapper lat={reservation.lat} lng={reservation.lng} />
              <p className="text-center text-red-600">{errorMessage}</p>
            </div>
          )}
        </div>
      )}
    </SessionChecker>
  );
};

export default AdminReservationInfoPage;
