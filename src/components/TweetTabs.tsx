
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TweetGenerator from "@/components/TweetGenerator";
import TweetResponseGenerator from "@/components/TweetResponseGenerator";

const TweetTabs = () => {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <Tabs
      defaultValue="generate"
      className="w-full"
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="generate" className="text-sm md:text-base">
          Generate Tweets
        </TabsTrigger>
        <TabsTrigger value="respond" className="text-sm md:text-base">
          Respond to Tweet
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="generate">
        <TweetGenerator />
      </TabsContent>
      
      <TabsContent value="respond">
        <TweetResponseGenerator />
      </TabsContent>
    </Tabs>
  );
};

export default TweetTabs;
