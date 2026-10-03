import { createContext, useState, useEffect} from "react";
import { getMe } from "./services/auth.api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            const fetchUser = async () => {
                setLoading(true);
                try {
                    const userData = await getMe();
                    setUser(userData.user);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    return false;
                } finally {
                    setLoading(false);
                }
            };
    
            fetchUser();
        }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
