import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/enums/role.enum';
import { Repository } from 'typeorm';
import { Breed } from '../breeds/entities/breed.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>
  ) {}

  async create(
    createCatDto: CreateCatDto,  
    user: UserActiveInterface
  ) {
    // verificar si existe la raza
    const breed = await this.validateBreed(createCatDto.breed);

    const cat = this.catRepository.create({
      ...createCatDto,
      breed,
      userEmail: user.email,
    });

    return await this.catRepository.save(cat);
  }

  async findAll(user: UserActiveInterface) {
    // si el rol es admin, devuelve todos los cat[] - es un superadmin
    if(user.role === Role.ADMIN) {
      return await this.catRepository.find();
    }
    // esto solamente devuelve los gatos creados por este user
    return await this.catRepository.find({
      where: { userEmail: user.email },
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) {
      throw new BadRequestException('Cat not found');
    }
    // tanto el adminstrador como el creador del gato pueden ver la información
    this.validateOwnership(cat, user);

    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: UserActiveInterface) {
    await this.findOne(id, user);
    return await this.catRepository.update(id, {
      ...updateCatDto,
      breed: updateCatDto.breed ? await this.validateBreed(updateCatDto.breed) : undefined,
      userEmail: user.email,
    })
  }

  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id, user );
    return await this.catRepository.softDelete({ id });
  }

  // tanto el adminstrador como el creador del gato pueden ver la información
  private validateOwnership(cat: Cat, user: UserActiveInterface) {
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException();
    }
  }

  // verificar si existe la raza
  private async validateBreed(breed: string) {
    const breedEntity = await this.breedRepository.findOneBy({ name: breed });
  
    if (!breedEntity) {
      throw new BadRequestException('Breed not found');
    }
  
    return breedEntity;
  }

}
