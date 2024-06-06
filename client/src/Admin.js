import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;

function Admin() {
	const navigate = useNavigate();

	const [tasks, setTasks] = useState([]);
	const [employees, setEmployees] = useState([]);

	useEffect(() => {
		const adminData = localStorage.getItem("admin");
		if (!adminData) {
			navigate("/login");
		}

		const fetchTasks = async () => {
			try {
				const response = await fetch(`${baseUrl}/tasks`);
				const data = await response.json();
				setTasks(data);
			} catch (error) {
				console.error("Error fetching tasks:", error);
			}
		};
		fetchTasks();

		const fetchEmployees = async () => {
			try {
				const response = await fetch(`${baseUrl}/employees`);
				const data = await response.json();
				setEmployees(data);
			} catch (error) {
				console.error("Error fetching employees:", error);
			}
		};
		fetchEmployees();
	}, [navigate]);

	const getEmployeeName = (employeeId) => {
		const employee = employees.find((emp) => emp.id === parseInt(employeeId));
		return employee ? employee.name : "Unknown";
	};

	const handleAssignTask = async (taskId, employeeId) => {
		try {
			const response = await fetch(`${baseUrl}/tasks`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: taskId, assignedTo: employeeId }),
			});
			const data = await response.json();
			console.log(data.message);
			const updatedTasks = tasks.map((task) =>
				task.id === taskId ? { ...task, assignedTo: employeeId } : task
			);
			setTasks(updatedTasks);
		} catch (error) {
			console.error("Error assigning task:", error);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("admin");
		navigate("/login");
	};

	const sendNotification = async (userDetails) => {
		const response = await fetch(`${baseUrl}/subscriptions/${userDetails}`);
		const deviceDetails = await response.json();

		console.log(deviceDetails);

		fetch(`${baseUrl}/sendNotification`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ devices: deviceDetails }),
		});
	};

	return (
		<div className="max-w-4xl mx-auto py-8">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Admin Page</h2>
				<button
					onClick={handleLogout}
					className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md"
				>
					Logout
				</button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{tasks.map((task) => (
					<div key={task.id} className="bg-white shadow-md rounded-md p-4">
						<h4 className="text-lg font-semibold mb-2">{task.title}</h4>
						<p className="text-gray-600 mb-2">{task.description}</p>
						<p className="text-sm text-gray-500 mb-1">Status: {task.status}</p>
						<p className="text-sm text-gray-500">Due: {task.due}</p>
						{task.assignedTo === null ? (
							<div className="mt-2">
								<select
									className="border border-gray-300 rounded-md px-2 py-1"
									onChange={(e) =>
										handleAssignTask(task.id, parseInt(e.target.value))
									}
								>
									<option value="">Assign to:</option>
									{employees.map((employee) => (
										<option key={employee.id} value={employee.id}>
											{employee.name}
										</option>
									))}
								</select>
							</div>
						) : (
							<div className="mt-2">
								<button
									className="bg-blue-500 text-white px-4 py-2 rounded-md"
									onClick={() => sendNotification(task.assignedTo)}
								>
									Notify
								</button>
								<p className="text-sm text-gray-500 mt-2">
									Assigned to: {getEmployeeName(task.assignedTo)}
								</p>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default Admin;
