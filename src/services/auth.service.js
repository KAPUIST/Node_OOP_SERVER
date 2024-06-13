import bcrypt from "bcrypt";
export default class AuthService {
  constructor(usersRepository, jwtService) {
    this.usersRepository = usersRepository;
    this.jwtService = jwtService;
  }
  findUserByEmail = async (email) => {
    const user = await this.usersRepository.findUserByEmail(email);
    return user;
  };
  findUserById = async (userId) => {
    const user = await this.usersRepository.findUserById(userId);
    return user;
  };
  findUserInfoById = async (userId) => {
    const user = await this.usersRepository.findUserInfoById(userId);
    return user;
  };

  findUserAndTokenById = async (userId) => {
    const user = await this.usersRepository.findUserAndTokenById(userId);
    return user;
  };
  createUser = async (userInputData) => {
    userInputData.password = await bcrypt.hash(userInputData.password, 10);
    return await this.usersRepository.createUserTransaction(userInputData);
  };

  authenticateUser = async (userId) => {
    const tokens = await this.#generateToken(userId);
    const hashedRefreshToken = this.jwtService.hashedToken(tokens.refreshToken);

    await this.usersRepository.upsertUserToken(userId, hashedRefreshToken);
    return tokens;
  };

  deleteUserToken = async (userId) => {
    return await this.usersRepository.deleteUserToken(userId);
  };

  comparePassword = async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  };

  #generateToken = async (userId) => {
    const accessToken = this.jwtService.generateAccessToken(userId);
    const refreshToken = this.jwtService.generateRefreshToken(userId);
    return { accessToken, refreshToken };
  };
}
