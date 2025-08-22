import { Module } from '@nestjs/common';
import { StatementsController } from './statements.controller';
import { StatementsService } from './statements.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ParsersModule } from '../../../../packages/parsers/src'; // Adjust path as needed

@Module({
  imports: [
    PrismaModule,
    ParsersModule,
    // BullModule.registerQueue({
    //   name: 'file-processing',
    // }),
  ],
  controllers: [StatementsController],
  providers: [StatementsService],
})
export class StatementsModule {}
