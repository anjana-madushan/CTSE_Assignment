import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { signUp, login, refreshToken, logout, checkToken } from '../service/user-service';
import User from '../model/user-model';

jest.mock('bcrypt');
jest.mock('jsonwebtoken'); // Mock the jsonwebtoken module

//Sign Up function unit tests
describe('signUp Function', () => {
  let req: { body: any; }, res: { status: any; json: any; };

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //Sign Up function unit test -1
  // it('should create a new user and return success message if user does not exist', async () => {
  //   req.body.email = 'test@example.com';
  //   req.body.password = 'password123';

  //   // Mock User.findOne to return null (user does not exist)
  //   User.findOne = jest.fn().mockResolvedValueOnce(null);

  //   // Mock bcrypt.genSalt and bcrypt.hash
  //   (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce('salt');
  //   (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

  //   await signUp(req, res);

  //   expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
  //   expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
  //   expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
  //   expect(User.prototype.save).toHaveBeenCalled(); // Assuming User.save is mocked
  //   expect(res.status).toHaveBeenCalledWith(201);
  //   expect(res.json).toHaveBeenCalledWith({ message: 'User signed up successfully.' });
  // };

  //Sign Up function unit test -2
  it('should return error message if user already exists', async () => {
    req.body.email = 'existing@example.com';
    req.body.password = 'password123';

    // Mock User.findOne to return an existing user
    User.findOne = jest.fn().mockResolvedValueOnce({ email: 'existing@example.com' });

    await signUp(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'existing@example.com' });
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists.' });
  });

  //Sign Up function unit test -3
  it('should return error message if an error occurs during sign-up process', async () => {
    req.body.email = 'test@example.com';
    req.body.password = 'password123';

    // Mock User.findOne to throw an error
    User.findOne = jest.fn().mockRejectedValueOnce(new Error('Database error'));

    await signUp(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Signing up failed, please try again later.' });
  });
});


//Login function unit test cases
describe('login Function', () => {
  let req: { body: any }, res: { status: jest.Mock<any, any[]>; json: jest.Mock<any, any[]>; setHeader: jest.Mock };

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      setHeader: jest.fn(), // Mock setHeader function
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if email or password is missing', async () => {
    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password.' });
  });

  it('should return error if user does not exist', async () => {
    req.body.email = 'test@example.com';
    req.body.password = 'password123';

    User.findOne = jest.fn().mockResolvedValueOnce(null);

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password.' });
  });

  it('should return error if password is incorrect', async () => {
    req.body.email = 'test@example.com';
    req.body.password = 'password123';

    User.findOne = jest.fn().mockResolvedValueOnce({ email: 'test@example.com', password: 'hashedPassword' });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await login(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password.' });
  });
});

//logout function unit test
describe('logout Function', () => {
  let req: { headers: any }, res: { status: jest.Mock<any, any[]>; json: jest.Mock<any, any[]>; removeHeader: jest.Mock<any, any[]> }; // Update type definition to include removeHeader

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      removeHeader: jest.fn(), // Add removeHeader property
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return error message if token is not found in headers', () => {
    logout(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token not found in headers' });
    expect(jwt.verify).not.toHaveBeenCalled(); // Ensure jwt.verify is not called
    expect(res.removeHeader).not.toHaveBeenCalled(); // Ensure res.removeHeader is not called
  });

  it('should return error message if token verification fails', () => {
    req.headers['x-auth-token'] = 'invalid_token';

    // Mock jwt.verify to throw an error (token verification failure)
    (jwt.verify as jest.Mock).mockImplementationOnce((_token, _secret, callback) => {
      callback('Verification failed');
    });

    logout(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication failed' });
    expect(res.removeHeader).not.toHaveBeenCalled(); // Ensure res.removeHeader is not called
  });

  it('should successfully logout and remove token from headers', () => {
    req.headers['x-auth-token'] = 'valid_token';

    // Mock jwt.verify to not throw any errors (token verification success)
    (jwt.verify as jest.Mock).mockImplementationOnce((_token, _secret, callback) => {
      callback(null);
    });

    logout(req, res);

    expect(res.removeHeader).toHaveBeenCalledWith('x-auth-token');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Successfully Logged Out' });
  });
});