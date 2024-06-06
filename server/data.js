const tasks = [
	{
		id: 1,
		title: "task1",
		description:
			"lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem",
		status: "To-Do",
		due: "6-6-2024",
		assignedTo: null,
	},
	{
		id: 2,
		title: "task2",
		description:
			"ipsum ipsum ipsum ipsum ipsum ipsum ipsum ipsum ipsum ipsum ipsum ipsum ipsum",
		status: "To-Do",
		due: "7-6-2024",
		assignedTo: null,
	},
	{
		id: 3,
		title: "task3",
		description:
			"dolor dolor dolor dolor dolor dolor dolor dolor dolor dolor dolor dolor dolor",
		status: "Completed",
		due: "8-6-2024",
		assignedTo: null,
	},
	{
		id: 4,
		title: "task4",
		description: "sit sit sit sit sit sit sit sit sit sit sit sit sit",
		status: "To-Do",
		due: "9-6-2024",
		assignedTo: null,
	},
	{
		id: 5,
		title: "task5",
		description:
			"amet amet amet amet amet amet amet amet amet amet amet amet amet",
		status: "To-Do",
		due: "10-6-2024",
		assignedTo: null,
	},
];

const employees = [
	{
		id: 1,
		name: "John Doe",
		email: "john@gmail.com",
		pass: "1234",
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane@gmail.com",
		pass: "1234",
	},
	{
		id: 3,
		name: "Alice Johnson",
		email: "alice@gmail.com",
		pass: "1234",
	},
];

const admin = {
	name: "admin",
	email: "admin@gmail.com",
	pass: "1234",
	isAdmin: true,
};

module.exports = { admin, employees, tasks };
