import MainButton from "@/components/MainButton";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-row items-center justify-center gap-20 w-full p-10 from-red-700 to-blue-500 bg-gradient-to-r">
        <div className="w-96 text-white">
          <h1 className="text-3xl">
            Welcome to the world of <br></br>
            <b className="text-6xl">BATTER</b>
          </h1>
          <br></br>
          <p className="text-md text-wrap">
            We provides rental service for a greener cleaner and quieter energy
            storage system for events
          </p>
          <br></br>
          <Link href="/register">
            <button className="hover:text-yellow-500 transition-colors duration-300 px-5 py-2 rounded-full bg-black">
              Join us now!
            </button>
          </Link>
        </div>
        <Image
          className="transition-transform hover:scale-110 duration-300"
          src="/battery.png"
          alt="Battery image"
          width={300}
          height={300}
        />
      </div>
      <div className="w-full flex flex-col items-center p-10 bg-gray-200">
        <h1 className="text-4xl font-bold">Our Story</h1>
        <p className="mb-4">
          See what Battter is all about and how it could help you!
        </p>
        <div className="p-3 rounded-xl shadow-lg bg-white w-full max-w-4xl">
          <video className="w-full" controls>
            <source
              src="https://lislkdrqthbcxlhuqbzw.supabase.co/storage/v1/object/public/image/804ebcf1-47db-4e0e-bfc9-a47aef6395ed.mp4?t=2024-01-08T18%3A33%3A08.037Z"
              type="video/mp4"
            ></source>
          </video>
        </div>
      </div>
      <div className="w-full bg-gray-600 p-2 text-white">Batter</div>
    </div>
  );
}
