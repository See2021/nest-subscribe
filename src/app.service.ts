import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class AppService {
  private mqttClient: mqtt.MqttClient;
  private receivedMessages: number[] = [];
  private lowTemperature: number | null = null;
  private highTemperature: number | null = null;

  constructor() {
    // Connect to MQTT broker
    this.mqttClient = mqtt.connect('mqtt://mqtt.eclipseprojects.io');

    // Subscribe to the "Temperature" topic
    this.mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.mqttClient.subscribe('Temperature', (err) => {
        if (err) {
          console.error('Failed to subscribe:', err);
        } else {
          console.log('Subscribed to Temperature topic');
        }
      });
    });

    // this.mqttClient.on('connect', () => {
    //   console.log('Connected to MQTT broker');
    //   const topics = ['Temperature', 'Pump', 'Fertilizer', 'Tank'];
    //   topics.forEach(topic => {
    //     this.mqttClient.subscribe(topic, (err) => {
    //       if (err) {
    //         console.error(`Failed to subscribe to ${topic}:`, err);
    //       } else {
    //         console.log(`Subscribed to ${topic} topic`);
    //       }
    //     });
    //   });
    // });

    this.mqttClient.on('message', (topic, message) => {
      const messageText = message.toString();
      const temperatureValue = parseFloat(messageText);
      console.log(`Received message: ${messageText} from topic: ${topic}`);
      this.receivedMessages.push(temperatureValue);
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  getReceivedMessages(): number | null {
    const latestTemperature = this.receivedMessages.length > 0 ? this.receivedMessages[this.receivedMessages.length - 1] : null;
    return latestTemperature;
  }

  calculateLowHighTemperature(): { low: number | null, high: number | null } {
    if (this.receivedMessages.length === 0) {
      return { low: null, high: null };
    }

    const sortedTemperatures = this.receivedMessages.slice().sort((a, b) => a - b);
    const low = sortedTemperatures[0];
    const high = sortedTemperatures[sortedTemperatures.length - 1];

    return { low, high };
  }
}
