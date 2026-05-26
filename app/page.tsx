"use client";

import Footer from "@/animations/components/Footer";
import Hero from "@/animations/components/Hero";
import JobSearch from "@/animations/components/JobSearch";
import Navbar from "@/animations/components/NavBar";
import Tips from "@/animations/components/Tips";
import Features from "../animations/components/Features";

export default function Home() {
  return (
    <main className="bg-[#050508] min-h-screen overflow-x-hidden">
      <Navbar/>
      <Hero/>
      <Features/>
      <JobSearch/>
      <Tips/>
      <Footer/> 
         </main>
  );
}