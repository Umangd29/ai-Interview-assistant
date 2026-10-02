import {useContext, useEffect} from "react";
import { AuthContext } from "../auth.context.jsx";
import { loginUser, registerUser, logoutUser, getMe } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({email, password}) => {
        setLoading(true);
        try {
            const userData = await loginUser({email, password});
            setUser(userData.user);
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({username, email, password}) => {
        setLoading(true);
        try {
            const userData = await registerUser({username, email, password});
            setUser(userData.user);
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const userData = await getMe();
            setUser(userData.user);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            const fetchUser = async () => {
                setLoading(true);
                try {
                    const userData = await getMe();
                    setUser(userData.user);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchUser();
        }, []);

    return { user, handleLogin, handleRegister, handleLogout, fetchUserProfile, loading, setLoading };  
}