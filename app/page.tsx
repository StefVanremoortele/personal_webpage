import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";
import { getAllNowEntries, getHeroBadgeEntry } from "@/lib/now";

export default async function Home() {
  const nowEntries = await getAllNowEntries();
  const heroBadge = getHeroBadgeEntry(nowEntries);

  return (
    <>
      <main className="flex-1">
        <Hero currentNow={heroBadge ? { topic: heroBadge.metadata.topic } : null} />
        <About />
        <Experience />
        <Projects />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
