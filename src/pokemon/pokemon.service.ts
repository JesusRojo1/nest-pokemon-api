import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PokeResponse } from 'src/seed/interfaces/pokemon-result.intarface';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private limitQuery;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.limitQuery = configService.get<number>('defaultLimitQuery');
    console.log(this.limitQuery);
  }

  private getPokemonResponse: PokeResponse[] = [];

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      console.log(createPokemonDto);
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handlerExceptions(error);
    }
  }

  async findAll(PaginationDto: PaginationDto) {
    console.log(+this.limitQuery);
    const { limit = +this.limitQuery, offset = 0 } = PaginationDto;
    const pokemon = await this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        pokemon_number: 1,
      })
      .select('-__v');
    return pokemon;
  }

  async findOne(query: string) {
    let pokemon: Pokemon;

    //Validate value insert endpoint
    if (!isNaN(+query)) {
      pokemon = await this.pokemonModel.findOne({ pokemon_number: +query });
      console.log(pokemon);
    }

    //Validate mongoID if exists
    if (isValidObjectId(query)) {
      pokemon = await this.pokemonModel.findById(query);
    }

    //Validate pokemon name exists
    if (JSON.stringify(pokemon) === undefined) {
      pokemon = await this.pokemonModel.findOne({
        name: query.toLowerCase().trim(),
      });
    }

    //Validate pokemon if exists
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, number or name '${query}' not found`,
      );

    return pokemon;
  }

  async update(query: string, updatePokemonDto: UpdatePokemonDto) {
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();

    try {
      const updatePokemon = await this.pokemonModel.findByIdAndUpdate(
        query,
        updatePokemonDto,
        { new: true },
      );
      return updatePokemon;
    } catch (error) {
      this.handlerExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(
        `Pokemon with id: ${id}, has been not found`,
      );

    return;
  }

  private handlerExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new BadRequestException(`Opss..! Pokemon exists in db`);
  }
}
