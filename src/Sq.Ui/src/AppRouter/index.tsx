import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage, QuizPage, ModeSelectPage } from "../views";


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/mode-select" element={<ModeSelectPage />} />
                <Route path="/quiz" element={<QuizPage />} />
            </Routes>
        </BrowserRouter>
    );
}
