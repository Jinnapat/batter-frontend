"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import batteryImage from "../../public/battery.png";
import previewImage0 from "../../public/preview/0.jpg";
import previewImage1 from "../../public/preview/1.jpg";
import previewImage2 from "../../public/preview/2.jpg";
import previewImage3 from "../../public/preview/3.jpg";
import previewImage4 from "../../public/preview/4.jpg";
import previewImage5 from "../../public/preview/5.jpg";
import previewImage6 from "../../public/preview/6.jpg";
import previewImage7 from "../../public/preview/7.jpg";
import previewImage8 from "../../public/preview/8.jpg";

export default function Home() {
  const previewImages = [
    previewImage0,
    previewImage1,
    previewImage2,
    previewImage3,
    previewImage4,
    previewImage5,
    previewImage6,
    previewImage7,
    previewImage8,
  ];
  const [expandImage, setExpandImage] = useState<number | null>(null);

  return (
    <>
      <div className="flex flex-col w-full items-center gap-5">
        <div className="flex flex-row items-center justify-center gap-20 w-full p-10 from-red-700 to-blue-500 bg-gradient-to-r rounded-xl shadow-xl">
          <div className="w-96 text-white">
            <h1 className="text-3xl">
              Welcome to the world of <br></br>
              <b className="text-6xl">BATTER</b>
            </h1>
            <br></br>
            <p className="text-md text-wrap">
              We provides rental service for a greener cleaner and quieter
              energy storage system for events
            </p>
            <br></br>
            <Link href="/register">
              <button className="hover:text-yellow-500 transition-colors duration-300 px-5 py-2 rounded-full bg-black">
                Join us now!
              </button>
            </Link>
          </div>
          <Image
            className="transition-transform hover:scale-110 duration-500 hover:rotate-3 hidden sm:block"
            src={batteryImage}
            alt="Battery image"
            width={300}
            height={300}
          />
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="p-6 rounded-xl shadow-lg bg-white w-full max-w-4xl flex flex-col items-center">
            <h1 className="text-4xl font-bold">Our Story</h1>
            <p className="mb-4 text-center">
              See what Battter is all about and how it could help you!
            </p>
            <video className="w-full border-2" controls>
              <source
                src="https://lislkdrqthbcxlhuqbzw.supabase.co/storage/v1/object/public/batter-preview/BATTER_EDIT3_small.mp4?t=2024-01-10T16%3A38%3A50.221Z"
                type="video/mp4"
              ></source>
            </video>
            <br></br>
            <div className="w-full overflow-x-scroll flex flex-row gap-2">
              {previewImages.map((previewImage, idx) => {
                return (
                  <Image
                    className="cursor-pointer transition-opacity duration-300 hover:opacity-80"
                    placeholder="blur"
                    key={idx}
                    src={previewImage}
                    alt="preview image"
                    width={150}
                    height={150}
                    onClick={() => setExpandImage(idx)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {expandImage != null && (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-opacity-75 bg-black">
          <div className="absolute top-10 bottom-10 left-10 right-10">
            <Image
              className="cursor-pointer object-contain"
              placeholder="blur"
              src={previewImages[expandImage]}
              alt="preview image"
              fill
              onClick={() => setExpandImage(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
