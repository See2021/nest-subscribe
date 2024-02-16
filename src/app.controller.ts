import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('temp')
  getLatestTemperature(): number | null {
    const latestData = this.appService.getReceivedMessages();
    return latestData ? latestData.temp : null;
  }

  @Get('temp/status')
  calculateLowHighTemperature(): { low: number | null; high: number | null } {
    return this.appService.calculateLowHighTemperature();
  }

  @Get('rain')
  getLatestRainPercentage(): number | null {
    return this.appService.getLatestRainPercentage();
  }

  @Get('humidity')
  getLatestHumidity(): number | null {
    return this.appService.getLatestHumidity();
  }

  @Get('wind/speed')
  getLatestWindSpeed(): number | null {
    return this.appService.getLatestWindSpeed();
  }

  @Get('pump')
  getLatestPump(): number | null {
    return this.appService.getLatestPump();
  }

  @Get('watertank')
  getLatestWatertank(): number | null {
    return this.appService.getLatestWatertank();
  }

  @Get('fertilizer')
  getLatestFertilizer(): number | null {
    return this.appService.getLatestFertilizer();
  }
}
