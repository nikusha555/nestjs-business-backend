import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import { newsDto } from './dto/news.dto';

@Controller('news')
export class NewsController { 
    constructor(private readonly newsService: NewsService) { }

    @Get()
    async getAllNews() {
        return this.newsService.findAll(); 
    }

    @Get(':id')
    async getNewsById(@Param('id') id: number) {
        return this.newsService.findOne(id);
    }

    @Post('')
    async addNews(@Body() body: newsDto) {
        return this.newsService.createNews(body);
    }

    @Post('edit/:id')
    async editNews(@Param('id') id: number, @Body() body: newsDto) {
        return this.newsService.editNews(id, body);
    }

    @Delete('/:id')
    async deleteNews(@Param('id') id: number) {
        return this.newsService.remove(id);
    }   

}
