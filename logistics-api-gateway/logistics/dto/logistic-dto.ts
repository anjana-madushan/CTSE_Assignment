class LogisticDTO {
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

  constructor({
    orderName,
    orderDescription,
    orderPrice,
    orderQuantity,
    status,
    deliveryName,
    deliveryAddress,
    deliveryPhone,
    deliveryEmail,
    senderName,
    senderAddress,
    senderEmail,
  }: {
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
  }) {
    this.orderName = orderName;
    this.orderDescription = orderDescription;
    this.orderPrice = orderPrice;
    this.orderQuantity = orderQuantity;
    this.status = status;
    this.deliveryName = deliveryName;
    this.deliveryAddress = deliveryAddress;
    this.deliveryPhone = deliveryPhone;
    this.deliveryEmail = deliveryEmail;
    this.senderName = senderName;
    this.senderAddress = senderAddress;
    this.senderEmail = senderEmail;
  } 
}

export default LogisticDTO;
