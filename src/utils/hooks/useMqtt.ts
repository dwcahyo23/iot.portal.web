import mqtt from 'mqtt';
import { useEffect, useState } from 'react';

interface MqttMessage {
	topic: string;
	payload: any;
}

const useMqtt = (topics: string[], brokerUrl: string = 'ws://192.168.192.7:8083/mqtt') => {
	// Store the last message for each topic
	const [messages, setMessages] = useState<Record<string, MqttMessage>>({});

	useEffect(() => {
		const clientId = `mqttjs_${Math.random().toString(16).slice(2, 8)}`;

		const options: mqtt.IClientOptions = {
			clientId,
			keepalive: 0, // Keep the connection alive
			clean: true,
			reconnectPeriod: 10000, // Reconnect if the connection is lost
			connectTimeout: 30 * 1000, // Connection timeout
		};

		// Create an MQTT client
		const client = mqtt.connect(brokerUrl, options);

		// Subscribe to provided topics
		client.on('connect', () => {
			console.log('Connected to MQTT broker');
			topics.forEach((topic) => {
				client.subscribe(topic, (err) => {
					if (err) {
						console.error(`Failed to subscribe to ${topic}`, err);
					}
				});
			});
		});

		// Handle incoming messages
		client.on('message', (topic, message) => {
			const payload = message.toString();

			// Update state with the last message for the topic
			setMessages((prevMessages) => ({
				...prevMessages,
				[topic]: { topic, payload }, // Replace the previous message with the new one
			}));
		});

		client.on('error', (error) => {
			console.error('MQTT connection error:', error);
		});

		// Cleanup
		return () => {
			client.end(true);
		};
	}, [brokerUrl, topics]);

	return { messages };
};

export default useMqtt;
