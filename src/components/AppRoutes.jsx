import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import ArticleList from "./Article/ArticleList";
import Dashboard from "./Dashboard/Dashboard";
import MessagesPage from "./Messages/MessagesPage";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Logout from "./Auth/Logout";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { AuthProvider } from "../context/authContext";
import { ChatProvider } from "../context/chatContext";


const AppRoutes = () => {
    const { loggedIn } = useUser();

    const loggedInRedirect = (element) => {
        if (loggedIn) {
            return <Navigate to="/dashboard" replace />;
        }
        return element;
    };

    const protectedRoute = (element) => {
        if (!loggedIn) {
            return <Navigate to="/login" replace />;
        }
        return element;
    };

    return (
        <AuthProvider>
            <ChatProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/articles" element={<ArticleList />} />
                    <Route path="/dashboard" element={protectedRoute(<Dashboard />)} />
                    <Route path="/messages" element={protectedRoute(<MessagesPage />)} />
                    <Route path="/logout" element={protectedRoute(<Logout />)} />
                    <Route path="/login" element={loggedInRedirect(<Login />)} />
                    <Route path="/signup" element={loggedInRedirect(<Signup />)} />
                </Routes>
            </ChatProvider>
        </AuthProvider>
    );
};

export default AppRoutes;
