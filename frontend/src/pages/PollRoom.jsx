import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import { v4 as uuidv4 } from "uuid";

function PollRoom() {
  const { roomId } = useParams();
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    fetchPoll();
    socket.emit("joinRoom", roomId);

    socket.on("resultsUpdated", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.off("resultsUpdated");
    };
  }, [roomId]);

  const fetchPoll = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/polls/${roomId}`
      );
      setPoll(response.data);
    } catch (error) {
      console.error("Poll not found");
    }
  };

  const handleVote = async (index) => {
    try {
      let fingerprint = localStorage.getItem("fingerprint");

      if (!fingerprint) {
        fingerprint = uuidv4();
        localStorage.setItem("fingerprint", fingerprint);
      }

      await axios.post(
        `http://localhost:5000/api/polls/${roomId}/vote`,
        {
          optionIndex: index,
          fingerprint,
        }
      );

      setSelectedIndex(index);
      setHasVoted(true);
    } catch (error) {
      alert(error.response?.data?.message || "Voting failed");
    }
  };

  if (!poll) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold text-red-500">
          Poll Not Found
        </h2>
      </div>
    </div>
  );
}


  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {poll.question}
        </h2>

        <p className="text-gray-500 mb-6">
          Total Votes: {totalVotes}
        </p>

        <div className="space-y-4">
          {poll.options.map((option, index) => {
            const percentage =
              totalVotes === 0
                ? 0
                : ((option.votes / totalVotes) * 100).toFixed(1);

            return (
              <div key={index}>
                <button
                  onClick={() => handleVote(index)}
                  disabled={hasVoted}
                  className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                    selectedIndex === index
                      ? "bg-green-500 text-white"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {option.text}
                </button>

                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div
                    className="bg-green-500 h-2 rounded transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {option.votes} votes ({percentage}%)
                </p>
              </div>
            );
          })}
        </div>

        {hasVoted && (
          <p className="mt-6 text-green-600 font-medium">
            ✅ You have voted
          </p>
        )}
      </div>
    </div>
  );
}

export default PollRoom;
