import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Role } from '../common/enums/role.enum';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Auth(Role.USER)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(
    @Body() createCatDto: CreateCatDto, 
    @ActiveUser() user: UserActiveInterface
  ) {
    return this.catsService.create(createCatDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.catsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @ActiveUser() user: UserActiveInterface) {
    return this.catsService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto, @ActiveUser() user: UserActiveInterface) {
    return this.catsService.update(+id, updateCatDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: UserActiveInterface) {
    return this.catsService.remove(+id, user);
  }
}
