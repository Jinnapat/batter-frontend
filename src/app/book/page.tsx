"use client";

import InputWithLabel from "@/components/InputWithLabel";
import LeafletMapWrapper from "@/components/LeafletMapWrapper";
import MainButton from "@/components/MainButton";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

const BookingPage = () => {
  const [name, setName] = useState<string>("");
  const [position, setPosition] = useState<LatLng | null>(null);

  const book = () => {};
  return (
    <div className="w-full flex flex-col items-center max-w-2xl gap-3">
      <div>
        <h1 className="font-bold text-4xl text-center">BOOKING</h1>
        <p className="text-center text-sm mb-3">
          select location that you want to use our product.
        </p>
      </div>
      <div className="shadow-lg rounded-2xl p-5 bg-white w-full">
        <InputWithLabel
          handler={setName}
          hintText="enter the place name"
          labelText="Place Name"
        />
      </div>
      <div className="shadow-lg rounded-2xl p-5 bg-white w-full">
        <p className="mb-3 text-center">
          Location:{" "}
          {position ? `${position.lat}, ${position.lat}` : "no selection"}
        </p>
        <LeafletMapWrapper position={position} setPosition={setPosition} />
      </div>
      <MainButton handler={book} loading={false}>
        BOOK
      </MainButton>
    </div>
  );
};

export default BookingPage;
