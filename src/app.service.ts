import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';

interface SensorData {
  temp: number;
  humidity: {
    base: number;
    relative: number;
  };
  rain_gauge: {
    volume: number;
    intensity: number;
    presence: number;
    fill_percentage: number;
    threshold: number;
    drying_time: number;
  };
  wind_speed: number;
  wind_direction: number;
  pump: {
    temperature: number;
    status: number;
  }
  water_tank: number
  fertilizer: number
}

@Injectable()
export class AppService {
  private mqttClient: mqtt.MqttClient;
  private receivedMessages: SensorData[] = [];
  private lowTemperature: number | null = null;
  private highTemperature: number | null = null;

  constructor() {
    // Connect to MQTT broker
    this.mqttClient = mqtt.connect('mqtt://172.23.80.1:1883', {
      username: 'mqtt',
      password: 'mn403193'
    });


    // Subscribe to the "Temperature" topic
    this.mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.mqttClient.subscribe('farm/1/sensors/', (err) => {
        if (err) {
          console.error('Failed to subscribe:', err);
        } else {
          console.log('Subscribed to farm topic');
        }
      });
    });

    this.mqttClient.on('message', (topic, message) => {
      const sensorData: SensorData = JSON.parse(message.toString());
      this.receivedMessages.push(sensorData);
      console.log('Received sensor data:', sensorData);
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  // Function to get latest temperature
  getReceivedMessages(): SensorData | null { // Return type modified
    const latestData = this.receivedMessages.length > 0 ? this.receivedMessages[this.receivedMessages.length - 1] : null;
    return latestData;
  }

  // Calculates low/high of ALL received temperatures 
  calculateLowHighTemperature(): { low: number | null, high: number | null } {
    if (this.receivedMessages.length === 0) {
      return { low: null, high: null };
    }

    const allTemperatures = this.receivedMessages.map(data => data.temp);
    const sortedTemperatures = allTemperatures.sort((a, b) => a - b);
    return {
      low: sortedTemperatures[0],
      high: sortedTemperatures[sortedTemperatures.length - 1]
    };
  }

  getLatestRainPercentage(): number | null {
    const latestData = this.getReceivedMessages();
    if (!latestData || !latestData.rain_gauge) {
      return null;
    }
    const MAX_VOLUME = 20; // Milliliters
    const fillPercentage = (latestData.rain_gauge.volume / MAX_VOLUME) * 100;
    return fillPercentage;
  }

  getLatestHumidity(): number | null {
    const latestData = this.getReceivedMessages();
    return latestData ? latestData.humidity.base : null;
  }

  getLatestWindSpeed(): number | null {
    const latestData = this.getReceivedMessages();

    if (!latestData) {
      return null;
    }

    const windSpeedKmh = latestData.wind_speed * 3.6; // Conversion from m/s to km/h
    return windSpeedKmh;
  }

  getLatestPump(): number | null {
    const latestData = this.getReceivedMessages();
    return latestData ? latestData.pump.temperature : null;
  }

  getLatestWatertank(): number | null {
    const latestData = this.getReceivedMessages();
    return latestData ? latestData.water_tank : null;
  }

  getLatestFertilizer(): number | null {
    const latestData = this.getReceivedMessages();
    return latestData ? latestData.fertilizer : null;
  }
}
