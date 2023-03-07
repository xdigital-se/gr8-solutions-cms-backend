import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiTags, ApiBody, ApiResponse, ApiParam, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tags')
@ApiBearerAuth()
@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({
    schema: { example: { id: 1, name: 'tag name' } },
    status: 201,
  })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @ApiResponse({ type: [CreateTagDto], status: 200 })
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'id of tag' })
  @ApiResponse({ type: CreateTagDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'id of tag' })
  @ApiResponse({ type: CreateTagDto })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'id of tag' })
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
