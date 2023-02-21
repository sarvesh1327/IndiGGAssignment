import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Tournament {
  _id: number;
  name: string;
  status: string;
  currentPlayers: number;
  gameId: number;
  totalQuestions: number;
  isPlayer: boolean;
  expireAt: Date | string;
  updatedAt: Date | string;
}

interface Leader {
  user: any;
  score: any;
}

const TournamentDetails : React.FC = () => {
  const { id } = useParams<any>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [leaderBoard, setLeaderBoard] = useState<Leader[] | []>([]);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        setBearerToken(token);
        const response = await axios.get(
          `http://localhost:4003/tournaments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: Tournament = response.data;
        setTournament(data);
        const playersResponse = await axios.get(
          `http://localhost:4003/tournaments/${id}/players`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const playersData = playersResponse.data;
        if(playersData.length){

          const leaders: any = [];
          playersData.forEach((player: any) => {
            const {
              score,
              userId: { walletAddress },
            } = player || {};
            leaders.push({ score, user: walletAddress });
          });
          setLeaderBoard(leaders);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTournament();
  }, [id]);
  const handleJoinTournament = async () => {
    // Logic for joining the tournament
    try {
      console.log(bearerToken);
      const response = await axios.post(
        `http://localhost:4003/tournaments/${id}/enterGame`,
        {},
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const enterGameResult = response.data;
      if (!enterGameResult.success) {
        alert("Error while joining Tournament");
        return;
      }
      const { data: enterGameData } = enterGameResult || {};
      const { status } = enterGameData || {};
      if (status === "STARTED") {
        navigate(`/tournaments/${id}/questions`);
        return;
      }else{
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (!tournament) {
    return <div>Loading...</div>;
  }
  if (tournament.status === "PENDING" && tournament.isPlayer) {
    return <div>Waiting for other people to join. Please come back later</div>;
  }
  if (tournament.status === "STARTED" && tournament.isPlayer) {
    navigate(`/tournaments/${id}/questions`);
  }
  if (tournament.status === "ENDED") {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderBoard.map((leader, index) => (
            <tr key={index}>
              <td>{leader.user}</td>
              <td>{leader.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <h1>{tournament.name}</h1>
      <p>Status: {tournament.status}</p>
      {!tournament.isPlayer && tournament.status === "PENDING" && (
        <button
          onClick={handleJoinTournament}
          style={{ position: "absolute", bottom: "10px", right: "10px" }}
        >
          Join Tournament
        </button>
      )}
      {/* Display other tournament details */}
    </div>
  );
};

export default TournamentDetails;
