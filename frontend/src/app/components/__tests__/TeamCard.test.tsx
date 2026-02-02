import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamCard } from '@/app/components/TeamCard';
import type { Team } from '@/app/types/sports';
import { describe, expect, it, vi } from 'vitest';

const baseTeam: Team = {
  id: 'team-1',
  apiId: 101,
  name: 'Brazil',
  fifaCode: 'BRA',
  country: 'Brazil',
  flagUrl: 'https://flags.example/bra.png',
  worldRanking: 1,
};

describe('TeamCard', () => {
  it('renders team details', () => {
    render(
      <TeamCard
        team={baseTeam}
        isFollowing={false}
        onToggleFollow={vi.fn()}
        onViewDetails={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: 'Brazil' })).toBeInTheDocument();
    expect(screen.getByText('BRA - Brazil')).toBeInTheDocument();
    expect(screen.getByText('Rank: 1')).toBeInTheDocument();
    expect(screen.getByText('Code: BRA')).toBeInTheDocument();
  });

  it('fires callbacks when actions are clicked', async () => {
    const user = userEvent.setup();
    const onToggleFollow = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <TeamCard
        team={baseTeam}
        isFollowing={true}
        onToggleFollow={onToggleFollow}
        onViewDetails={onViewDetails}
      />
    );

    await user.click(screen.getByRole('button', { name: /unfollow team/i }));
    expect(onToggleFollow).toHaveBeenCalledWith('team-1');

    await user.click(screen.getByRole('button', { name: /details/i }));
    expect(onViewDetails).toHaveBeenCalledWith(baseTeam);
  });
});
