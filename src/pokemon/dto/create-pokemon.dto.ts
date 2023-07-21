import {
  IsInt,
  IsPositive,
  IsString,
  MinLength,
} from '@nestjs/class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  pokemon_number: number;

  @IsString()
  @MinLength(1)
  name: string;
}
