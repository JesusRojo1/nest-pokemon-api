import { SeedService } from './seed.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@Controller('seed')
export class SeedController {
  constructor(private readonly SeedService: SeedService) {}

  @Get()
  executeSeed() {
    return this.SeedService.executeSeed();
  }
}
