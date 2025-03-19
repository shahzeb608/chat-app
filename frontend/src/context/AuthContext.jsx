import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		const verifyAuth = async () => {
			if (!authUser) {
				setLoading(false);
				return;
			}
			
			try {
				console.log("Verifying authentication status");
				const res = await fetch("/api/auth/verify", {
					credentials: "include"
				});
				
				if (!res.ok) {
					console.warn("Auth verification failed, clearing user data");
					localStorage.removeItem("chat-user");
					setAuthUser(null);
					toast.error("Session expired, please login again");
				} else {
					console.log("Auth verification successful");
				}
			} catch (error) {
				console.error("Auth verification error:", error);
				localStorage.removeItem("chat-user");
				setAuthUser(null);
			} finally {
				setLoading(false);
			}
		};

		verifyAuth();
	}, [authUser]);

	const value = {
		authUser,
		setAuthUser,
		loading
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};