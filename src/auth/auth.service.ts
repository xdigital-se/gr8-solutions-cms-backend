import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, response: Response) {
    const payload = { email: user.email, sub: user.id };

    // if (user.is_two_factor) {
    //   const verify_code = uuidv4().slice(0, 4);

    //   await this.prisma.user.update({
    //     where: {
    //       id: user.id,
    //     },
    //     data: {
    //       two_factor_code: verify_code,
    //     },
    //   });

    //   await this.mailerService.sendMail({
    //     to: user.email,
    //     from: 'authentication@clposting.ca',
    //     subject: 'Your Login Code',
    //     html: `<h3> Here is Your Code: ${verify_code} </h3>`,
    //   });
    // }
    const access_token = this.jwtService.sign(payload);
    response.cookie('jwt', access_token, { httpOnly: true });
    return {
      // is_two_factor_enabled: user.is_two_factor,
      access_token,
    };
  }

  async verify(id: number, code: string) {
    console.log(id);
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (code.toLowerCase() === user.two_factor_code.toLowerCase()) {
      return {
        sucess: true,
      };
    } else {
      return { sucess: false };
    }
  }
}
