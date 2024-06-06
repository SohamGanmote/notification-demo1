const { tasks, employees, admin } = require("./data");

const express = require("express");
const cors = require("cors");
const webPush = require("web-push");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));

const vapidKeys = {
	publicKey:
		"BE3MVkmWiJRtwRPbBqpU2e25A57BvBAowXnac5RwddJIqlQGWnk-G9vn0iUf-uam7OjoIfSyJvHjWaeB7vKWFsM",
	privateKey: "-vpD4yXrB6Xc1RYBkS0JcZGY42ToIIkVBgfMXReRxgs",
};

webPush.setVapidDetails(
	"mailto:your-email@example.com",
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

let subscriptions = [];

app.get("/reset", (req, res) => {
	subscriptions = [];
	res.send(subscriptions);
});

app.post("/subscribe", (req, res) => {
	const { subscription, userIdentifier, name } = req.body;
	subscriptions.push({ subscription, userIdentifier, name });
	console.log("User subscribed:", userIdentifier);
	res.status(201).json({});
});

app.post("/sendNotification", (req, res) => {
	const selectedDevices = req.body.devices || [];

	const promises = subscriptions
		.filter((subscription) => {
			return (
				selectedDevices.length === 0 ||
				selectedDevices.includes(subscription.userIdentifier)
			);
		})
		.map((subscription) => {
			const date = new Date();

			const notificationPayload = {
				notification: {
					title: `Hello ${subscription.userIdentifier}`,
					body: `Today's date : ${date}`,
					icon: "path_to_icon/icon.png",
					data: {
						url: "https://www.example.com", // URL to open on click
					},
				},
			};

			return webPush
				.sendNotification(
					subscription.subscription,
					JSON.stringify(notificationPayload)
				)
				.then((response) => console.log("Notification sent:", response))
				.catch((error) => console.error("Error sending notification:", error));
		});

	Promise.all(promises).then(() => res.sendStatus(200));
});

app.post("/login", (req, res) => {
	const { email, pass } = req.body;

	if (email === "admin@gmail.com" && pass === admin.pass) {
		res.send({ login: true, isAdmin: admin });
	}

	const emp = employees.filter((ep) => ep.email === email);

	if (emp.length !== 0 && emp[0].pass === pass) {
		res.send({ login: true, user: emp[0] });
	}

	res.send({ login: false, error: "wrong details" });
});

app.get("/tasks", (req, res) => {
	const empId = req.query.empId;

	if (empId) {
		let assignedTasks = tasks.filter((task) => task.assignedTo === empId);
		res.send(assignedTasks);
	} else res.send(tasks);
});

app.get("/employees", (req, res) => {
	res.json(employees);
});

app.get("/employees/:id", (req, res) => {
	const employeeId = parseInt(req.params.id);
	const employee = employees.find((emp) => emp.id === employeeId);

	if (!employee) {
		return res.status(404).json({ error: "Employee not found" });
	}

	res.json(employee);
});

app.put("/tasks/:id", (req, res) => {
	const taskId = parseInt(req.params.id);
	const { status } = req.body;

	const task = tasks.find((task) => task.id === taskId);

	if (!task) {
		return res.status(404).json({ error: "Task not found" });
	}

	task.status = status;
	res.json(task);
});

app.put("/tasks", (req, res) => {
	const { id, assignedTo } = req.body;

	if (tasks[id - 1].assignedTo === null) {
		tasks[id - 1].assignedTo = assignedTo;
		res.send({ message: "task assigned!" });
		return;
	}

	res.send({ error: "error assigning task!" });
});

app.get("/subscriptions/:id", (req, res) => {
	const userId = req.params.id;

	const deviceDetails = subscriptions.filter(
		(subscription) => subscription.userIdentifier === parseInt(userId)
	);

	res.send(deviceDetails);
});

app.get("/", (req, res) => {
	let htmlContent = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Manage Subscriptions</title>
					<style>
							body {
									font-family: Arial, sans-serif;
									margin: 0;
									padding: 0;
									background-color: #f4f4f4;
							}
							.container {
									max-width: 800px;
									margin: 20px auto;
									padding: 20px;
									background-color: #fff;
									border-radius: 5px;
									box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
							}
							h1, h2 {
									color: #333;
									margin-bottom: 20px;
							}
							ul {
									list-style: none;
									padding: 0;
							}
							li {
									margin-bottom: 10px;
							}
							button {
									background-color: #007bff;
									color: #fff;
									border: none;
									padding: 10px 20px;
									border-radius: 5px;
									cursor: pointer;
							}
							button:hover {
									background-color: #0056b3;
							}
					</style>
			</head>
			<body>
					<div class="container">
							<h1>Manage Subscriptions</h1>
							<h2>List of Subscriptions</h2>
							<ul>
									${subscriptions.map((subscription) => `<li>${subscription.name}</li>`).join("")}
							</ul>
						
									<button id="reset">Reset Subscriptions</button>
							
					</div>
					<script>
					const resetButton = document.getElementById("reset");
					resetButton.addEventListener("click", function() {
						fetch("/reset")
					})
				</script>
			</body>
			</html>
	`;
	res.send(htmlContent);
});

app.listen(8080, () => {
	console.log("Server is running on 8080!");
});
