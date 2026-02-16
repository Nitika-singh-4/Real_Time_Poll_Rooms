import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CreatePoll from './pages/CreatePoll';
import PollRoom from './pages/PollRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreatePoll />} />
        <Route path="/poll/:roomId" element={<PollRoom />} />
      </Routes>
    </Router>
  );
}
export default App;
