import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";
import { getHeroBadgeEntry } from "@/lib/now";

export default function Home() {
  const heroBadge = getHeroBadgeEntry();

  return (
    <>
      <main className="flex-1">
        <Hero currentNow={heroBadge ? { topic: heroBadge.topic } : null} />
        <About />
        <Experience />
        <Projects />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
