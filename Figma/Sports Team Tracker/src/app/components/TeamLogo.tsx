import { Shield } from 'lucide-react';

interface TeamLogoProps {
  teamName: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TeamLogo({ teamName, size = 'md' }: TeamLogoProps) {
  // Generate team colors based on team name
  const getTeamColors = (name: string): { primary: string; secondary: string } => {
    const colors: Record<string, { primary: string; secondary: string }> = {
      'Manchester United': { primary: '#DC143C', secondary: '#FFD700' },
      'Liverpool FC': { primary: '#C8102E', secondary: '#00B2A9' },
      'Real Madrid': { primary: '#FFFFFF', secondary: '#FFD700' },
      'FC Barcelona': { primary: '#004D98', secondary: '#A50044' },
      'Bayern Munich': { primary: '#DC052D', secondary: '#0066B2' },
      'Paris Saint-Germain': { primary: '#004170', secondary: '#DA291C' },
    };
    return colors[name] || { primary: '#1E40AF', secondary: '#60A5FA' };
  };

  // Generate initials
  const getInitials = (name: string): string => {
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  };

  const colors = getTeamColors(teamName);
  const initials = getInitials(teamName);

  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-base',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Shield background */}
      <Shield 
        className={`absolute ${iconSizes[size]} opacity-20`}
        style={{ color: colors.secondary }}
      />
      
      {/* Team badge */}
      <div
        className="relative rounded-full flex items-center justify-center font-bold shadow-lg border-2"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          borderColor: colors.secondary,
          width: '100%',
          height: '100%',
          color: colors.primary === '#FFFFFF' ? '#000000' : '#FFFFFF',
        }}
      >
        {initials}
      </div>
    </div>
  );
}
