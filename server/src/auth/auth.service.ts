import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign_up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign_in.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(SignUpDto: SignUpDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: SignUpDto.email },
    });
    if (existingUser) throw new UnauthorizedException('Email already in use');
    const hashedPassword = await bcrypt.hash(SignUpDto.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email: SignUpDto.email,
        password: hashedPassword,
        fullName: SignUpDto.fullName || '',
        role: 'USER',
      },
    });
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
