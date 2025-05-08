
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TweetTabs from "@/components/TweetTabs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Hero />
        <div className="container mx-auto px-4 py-12">
          <TweetTabs />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
