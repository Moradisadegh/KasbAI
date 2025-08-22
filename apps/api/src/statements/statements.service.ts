import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { InjectQueue } from '@nestjs/bull';
// import { Queue } from 'bull';

@Injectable()
export class StatementsService {
  private readonly logger = new Logger(StatementsService.name);

  constructor(
    private prisma: PrismaService,
    // @InjectQueue('file-processing') private fileQueue: Queue,
  ) {}

  async queueStatementProcessing(data: {
    userId: string;
    filePath: string;
    originalName: string;
  }) {
    this.logger.log(`Queueing file ${data.originalName} for user ${data.userId}`);
    // In a real implementation, this would add a job to a BullMQ queue.
    // await this.fileQueue.add('parse-statement', data);

    // For now, we'll just log it. The background worker would handle the rest.
    // The worker would:
    // 1. Create a BankStatement record in 'PENDING' state.
    // 2. Use the parser strategy to extract transactions.
    // 3. Save transactions to the DB.
    // 4. Update the BankStatement record to 'COMPLETED' or 'FAILED'.
    // 5. Encrypt and move the raw file to permanent storage.
    // 6. Delete the temporary file.

    return {
      message: 'File uploaded and is scheduled for processing.',
      filePath: data.filePath,
    };
  }

  async findAllByUserId(userId: string) {
    return this.prisma.bankStatement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        bankName: true,
        periodStart: true,
        periodEnd: true,
        processingStatus: true,
        createdAt: true,
      },
    });
  }
}
