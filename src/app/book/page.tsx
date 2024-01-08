"use client";

import HorizontalLine from "@/components/HorizontalLine";
import InputWithLabel from "@/components/InputWithLabel";
import LeafletMapWrapper from "@/components/LeafletMapWrapper";
import MainButton from "@/components/MainButton";
import SessionChecker from "@/components/SessionChecker";
import supabaseClient from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BookPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [position, setPosition] = useState<LatLng | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const validName = name != "";
  const validDescription = description != "";
  const validDates = startDate && endDate && startDate < endDate;
  const validPosition = position != null;
  const valid = validName && validDescription && validDates && validPosition;

  const book = async () => {
    if (!valid || !user) return;
    setIsProcessing(true);
    setErrorMessage("");
    const insertResult = await supabaseClient.from("reservations").insert({
      name,
      description,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      owner_id: user.id,
      lat: position.lat,
      lng: position.lng,
    });
    if (insertResult.error) {
      setErrorMessage(insertResult.error.message);
      setIsProcessing(false);
      return;
    }
    router.push("/reservations");
  };

  return (
    <SessionChecker jumpToIfUnauthenticated="/login" setUser={setUser}>
      <div className="w-full flex flex-col items-center max-w-2xl gap-3">
        <div className="shadow-lg rounded-2xl p-5 bg-white w-full flex flex-col gap-5">
          <div>
            <h1 className="font-bold text-4xl text-center">BOOKING</h1>
            <p className="text-center text-sm mb-3">
              select location that you want to use our product.
            </p>
            <HorizontalLine />
          </div>
          <InputWithLabel
            handler={setName}
            hintText="enter your event name"
            labelText="Event Name"
            disabled={isProcessing}
            error={!validName}
          />
          <div>
            <p className="mb-2">Description</p>
            <textarea
              className={
                "w-full h-24 p-3 border-2 rounded-lg outline-none ring-0 transition-colors duration-300" +
                (validDescription ? "" : " border-red-600")
              }
              placeholder="describe how you are going to use Batter in your event"
              onChange={(e) => setDescription(e.currentTarget.value)}
              disabled={isProcessing}
            ></textarea>
          </div>
          <div>
            <p className="mb-2">Start - End Dates</p>
            <div className="flex flex-row gap-3">
              <input
                type="datetime-local"
                className={
                  "w-full border-2 rounded-lg px-3 py-1 transition-colors duration-300 outline-none ring-0" +
                  (validDates ? "" : " border-red-600")
                }
                onChange={(e) => setStartDate(new Date(e.currentTarget.value))}
                disabled={isProcessing}
              />
              <input
                type="datetime-local"
                className={
                  "w-full border-2 rounded-lg px-3 py-1 transition-colors duration-300 outline-none ring-0" +
                  (validDates ? "" : " border-red-600")
                }
                onChange={(e) => setEndDate(new Date(e.currentTarget.value))}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
        <div className="shadow-lg rounded-2xl p-5 bg-white w-full flex flex-col gap-3">
          <p
            className={
              "text-center transition-colors duration-300" +
              (validPosition ? "" : " text-red-600")
            }
          >
            Location:{" "}
            {position ? `${position.lat}, ${position.lat}` : "no selection"}
          </p>
          <LeafletMapWrapper position={position} setPosition={setPosition} />
          <MainButton handler={book} loading={isProcessing} disabled={!valid}>
            BOOK
          </MainButton>
          <p className="text-center text-red-600">{errorMessage}</p>
        </div>
      </div>
    </SessionChecker>
  );
};

export default BookPage;
