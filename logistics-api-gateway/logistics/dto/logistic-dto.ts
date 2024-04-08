class LogisticDTO {
    orderId: string;
    orderName: string;
    orderDescription: string;
    orderPrice: number;
    orderQuantity: number;
    status: string;
    deliveryName: string;
    deliveryAddress: string;
    deliveryPhone: string;
    deliveryEmail: string;
    senderName: string;
    senderAddress: string;
    senderEmail: string;
    createdAt?: Date;
    updatedAt?: Date;
  
    constructor({
      order_id,
      order_name,
      order_description,
      order_price,
      order_quantity,
      status,
      delivery_name,
      delivery_address,
      delivery_phone,
      delivery_email,
      sendername,
      sender_address,
      sender_email,
      created_at,
      updated_at
    }: {
      order_id: string;
      order_name: string;
      order_description: string;
      order_price: number;
      order_quantity: number;
      status: string;
      delivery_name: string;
      delivery_address: string;
      delivery_phone: string;
      delivery_email: string;
      sendername: string;
      sender_address: string;
      sender_email: string;
      created_at?: Date;
      updated_at?: Date;
    }) {
      this.orderId = order_id;
      this.orderName = order_name;
      this.orderDescription = order_description;
      this.orderPrice = order_price;
      this.orderQuantity = order_quantity;
      this.status = status;
      this.deliveryName = delivery_name;
      this.deliveryAddress = delivery_address;
      this.deliveryPhone = delivery_phone;
      this.deliveryEmail = delivery_email;
      this.senderName = sendername;
      this.senderAddress = sender_address;
      this.senderEmail = sender_email;
      
      this.createdAt = created_at;
      this.updatedAt = updated_at;
    }
  }
  
  export default LogisticDTO;
  