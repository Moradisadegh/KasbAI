import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatementsService } from './statements.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('statements')
@UseGuards(JwtAuthGuard)
export class StatementsController {
  constructor(private readonly statementsService: StatementsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads_tmp', // Temporary storage
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadStatement(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(pdf|csv|xlsx)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ) {
    // The service will queue this for processing
    return this.statementsService.queueStatementProcessing({
      userId: req.user.userId,
      filePath: file.path,
      originalName: file.originalname,
    });
  }

  @Get()
  async getStatements(@Request() req) {
    return this.statementsService.findAllByUserId(req.user.userId);
  }
}
