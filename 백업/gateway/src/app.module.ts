import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'public'),
      exclude: ['/api*'], // API 라우트 제외
    }),
    // 다른 모듈들...
  ],
})
export class AppModule {}
