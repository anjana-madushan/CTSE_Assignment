import Logistic from "../model/logistic-model";
import LogisticDTO from "../dto/logistic-dto";

//Generate a unique four digit order number
const generateOrderNumber = async (): Promise<string> => {
  while (true) {
    const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
    const existingOrder = await Logistic.findOne({ order_id: orderNumber });
    if (!existingOrder) {
      return orderNumber;
    }
  }
};

//Create a new logistic order
export const createLogisticOrder = async (req: any, res: any): Promise<any> => {
  const { LogisticDTO } = req.body;

  if (!LogisticDTO) {
    return res
      .status(400)
      .json({ message: "LogisticDTO is required in the request body" });
  }

  if (!LogisticDTO.orderName) {
    console.log("order", LogisticDTO.orderName);
    return res.status(400).json({ message: "Order name is required" });
  }
  if (!LogisticDTO.orderDescription) {
    return res.status(400).json({ message: "Order description is required" });
  }
  if (!LogisticDTO.orderPrice) {
    return res.status(400).json({ message: "Order price is required" });
  }
  if (!LogisticDTO.orderQuantity) {
    return res.status(400).json({ message: "Order quantity is required" });
  }
  if (!LogisticDTO.status) {
    return res.status(400).json({ message: "Status is required" });
  }
  if (!LogisticDTO.deliveryName) {
    return res.status(400).json({ message: "Delivery name is required" });
  }
  if (!LogisticDTO.deliveryAddress) {
    return res.status(400).json({ message: "Delivery address is required" });
  }
  if (!LogisticDTO.deliveryPhone) {
    return res.status(400).json({ message: "Delivery phone is required" });
  }
  if (!LogisticDTO.deliveryEmail) {
    return res.status(400).json({ message: "Delivery email is required" });
  }
  if (!LogisticDTO.senderName) {
    return res.status(400).json({ message: "Sender name is required" });
  }
  if (!LogisticDTO.senderAddress) {
    return res.status(400).json({ message: "Sender address is required" });
  }
  if (!LogisticDTO.senderEmail) {
    return res.status(400).json({ message: "Sender email is required" });
  }

  console.log("LogisticDTO", LogisticDTO);
  try {
    const logistic = new Logistic({
      order_id: await generateOrderNumber(),
      order_name: LogisticDTO.orderName,
      order_description: LogisticDTO.orderDescription,
      order_price: LogisticDTO.orderPrice,
      order_quantity: LogisticDTO.orderQuantity,
      status: LogisticDTO.status,
      delivery_name: LogisticDTO.deliveryName,
      delivery_address: LogisticDTO.deliveryAddress,
      delivery_phone: LogisticDTO.deliveryPhone,
      delivery_email: LogisticDTO.deliveryEmail,
      sendername: LogisticDTO.senderName,
      sender_address: LogisticDTO.senderAddress,
      sender_email: LogisticDTO.senderEmail,
      created_at: new Date(),
    });

    await logistic.save();
    return res
      .status(201)
      .json({ message: "Order created successfully" + LogisticDTO });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" + error });
  }
};

// Update a logistic order
export const updateLogisticOrder = async (req: any, res: any): Promise<any> => {
  const order_id = req.params.orderid;
  let logisticDTO; // Declare logisticDTO variable

  try {
    const updates = req.body; // Assuming req.body contains the fields to update
    logisticDTO = await Logistic.findOne({ order_id: order_id });
    if (!logisticDTO) {
      return res.status(404).send({ error: "Order not found" });
    }

    // // Check if each field to update exists in the LogisticDTO
    // for (const key in updates) {
    //   if (!(key in logisticDTO)) {
    //     return res.status(400).send({ error: "Invalid field: " + key });
    //   }
    // }

    // Apply updates to logisticDTO
    Object.assign(logisticDTO, updates);

    // Update the 'updatedAt' field
    logisticDTO.updated_at = new Date();

    await logisticDTO.save(); // Save the updated document
    return res.status(200).send({ message: "Order updated successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" + error });
  }
};

// Get all logistic orders
export const getAllLogisticOrders = async (req: any,res: any): Promise<any> => {
  try {
    const logistics = await Logistic.find();
    return res.status(200).send(logistics);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" + error });
  }
};

// Get a logistic order by order ID
export const getLogisticOrderByID = async (req: any, res: any): Promise<any> => {
  const order_id = req.params.order_id;
  try {
    const logistic = await Logistic.findOne({ order_id: order_id });
    return res.status(200).send(logistic);
  } catch (error) {
    return res.status(404).send({ error: "Order not found" });
  }
};

// Delete a logistic order by order ID
export const deleteLogisticOrderByID = async (req: any, res: any): Promise<any> => {
  const order_id = req.params.order_id;
  try {
    await Logistic.findOneAndDelete({ order_id: order_id });
    return res.status(200).send({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(404).send({ error: "Order not found" });
  }
};
