import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const filteredOptions = options
    .map((opt) => opt.trim())
    .filter((opt) => opt !== "");

  if (question.trim() === "") {
    alert("Question cannot be empty.");
    return;
  }

  if (filteredOptions.length < 2) {
    alert("Please provide at least 2 valid options.");
    return;
  }

  try {
    console.log('[CREATE POLL] Sending request:', {
      question: question.trim(),
      options: filteredOptions,
      optionsCount: filteredOptions.length
    });
    
    const response = await axios.post(
      "https://real-time-poll-rooms-l2by.onrender.com/api/polls",
      {
        question: question.trim(),
        options: filteredOptions,
      }
    );

    console.log('[CREATE POLL] Response received:', response.data);

    const roomId =
      response.data.roomId ||
      response.data.poll?.roomId ||
      response.data._id;

    console.log('[CREATE POLL] Room ID extracted:', roomId);

    if (roomId) {
      navigate(`/poll/${roomId}`);
    } else {
      console.error('[CREATE POLL] No room ID in response:', response.data);
      alert("Poll created but room ID not found.");
    }
  } catch (error) {
    console.error('[CREATE POLL] Error occurred');
    console.error('[CREATE POLL] Error message:', error.message);
    console.error('[CREATE POLL] Response data:', error.response?.data);
    console.error('[CREATE POLL] Response status:', error.response?.status);
    console.error('[CREATE POLL] Full error:', error);
    alert(`Error creating poll: ${error.response?.data?.message || error.message}`);
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Create a Poll
          </h2>
          <p className="text-slate-500">Share your question with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question input */}
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              Your Question
            </label>
            <input
              type="text"
              placeholder="What's on your mind?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all text-slate-800"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-800 mb-2">
              Options
            </label>
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(index, e.target.value)
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all text-slate-800"
              />
            ))}
          </div>

          {/* Add option button */}
          <button
            type="button"
            onClick={addOption}
            className="w-full border border-slate-300 rounded-lg py-3 text-slate-800 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <span>+</span>
            <span>Add Another Option</span>
          </button>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-all active:scale-[0.99]"
          >
            Create Poll
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePoll;
