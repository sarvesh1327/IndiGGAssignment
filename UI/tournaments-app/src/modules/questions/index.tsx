import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import getAuthToken from "../../helpers/getAuthToken";

interface Question {
  _id: string,
  title: string;
}

const Slides: React.FC = () => {
  const { id } = useParams<any>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const choices = ["YES", "NO"];
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const bearerToken = getAuthToken();
        setBearerToken(bearerToken);
        const response = await axios.get("http://localhost:4003/questions", {
          headers: { Authorization: `Bearer ${bearerToken}` },
        });
        const data: Question[] = response.data;
        setQuestions(data);
        setCurrentQuestion(data[0]);
        setCurrentIndex(1);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, []);

  const handleChoiceSelect = async (choice: string) => {
    try {
      setSelectedChoice(choice);
      let answer = "false";
      if (choice === "YES") {
        answer = "true";
      }
      const addScoreResponse = await axios.patch(
        `http://localhost:4003/tournaments/${id}/answerQuestion?questionNumber=${currentIndex}&answer=${answer}`,
        {},
        { headers: { Authorization: `Bearer ${bearerToken}` } }
      );
      const addScoreResponseData = addScoreResponse.data;
      if (addScoreResponseData.success) {
        if (currentIndex < questions.length) {
          setCurrentQuestion(questions[currentIndex]);
          setCurrentIndex(currentIndex + 1);
          setSelectedChoice("");
        }
        return;
      } else {
        alert("Issues with selecting answers");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try{

      const submitScoreResponse = await axios.patch(
        `http://localhost:4003/tournaments/${id}/submitScore`,
        {},
        { headers: { Authorization: `Bearer ${bearerToken}` } }
      );
      const submitScoreData = submitScoreResponse.data;
      if(submitScoreData.success){
        navigate(`/`);
        return;
      }
      alert('Issues with submitting score');
    }catch(error){
      console.error(error);
    }

  };

  return (
    <div>
      {currentQuestion ? (
        <div>
          <h2>{currentQuestion.title}</h2>
          <ul>
            {choices.map((choice) => (
              <li key={choice}>
                <button
                  onClick={() => handleChoiceSelect(choice)}
                  style={{
                    backgroundColor:
                      selectedChoice === choice ? "lightblue" : "white",
                  }}
                >
                  {choice}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Slides;
