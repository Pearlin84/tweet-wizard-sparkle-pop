
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TweetGeneratorSimple from "@/components/TweetGeneratorSimple";
import TweetResponseGeneratorSimple from "@/components/TweetResponseGeneratorSimple";
import { Sparkles, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

const TweetTabs = () => {
  const [activeTab, setActiveTab] = useState("generate");
  
  return (
    <div className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto" id="tweet-generator">
      <Card className="p-3 sm:p-4 md:p-6 bg-white/50 backdrop-blur-sm border border-gray-200 shadow-md rounded-xl mx-2 sm:mx-0">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center bg-gradient-to-r from-tweet-purple to-tweet-blue bg-clip-text text-transparent">
          {activeTab === "generate" ? "Tweet Generator" : "Tweet Response Generator"}
        </h2>
        
        <Tabs defaultValue="generate" className="w-full" onValueChange={value => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-auto">
            <TabsTrigger 
              value="generate"
              className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base px-2 min-h-[44px] touch-manipulation"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Generate Tweets</span>
              <span className="xs:hidden">Generate</span>
            </TabsTrigger>
            <TabsTrigger 
              value="respond"
              className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base px-2 min-h-[44px] touch-manipulation"
            >
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Respond to Tweet</span>
              <span className="xs:hidden">Respond</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="mt-0">
            <TweetGeneratorSimple />
          </TabsContent>
          
          <TabsContent value="respond" className="mt-0">
            <TweetResponseGeneratorSimple />
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground border border-muted rounded-lg mx-2 sm:mx-0">
        <p className="font-semibold mb-2">Disclaimer:</p>
        <p className="leading-relaxed">This is an AI-powered tweet generation tool. Always fact-check and verify sources before sharing. Use it responsibly to avoid spreading misinformation or misleading content.</p>
        <p className="text-center mt-2"> ~  PEACE  ~ </p>
      </div>
    </div>
  );
};

export default TweetTabs;
