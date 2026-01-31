import { Test, TestingModule } from '@nestjs/testing';
import { DailyEmailService } from './daily-email.service';

describe('DailyEmailService', () => {
  let service: DailyEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyEmailService],
    }).compile();

    service = module.get<DailyEmailService>(DailyEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
