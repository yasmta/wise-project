import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Information from './pages/Information';
import Challenges from './pages/Challenges';
import Ranking from './pages/Ranking';
import Community from './pages/Community';
import Profile from './pages/Profile';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-layout">
                    <Navbar />
                    <main className="app-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/informacion" element={<Information />} />
                            <Route path="/challenges" element={<Challenges />} />
                            <Route path="/ranking" element={<Ranking />} />
                            <Route path="/comunidad" element={<Community />} />
                            <Route path="/profile/:username" element={<Profile />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
