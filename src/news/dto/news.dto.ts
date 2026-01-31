import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateImageDto } from '../../common/dto/create-image.dto';

export class newsDto {
    @IsString()
    title: string;

    @IsString()
    mini_title: string;

    @IsString()
    content: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateImageDto)
    images?: CreateImageDto[];
}
