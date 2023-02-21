import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import getAuthToken from "../../helpers/getAuthToken";
import "./tournament.css";

interface Tournament {
  _id: number;
  name: string;
  status: string;
  currentPlayers: number;
  gameId: number;
  totalQuestions: number;
  expireAt: Date | string;
  updatedAt: Date | string;
}

const Home: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get("http://localhost:4003/tournaments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Tournament[] = response.data;
        setTournaments(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTournaments();
  }, []);
  console.log(tournaments);
  return (
    <div>
      <h1>Tournaments</h1>
      <div className="card-container">
        {tournaments.map((tournament) => (
          <div key={tournament._id}
            className={`card ${tournament.status === "ENDED" ? "ended" : ""}`}
          >
            <Link key={tournament._id} to={`/tournaments/${tournament._id}`}>
              <h2>{tournament.name}</h2>
            </Link>
            <p>Status: {tournament.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
