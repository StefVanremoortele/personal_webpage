import HeroReveal from "@/components/HeroReveal/HeroReveal";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <HeroReveal />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
