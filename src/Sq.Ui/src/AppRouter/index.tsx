import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage, LocationQuizPage, LocationModeSelectPage, LookalikeQuizPage, LookalikeModeSelectPage } from "../views";


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/location-mode-select" element={<LocationModeSelectPage />} />
                <Route path="/quiz" element={<LocationQuizPage />} />
                <Route path="/lookalike-mode-select" element={<LookalikeModeSelectPage />} />
                <Route path="/lookalike-quiz" element={<LookalikeQuizPage />} />
            </Routes>
        </BrowserRouter>
    );
}
