import dynamic from "next/dynamic";

const EntryScreen = dynamic(() => import("@/components/EntryScreen"), { loading: () => <SectionSkeleton /> });
const IdentitySection = dynamic(() => import("@/components/IdentitySection"), { loading: () => <SectionSkeleton /> });
const PersonalitySection = dynamic(() => import("@/components/PersonalitySection"), {
  loading: () => <SectionSkeleton />,
});
const MysterySection = dynamic(() => import("@/components/MysterySection"), { loading: () => <SectionSkeleton /> });
const WaitlistSection = dynamic(() => import("@/components/WaitlistSection"), { loading: () => <SectionSkeleton /> });

function SectionSkeleton() {
  return <div className="min-h-screen bg-black" />;
}

export default function Home() {
  return (
    <main className="bg-black">
      <div className="space-y-[max(100px,10vh)] pb-24 pt-24">
        <section className="relative isolate">
          <EntryScreen />
          <div className="pointer-events-none absolute -bottom-16 left-0 h-32 w-full bg-gradient-to-b from-transparent to-black/80" />
        </section>
        <section className="relative isolate">
          <IdentitySection />
          <div className="pointer-events-none absolute -bottom-16 left-0 h-32 w-full bg-gradient-to-b from-transparent to-black/80" />
        </section>
        <section className="relative isolate">
          <PersonalitySection />
          <div className="pointer-events-none absolute -bottom-16 left-0 h-32 w-full bg-gradient-to-b from-transparent to-black/80" />
        </section>
        <section className="relative isolate">
          <MysterySection />
          <div className="pointer-events-none absolute -bottom-16 left-0 h-32 w-full bg-gradient-to-b from-transparent to-black/80" />
        </section>
        <section className="relative isolate">
          <WaitlistSection />
        </section>
      </div>
    </main>
  );
}
