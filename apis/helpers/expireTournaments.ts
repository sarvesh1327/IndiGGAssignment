import { differenceInSeconds } from 'date-fns';
import { tournamentService } from '../services/tournaments.service';
import { playersService } from '../services/players.service';
import { addScore } from '../livecopy/addScore';
import { endGame } from '../livecopy/endGame';
import { delayWithTime } from '../utils/helper';

//expires the tournament once time exceeds expireAt timef
async function expireTournament(tournamentId: string) {
  try {
    console.log('starting an tournament %s', tournamentId);
    const tournamentData = await tournamentService().findOneById({
      id: tournamentId,
    });
    if (!tournamentData) {
      console.log('Invalid TournamentId %s', tournamentId);
      return;
    }
    const { gameId, expireAt } = tournamentData || {};
    const timeRemaining = differenceInSeconds(expireAt, new Date());
    //adding a delay of time remaining between expireAt and current time
    await delayWithTime(timeRemaining);
    console.log(
      `Tournament ${tournamentId} will expire in ${timeRemaining} seconds`,
    );
    // once time is over it expires tournament
    await tournamentService().expireTournament({ id: tournamentId });
    //fetches all the players with unsubmitted score
    const playersWithoutSubmittedScore = await playersService().playersWithUnsubmittedScore(
      { tournamentId },
    );
    //if there is no player without unsubmitted score then just ending the game on blockchain
    if (!playersWithoutSubmittedScore.length) {
      await endGame(gameId);
      return;
    }
    const playerIds: any[] = [];
    const scoresAdded: any[] = [];
    //if there are some scores to be submitted then they are submitted here with delay to handle the nonce properly
    for (let i = 0; i < playersWithoutSubmittedScore.length; i++) {
      const { _id, score, userId } = playersWithoutSubmittedScore[i] || {};
      const { walletAddress } = userId || {};
      await delayWithTime(10);
      const scoreAdded = await addScore(gameId, score, walletAddress);
      scoresAdded.push(scoreAdded);
      playerIds.push(_id);
    }
    //updating the score to submitted in DB then ending the game of Blockchain
    await playersService().updateManyToScoreSubmitted({ playerIds });
    await delayWithTime(20);
    if (!scoresAdded.includes(false)) {
      await endGame(gameId);
    }
    return;
  } catch (error) {
    console.error(error);
  }
}

export default expireTournament;
