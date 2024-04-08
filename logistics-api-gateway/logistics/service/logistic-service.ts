import Logistic from "../model/logistic-model";
import LogisticDTO from "../dto/logistic-dto";
import { generateToken, authenticateToken } from '../middleware/jwt-authenticator'; // Import the JWT middleware functions

//Generate a unique four digit order number
export const generateOrderNumber = (): string => {
  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  Logistic.findById({ order_id: orderNumber }).then((order) => {
    if (order) {
      generateOrderNumber();
    }
  });
  return orderNumber.toString();
};

//Create a new logistic order
export const createLogisticOrder = async (
  logisticDTO: LogisticDTO
): Promise<LogisticDTO> => {
  if (!logisticDTO.orderName || !logisticDTO.orderDescription || !logisticDTO.orderPrice || !logisticDTO.orderQuantity || !logisticDTO.status || !logisticDTO.deliveryName || !logisticDTO.deliveryAddress || !logisticDTO.deliveryPhone || !logisticDTO.deliveryEmail || !logisticDTO.senderName || !logisticDTO.senderAddress || !logisticDTO.senderEmail) {
    throw new Error("Invalid input. All fields are required");
  }

  try {
    const token = generateToken(logisticDTO.orderId); // Generate token for this order
    const logistic = new Logistic({
      order_id: generateOrderNumber(),
      order_name: logisticDTO.orderName,
      order_description: logisticDTO.orderDescription,
      order_price: logisticDTO.orderPrice,
      order_quantity: logisticDTO.orderQuantity,
      status: logisticDTO.status,
      delivery_name: logisticDTO.deliveryName,
      delivery_address: logisticDTO.deliveryAddress,
      delivery_phone: logisticDTO.deliveryPhone,
      delivery_email: logisticDTO.deliveryEmail,
      sendername: logisticDTO.senderName,
      sender_address: logisticDTO.senderAddress,
      sender_email: logisticDTO.senderEmail,
      token: token, // Save generated token to the database
      created_at: new Date(),
    });

    await logistic.save();
    return logisticDTO;
  } catch (error) {
    throw new Error("Order not created");
  }
};

// Update a logistic order
export const updateLogisticOrder = async (
  logisticDTO: LogisticDTO
): Promise<LogisticDTO> => {
  try {
    logisticDTO.updatedAt = new Date();
    const token = generateToken(logisticDTO.orderId); // Generate new token for this order
    await Logistic.findOneAndUpdate(
      { order_id: logisticDTO.orderId },
      { ...logisticDTO, token } // Update token in the database
    );
    return logisticDTO;
  } catch (error) {
    throw new Error("Order not found");
  }
};

// Get all logistic orders
export const getAllLogisticOrders = async (): Promise<any> => {
  try {
    const logistics = await Logistic.find();
    return logistics;
  } catch (error) {
    throw new Error("No orders found");
  }
};

// Get a logistic order by order ID
export const getLogisticOrderByID = async (order_id: string): Promise<any> => {
  try {
    const logistic = await Logistic.findOne({ order_id: order_id });
    return logistic;
  } catch (error) {
    throw new Error("Order not found");
  }
};

// Delete a logistic order by order ID
export const deleteLogisticOrderByID = async (order_id: string): Promise<any> => {
  try {
    await Logistic.findOneAndDelete({ order_id: order_id });
    } catch (error) {
    throw new Error("Order not found");
    }
}

//Check if the token is available
export const getLogisticToken = async (token: string): Promise<boolean> => {
  const logistic = await Logistic.findOne({
    token: token,
  });
  return logistic ? true : false;
}
