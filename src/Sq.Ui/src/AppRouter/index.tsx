import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage, QuizPage } from "../views";


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/quiz" element={<QuizPage />} />
            </Routes>
        </BrowserRouter>
    );
}
