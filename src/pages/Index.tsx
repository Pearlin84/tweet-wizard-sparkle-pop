
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TweetTabs from "@/components/TweetTabs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <section className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
          <TweetTabs />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
