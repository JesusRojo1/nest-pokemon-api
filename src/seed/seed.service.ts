import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/pokemon-result.intarface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonToInsert: { name: string; pokemon_number: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const pokemon_number = +segments[segments.length - 2];

      pokemonToInsert.push({ name, pokemon_number });

      console.log({ name, pokemon_number });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return `Seed executed`;
  }
}
