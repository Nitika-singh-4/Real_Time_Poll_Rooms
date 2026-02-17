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
      console.log('[FETCH POLL] Fetching poll:', roomId);
      
      const response = await axios.get(
        `https://real-time-poll-rooms-l2by.onrender.com/api/polls/${roomId}`
      );
      
      console.log('[FETCH POLL] Poll data received:', response.data);
      setPoll(response.data);
    } catch (error) {
      console.error('[FETCH POLL] Error occurred');
      console.error('[FETCH POLL] Error message:', error.message);
      console.error('[FETCH POLL] Response data:', error.response?.data);
      console.error('[FETCH POLL] Response status:', error.response?.status);
      console.error('[FETCH POLL] Full error:', error);
    }
  };

  const handleVote = async (index) => {
    try {
      let fingerprint = localStorage.getItem("fingerprint");

      if (!fingerprint) {
        fingerprint = uuidv4();
        localStorage.setItem("fingerprint", fingerprint);
        console.log('[VOTE] New fingerprint generated:', fingerprint);
      } else {
        console.log('[VOTE] Using existing fingerprint:', fingerprint);
      }

      console.log('[VOTE] Submitting vote:', { roomId, optionIndex: index, fingerprint });

      const response = await axios.post(
        `https://real-time-poll-rooms-l2by.onrender.com/api/polls/${roomId}/vote`,
        {
          optionIndex: index,
          fingerprint,
        }
      );

      console.log('[VOTE] Vote successful:', response.data);
      setSelectedIndex(index);
      setHasVoted(true);
    } catch (error) {
      console.error('[VOTE] Error occurred');
      console.error('[VOTE] Error message:', error.message);
      console.error('[VOTE] Response data:', error.response?.data);
      console.error('[VOTE] Response status:', error.response?.status);
      console.error('[VOTE] Full error:', error);
      alert(error.response?.data?.message || "Voting failed");
    }
  };

  if (!poll) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full">
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            Poll Not Found
          </h2>
          <p className="text-slate-500">
            The poll you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-10">

        {/* Question Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-slate-800 mb-4">
            {poll.question}
          </h1>

          <div className="inline-block bg-green-50 text-green-700 text-sm font-medium px-5 py-2 rounded-full">
            {totalVotes} Total Votes
          </div>
        </div>

        {/* Options */}
        <div className="space-y-8">
          {poll.options.map((option, index) => {
            const percentage =
              totalVotes === 0
                ? 0
                : ((option.votes / totalVotes) * 100).toFixed(1);

            return (
              <div key={index} className="space-y-3">

                {/* Option Button */}
                <button
                  onClick={() => handleVote(index)}
                  disabled={hasVoted}
                  className={`w-full px-6 py-4 rounded-2xl text-left text-lg font-medium border transition-all duration-200
                  ${
                    selectedIndex === index
                      ? "bg-green-700 text-white border-green-700 shadow-lg"
                      : hasVoted
                      ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed"
                      : "bg-white text-slate-800 border-slate-300 hover:border-green-700 hover:bg-green-50 hover:scale-[1.01]"
                  }`}
                >
                  {option.text}
                </button>

                {/* Progress Bar */}
                <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-green-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Vote Stats */}
                <div className="flex justify-between text-sm text-slate-500">
                  <span>{option.votes} votes</span>
                  <span className="font-semibold text-slate-700">
                    {percentage}%
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Vote Confirmation */}
        {hasVoted && (
          <div className="mt-10 text-center bg-green-50 border border-green-200 rounded-2xl py-4">
            <p className="text-green-700 font-medium text-lg">
              ✓ Your vote has been recorded
            </p>
          </div>
        )}

        

      </div>
    </div>
  );
}

export default PollRoom;
