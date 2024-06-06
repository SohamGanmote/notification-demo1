const publicVapidKey =
	"BE3MVkmWiJRtwRPbBqpU2e25A57BvBAowXnac5RwddJIqlQGWnk-G9vn0iUf-uam7OjoIfSyJvHjWaeB7vKWFsM";

if ("serviceWorker" in navigator) {
	send().catch((err) => console.error(err));
}

async function send() {
	// Register Service Worker
	const register = await navigator.serviceWorker.register("/worker.js", {
		scope: "/",
	});

	// Register Push
	const subscription = await register.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
	});

	// Send Push Notification
	await fetch("/subscribe", {
		method: "POST",
		body: JSON.stringify(subscription),
		headers: {
			"Content-Type": "application/json",
		},
	});
}

function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
