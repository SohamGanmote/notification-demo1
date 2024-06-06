import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;

function Login() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const response = await fetch(`${baseUrl}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, pass: password }),
		});

		const data = await response.json();

		if (data.login) {
			console.log(data);
			if (data.isAdmin) {
				localStorage.setItem("admin", JSON.stringify(data.isAdmin));
				navigate("/admin");
			} else {
				localStorage.setItem("user", JSON.stringify(data.user));
				navigate("/");
			}
		} else {
			setMessage(data.error || "Login failed!");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-md">
				<h2 className="text-2xl font-bold text-center">Login Page</h2>
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email:
						</label>
						<input
							type="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Password:
						</label>
						<input
							type="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Login
					</button>
					{message && <p className="text-center text-red-500">{message}</p>}
				</form>
			</div>
		</div>
	);
}

export default Login;
