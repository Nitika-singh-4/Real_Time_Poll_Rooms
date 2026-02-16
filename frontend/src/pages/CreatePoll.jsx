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

  // Remove empty options
  const filteredOptions = options
    .map(opt => opt.trim())
    .filter(opt => opt !== "");

  // Validation: At least 2 non-empty options
  if (filteredOptions.length < 2) {
    alert("Please provide at least 2 valid options.");
    return;
  }

  if (question.trim() === "") {
    alert("Question cannot be empty.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/polls",
      {
        question: question.trim(),
        options: filteredOptions,
      }
    );

    navigate(`/poll/${response.data.roomId}`);

  } catch (error) {
    alert("Error creating poll");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create a Poll
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) =>
                handleOptionChange(index, e.target.value)
              }
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <button
            type="button"
            onClick={addOption}
            className="text-blue-600 text-sm hover:underline"
          >
            + Add Option
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Poll
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePoll;
