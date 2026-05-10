import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedPropertiesSection } from "@/components/sections/featured-properties-section";
import { getAllProperties } from "@/lib/property-data";

export const revalidate = 60;

export default async function Home() {
  const properties = await getAllProperties();

  return (
    <main className="bg-background text-foreground">
      <HeroSection />
      <FeaturedPropertiesSection properties={properties} />
    </main>
  );
}
