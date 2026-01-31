import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateImageDto {
    @IsString()
    path: string;

    @IsOptional()
    @IsNumber()
    size?: number;

    @IsOptional()
    @IsString()
    mime_type?: string;

    @IsOptional()
    @IsString()
    alt_text?: string;
}
