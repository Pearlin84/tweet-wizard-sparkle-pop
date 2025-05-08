
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TweetGenerator from "@/components/TweetGenerator";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Hero />
        <div className="container mx-auto px-4 py-12">
          <TweetGenerator />
          
          <div className="mt-16 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Need to respond to a tweet?
            </h3>
            <p className="text-gray-600 mb-6">
              Try our Tweet Response Generator to craft the perfect reply
            </p>
            <Button
              asChild
              className="bg-tweet-purple hover:bg-tweet-purple/90 text-white"
            >
              <Link to="/tweet-response">
                <MessageSquare className="mr-2 h-4 w-4" />
                Generate Tweet Responses
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
