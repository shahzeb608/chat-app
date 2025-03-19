import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username, password) => {
		const success = handleInputErrors(username, password);
		if (!success) return;
		
		setLoading(true);
		try {
			console.log("Attempting login with:", { username });
			
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
				credentials: "include"  // This is crucial
			});
			
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || "Login failed");
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
			
			
			const verifyRes = await fetch("/api/auth/verify", {
				credentials: "include"
			});
			
			if (!verifyRes.ok) {
				console.warn("Auth verification failed after login");
			} else {
				console.log("Auth verification successful");
			}
			
			toast.success("Logged in successfully!");
		} catch (error) {
			console.error("Login error:", error);
			toast.error(error.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}