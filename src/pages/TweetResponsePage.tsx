
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TweetResponseGenerator from "@/components/TweetResponseGenerator";

const TweetResponsePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-12">
          <TweetResponseGenerator />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TweetResponsePage;
