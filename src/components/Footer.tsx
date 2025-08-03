
import PostQuillLogo from "@/components/PostQuillLogo";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-16 border-t border-border">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <PostQuillLogo size="sm" />
          <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">PostQuill</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Create viral tweets with AI-powered insights. ✨
        </p>
        
        <div className="mt-4 text-xs text-muted-foreground">
          © 2025 PostQuill. A product of LumeMetrics. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
