import HeroReveal from "@/components/HeroReveal/HeroReveal";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <HeroReveal />
        <About />
        <Experience />
        <Projects />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
