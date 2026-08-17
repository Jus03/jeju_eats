import React from "react";
import Hero from "../components/Hero.jsx";
import FeaturedMenu from "../components/FeaturedMenu.jsx";
import About from "../components/About.jsx";
import Contact from "../components/Contact.jsx";
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedMenu/>
      <About/>
      <Contact/>
    </>
  );
}