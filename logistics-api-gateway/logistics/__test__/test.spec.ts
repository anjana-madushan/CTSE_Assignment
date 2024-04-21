import { createLogisticOrder, getAllLogisticOrders, getLogisticOrderByID } from '../src/service/logistic-service';
import LogisticDTO from '../src/dto/logistic-dto';
import Logistic from '../src/model/logistic-model';
import mockOrders from '../mockOrders.json';

//Unit test cases for createLogisticOrders
describe('createLogisticOrder Function', () => {
  let req: { body: {} }, res: { status: jest.Mock<any, any>; json: jest.Mock<any, any> };

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return 400 status with message if LogisticDTO is missing in request body', async () => {
    await createLogisticOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "LogisticDTO is required in the request body" });
  });


  it('should return 400 status with message if any required field is missing in LogisticDTO', async () => {
    let req: { body: { LogisticDTO: any } }, res: { status: jest.Mock<any, any>; json: jest.Mock<any, any> };
    req = {
      body: {
        LogisticDTO: {
          // Missing orderName intentionally to test the validation
          orderDescription: 'Test Description',
          orderPrice: 100,
          orderQuantity: 1,
          status: 'Pending',
          deliveryName: 'John Doe',
          deliveryAddress: '123 Main St',
          deliveryPhone: '123-456-7890',
          deliveryEmail: 'john@example.com',
          senderName: 'Jane Doe',
          senderAddress: '456 Elm St',
          senderEmail: 'jane@example.com',
        }
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createLogisticOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    // Check for message for the missing field
    expect(res.json).toHaveBeenCalledWith({
      message: "Order name is required"
    });
  });
});



describe('getAllLogisticOrders Function', () => {
  let req: any, res: { status: jest.Mock<any, any>; send: jest.Mock<any, any> };

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all logistic orders if successful', async () => {
    const findMock = jest.fn().mockResolvedValueOnce(mockOrders);
    Logistic.find = findMock;

    await getAllLogisticOrders(req, res);

    expect(Logistic.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockOrders);
  });

  it('should return 500 error if an internal server error occurs', async () => {
    const mockError = new Error('Database error');
    const findMock = jest.fn().mockRejectedValueOnce(mockError);
    Logistic.find = findMock;

    await getAllLogisticOrders(req, res);

    expect(Logistic.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: 'Internal server error' + mockError });
  });
});


describe('getLogisticOrderByID Function', () => {
  let req: { params: { order_id: string } }, res: { status: jest.Mock<any, any>; send: jest.Mock<any, any> };

  beforeEach(() => {
    req = {
      params: {
        order_id: 'or124', // Set a sample order_id
      },
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the logistic order if found', async () => {

    // Mock Logistic.findOne to resolve with mockLogistic
    Logistic.findOne = jest.fn().mockResolvedValueOnce(mockOrders);

    await getLogisticOrderByID(req, res);

    expect(Logistic.findOne).toHaveBeenCalledWith({ order_id: 'or124' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockOrders);
  });
});