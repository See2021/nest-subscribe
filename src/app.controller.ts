import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('temp')
  getReceivedMessages(): number | null {
    return this.appService.getReceivedMessages();
  }

  @Get('temp/status')
  calculateLowHighTemperature(): { low: number | null, high: number | null } {
    return this.appService.calculateLowHighTemperature();
  }
}
