
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TweetGenerator from "@/components/TweetGenerator";
import TweetResponseGenerator from "@/components/TweetResponseGenerator";
import { Sparkles, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

const TweetTabs = () => {
  const [activeTab, setActiveTab] = useState("generate");
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="p-6 bg-white/50 backdrop-blur-sm border border-gray-200 shadow-md rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-tweet-purple to-tweet-blue bg-clip-text text-transparent">
          {activeTab === "generate" ? "Tweet Generator" : "Tweet Response Generator"}
        </h2>
        
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
      </Card>
      
      <div className="mt-8 p-4 text-sm text-muted-foreground border border-muted rounded-lg">
        <p className="font-semibold mb-2">Disclaimer:</p>
        <p>This is an AI-powered tweet generation tool. Always fact-check and verify sources before sharing. Use it responsibly to avoid spreading misinformation or misleading content.</p>
        <p> ~  PEACE  ~ </p>
      </div>
    </div>
  );
};

export default TweetTabs;
