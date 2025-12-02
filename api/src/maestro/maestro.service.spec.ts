import { Test, TestingModule } from '@nestjs/testing';
import { MaestrosService } from './maestro.service';

describe('MaestrosService', () => {
  let service: MaestrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaestrosService],
    }).compile();

    service = module.get<MaestrosService>(MaestrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
