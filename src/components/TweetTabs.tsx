
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TweetGenerator from "@/components/TweetGenerator";
import TweetResponseGenerator from "@/components/TweetResponseGenerator";
import { Sparkles, MessageSquare } from "lucide-react";

const TweetTabs = () => {
  const [activeTab, setActiveTab] = useState("generate");
  
  return (
    <Tabs defaultValue="generate" className="w-full" onValueChange={value => setActiveTab(value)}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger 
          value="generate"
          className="flex items-center justify-center gap-2 py-3 text-sm md:text-base"
        >
          <Sparkles className="h-4 w-4" />
          Generate Tweets
        </TabsTrigger>
        <TabsTrigger 
          value="respond"
          className="flex items-center justify-center gap-2 py-3 text-sm md:text-base"
        >
          <MessageSquare className="h-4 w-4" />
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
