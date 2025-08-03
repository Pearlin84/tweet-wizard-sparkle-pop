import { Feather, Sparkles } from 'lucide-react';

interface PostQuillLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PostQuillLogo = ({ size = 'md', className = '' }: PostQuillLogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const sparkleSize = {
    sm: 8,
    md: 10,
    lg: 12
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Main quill with glowing background */}
      <div className="relative group">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full blur-sm animate-pulse-light opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 rounded-full blur-lg animate-pulse-light opacity-50"></div>
        
        {/* Main icon container */}
        <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-full p-1.5 shadow-lg group-hover:shadow-xl transition-all duration-300">
          <Feather 
            size={iconSizes[size]} 
            className="text-white drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300" 
            strokeWidth={2.5}
          />
        </div>
      </div>

      {/* Sparkle effects around the quill */}
      <Sparkles 
        size={sparkleSize[size]} 
        className="absolute -top-1 -right-1 text-yellow-300 animate-pulse opacity-80" 
      />
      <Sparkles 
        size={sparkleSize[size] - 2} 
        className="absolute -bottom-0.5 -left-0.5 text-blue-300 animate-pulse opacity-60" 
        style={{ animationDelay: '0.5s' }}
      />
      <Sparkles 
        size={sparkleSize[size] - 1} 
        className="absolute top-1/2 -right-2 text-pink-300 animate-pulse opacity-70" 
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
};

export default PostQuillLogo;