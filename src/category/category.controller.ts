import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiBody({ type: [CreateCategoryDto] })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiBody({ type: CreateCategoryDto })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCategoryDto })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBody({ type: UpdateCategoryDto })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
