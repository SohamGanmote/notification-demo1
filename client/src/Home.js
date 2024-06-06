import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;

function Home() {
	const user = localStorage.getItem("user");
	const userDetails = JSON.parse(user);

	const navigate = useNavigate();

	const [tasks, setTasks] = useState([]);

	const [notificationPermission, setNotificationPermission] = useState(
		Notification.permission
	);

	const uniqueDeviceId = userDetails?.id;

	useEffect(() => {
		if (user) requestNotificationPermission();
	}, []);

	const requestNotificationPermission = async () => {
		const permission = await Notification.requestPermission();
		setNotificationPermission(permission);
	};

	useEffect(() => {
		if ("serviceWorker" in navigator && notificationPermission === "granted") {
			navigator.serviceWorker.ready.then((registration) => {
				if (registration.pushManager) {
					registration.pushManager.getSubscription().then((subscription) => {
						// if (!subscription) {
						registerPush();
						// }
					});
				}
			});
		}
	}, [notificationPermission]);

	const registerPush = async () => {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				"BE3MVkmWiJRtwRPbBqpU2e25A57BvBAowXnac5RwddJIqlQGWnk-G9vn0iUf-uam7OjoIfSyJvHjWaeB7vKWFsM"
			),
		});

		await fetch(`${baseUrl}/subscribe`, {
			method: "POST",
			body: JSON.stringify({
				subscription,
				userIdentifier: uniqueDeviceId,
				name: userDetails?.name,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	const urlBase64ToUint8Array = (base64String) => {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding)
			.replace(/-/g, "+")
			.replace(/_/g, "/");
		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);
		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	};

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await fetch(
					`${baseUrl}/tasks?empId=${userDetails.id}`
				);
				const data = await response.json();
				setTasks(data);
			} catch (error) {
				console.error("Error fetching tasks:", error);
			}
		};

		if (user) fetchTasks();
	}, []);

	const handleTaskDone = async (taskId) => {
		try {
			await fetch(`${baseUrl}/tasks/${taskId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: "Done" }),
			});
			// Update the tasks after marking one as done
			const updatedTasks = tasks.map((task) =>
				task.id === taskId ? { ...task, status: "Done" } : task
			);
			setTasks(updatedTasks);
		} catch (error) {
			console.error("Error marking task as done:", error);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<div className="max-w-4xl mx-auto py-8">
			<div className="flex justify-between items-center mb-8">
				<h2 className="text-2xl font-bold">Home Page</h2>
				<button
					className="bg-red-500 text-white px-4 py-2 rounded-md"
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
			<p className="mb-4">Welcome to the home page!</p>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{tasks.map((task) => (
					<div key={task.id} className="bg-white shadow-md rounded-md p-4">
						<h4 className="text-lg font-semibold mb-2">{task.title}</h4>
						<p className="text-gray-600 mb-2">{task.description}</p>
						<p className="text-sm text-gray-500 mb-1">Status: {task.status}</p>
						<p className="text-sm text-gray-500">Due: {task.due}</p>
						{task.status !== "Done" && (
							<button
								className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
								onClick={() => handleTaskDone(task.id)}
							>
								Mark as Done
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default Home;
