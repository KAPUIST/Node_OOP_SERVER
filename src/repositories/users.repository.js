export default class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findUserByEmail = async (email) => {
    const user = await this.prisma.users.findUnique({ where: { email } });
    return user;
  };
  findUserById = async (userId) => {
    const user = await this.prisma.users.findUnique({ where: { user_id: userId } });
    console.log(user);
    return user;
  };
  findUserInfoById = async (userId) => {
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        email: true,
        created_at: true,
        updated_at: true,
        user_info: {
          select: {
            username: true,
            gender: true,
            age: true,
            role: true
          }
        }
      }
    });
    return user;
  };
  findUserAndTokenById = async (userId) => {
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        user_refresh_token: {
          select: {
            token: true
          }
        }
      }
    });
    return user;
  };
  #createUser = async (email, hashedPassword, tx) => {
    return await tx.users.create({
      data: {
        email: email,
        password: hashedPassword
      }
    });
  };

  #createUserInfo = async (userId, userInfo, tx) => {
    return await tx.user_info.create({
      data: {
        user_id: userId,
        username: userInfo.username,
        age: +userInfo.age,
        gender: userInfo.gender
      }
    });
  };

  createUserTransaction = async (userInputData) => {
    return await this.prisma.$transaction(async (tx) => {
      const { username, age, gender } = userInputData;

      const newUser = await this.#createUser(userInputData.email, userInputData.password, tx);
      console.log(newUser);
      const newUserInfo = await this.#createUserInfo(newUser.user_id, { username, age, gender }, tx);

      const { password, ...userWithoutPassword } = newUser;
      return {
        ...userWithoutPassword,
        userInfo: newUserInfo
      };
    });
  };
  findUserTokenByUserId = async (userId) => {
    return await this.prisma.user_refresh_token.findUnique({ where: { user_id: userId } });
  };
  upsertUserToken = async (userId, hashedRefreshToken) => {
    const result = await this.prisma.user_refresh_token.upsert({
      where: { user_id: userId },
      create: {
        token: hashedRefreshToken,
        user_id: userId
      },
      update: {
        token: hashedRefreshToken
      }
    });
    return result;
  };
  deleteUserToken = async (userId) => {
    return await this.prisma.user_refresh_token.delete({ where: { user_id: userId } });
  };
}
